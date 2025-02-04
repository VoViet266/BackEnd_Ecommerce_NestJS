import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Product, ProductDocument } from './schemas/product.schemas';
import { IUser } from 'src/user/interface/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Cache } from 'cache-manager';
import {
  Category,
  CategoryDocument,
} from 'src/category/schemas/category.schemas';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: SoftDeleteModel<ProductDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: SoftDeleteModel<CategoryDocument>, // @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  create(createProductDto: CreateProductDto, user: IUser) {
    const { categoryId, brandId } = createProductDto;
    return this.productModel.create({
      ...createProductDto,
      createdBy: {
        id: user._id,
        email: user.email,
      },
    });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 20; // Nếu không có limit, mặc định 10 item.

    let result: object[]; // Kết quả trả về.
    let totalItems: number = 0;

    // Nếu filter có category hoặc brand, sử dụng aggregate để tìm kiếm theo tên.
    if (filter.category || filter.brand) {
      const matchConditions: any = {};

      if (filter.category) {
        matchConditions['category.name'] = {
          $regex: filter.category,
          $options: 'i',
        };
      }
      if (filter.brand) {
        matchConditions['brand.name'] = { $regex: filter.brand, $options: 'i' };
      }

      const aggregatePipeline = [
        {
          $lookup: {
            from: 'categories', // Tên collection chứa thông tin category.
            localField: 'categoryId', // Trường trong products (ObjectId).
            foreignField: '_id', // Trường trong categories.
            as: 'category', // Tên key mới chứa thông tin category.
          },
        },
        {
          $lookup: {
            from: 'brands', // Tên collection chứa thông tin brand.
            localField: 'brandId', // Trường trong products (ObjectId).
            foreignField: '_id', // Trường trong brands.
            as: 'brand', // Tên key mới chứa thông tin brand.
          },
        },
        {
          $match: matchConditions, // Điều kiện match.
        },
        {
          $project: {
            name: 1,
            description: 1,
            price: 1,
            stock: 1,
            discount: 1,
            images: 1,
            category: {
              _id: { $arrayElemAt: ['$category._id', 0] },
              name: { $arrayElemAt: ['$category.name', 0] },
            },
            brand: {
              _id: { $arrayElemAt: ['$brand._id', 0] },
              name: { $arrayElemAt: ['$brand.name', 0] },
              description: { $arrayElemAt: ['$brand.description', 0] },
              logo: { $arrayElemAt: ['$brand.logo', 0] },
            },
          },
        },
        {
          $facet: {
            totalItems: [{ $count: 'count' }],
            data: [{ $skip: offset }, { $limit: defaultLimit }],
          },
        },
      ];

      const aggregateResults = await this.productModel.aggregate(
        aggregatePipeline,
      );

      result = aggregateResults[0].data;
      totalItems = aggregateResults[0].totalItems[0]?.count || 0; // Tổng số sản phẩm lọc được.
    } else {
      totalItems = await this.productModel.countDocuments(filter);
      result = await this.productModel
        .find(filter)
        .skip(offset)
        .limit(defaultLimit)
        .sort(sort as any) // Ép kiểu sort về any.
        .populate(population)
        .populate('categoryId', 'name') // Populate categoryId với name.
        .populate('brandId', 'name description logo') // Populate brandId với các trường name, description, logo.
        .exec();
    }

    const totalPages = Math.ceil(totalItems / defaultLimit); // Tổng số trang.
    return {
      meta: {
        currentPage: +currentPage, // Trang hiện tại.
        pageSize: defaultLimit, // Số item trên mỗi trang.
        pages: totalPages, // Tổng số trang.
        total: totalItems, // Tổng số sản phẩm.
      },
      result: result, // Kết quả sản phẩm.
    };
  }

  async findOne(id: string) {
    // Kiểm tra cache
    // const cached = await this.cacheManager.get(`product-${id}`);
    // if (cached) {
    //   return cached; // Trả về từ cache
    // }
    // Nếu không có trong cache thì lấy từ database

    const existingProduct = await this.productModel
      .findById(id)
      .populate(['categoryId', 'brandId'])
      .exec();
    if (!existingProduct) {
      throw new NotFoundException(
        `Sản phẩm với ID ${id} không tồn tại trong database`,
      );
    }
    // Lưu vào cache
    // await this.cacheManager.set(`product-${id}`, existingProduct);
    return existingProduct;
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: IUser) {
    const existingProduct = await this.productModel.findById(id).exec();

    // Nếu không tồn tại, ném lỗi NotFoundException
    if (!existingProduct) {
      throw new NotFoundException(
        `Sản phẩm với ID ${id} không tồn tại trong database`,
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

  async remove(id: string) {
    const existingProduct = this.productModel.findById(id).exec();
    if (!existingProduct) {
      throw new NotFoundException(
        `Product with ID ${id} not found in the database`,
      );
    }
    // await this.cacheManager.del(`product-${id}`);
    return this.productModel.deleteOne({ _id: id });
  }
}
