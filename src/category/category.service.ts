import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Category, CategoryDocument } from './schemas/category.schemas';
import { IUser } from 'src/user/interface/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: SoftDeleteModel<CategoryDocument>,
  ) {}

  create(createCategoryDto: CreateCategoryDto, user: IUser) {
    return this.categoryModel.create({
      ...createCategoryDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10; //nếu không có limit thì mặc định là 10 item

    const totalItems = (await this.categoryModel.find(filter)).length; // tổng số phần tử
    const totalPages = Math.ceil(totalItems / defaultLimit); // tổng số trang
    const result = await this.categoryModel
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
  findOne(id: string) {
    return this.categoryModel.findById(id);
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto, user: IUser) {
    return this.categoryModel.updateOne(
      { _id: id },
      {
        ...updateCategoryDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  remove(id: string) {
    return this.categoryModel.deleteOne({ _id: id });
  }
}
