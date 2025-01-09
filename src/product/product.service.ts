import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Product, ProductDocument } from './schemas/product.schemas';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/user/interface/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: SoftDeleteModel<ProductDocument>,
  ) {}

  create(createProductDto: CreateProductDto, user: IUser) {
    return this.productModel.create({
      ...createProductDto,
      // createdBy: {
      //   id: user._id,
      //   email: user.email,
      // },
    });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10; //nếu không có limit thì mặc định là 10 item

    const totalItems = (await this.productModel.find(filter)).length; // tổng số phần tử
    const totalPages = Math.ceil(totalItems / defaultLimit); // tổng số trang
    const result = await this.productModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any) // ép kiểu sort về any
      .populate(population)
      .exec();

    return {
      meta: {
        currentPage: +currentPage, // trang hiện tại
        pageSize: +limit, // số lượng item trên 1 trang
        pages: totalPages, //  tổng số trang với điều kiện query
        total: totalItems, //   tổng số phần tử
      },
      result: result,
    };
  }

  async findOne(id: string) {
    const existingProduct = await this.productModel.findById(id).exec();
    if (!existingProduct) {
      throw new NotFoundException(
        'Product with ID ${id} not found in the database',
      );
    }
    return this.productModel
      .findById(id)
      .populate(['categoryId', 'brandId'])
      .exec();
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: IUser) {
    const existingProduct = await this.productModel.findById(id).exec();

    // Nếu không tồn tại, ném lỗi NotFoundException
    if (!existingProduct) {
      throw new NotFoundException(
        `Product with ID ${id} not found in the database`,
      );
    }
    return this.productModel.updateOne(
      { _id: id },
      {
        ...updateProductDto,
        updatedBy: {
          id: user._id,
          email: user.email,
        },
      },
    );
  }

  remove(id: string) {
    const existingProduct = this.productModel.findById(id).exec();
    if (!existingProduct) {
      throw new NotFoundException(
        `Product with ID ${id} not found in the database`,
      );
    }
    return this.productModel.deleteOne({ _id: id });
  }
}
