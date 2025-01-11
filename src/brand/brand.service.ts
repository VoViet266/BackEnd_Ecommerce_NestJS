import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Brand, BrandDocument } from './schemas/brand.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/user/interface/user.interface';
import aqp from 'api-query-params';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name)
    private readonly brandModel: SoftDeleteModel<BrandDocument>,
  ) {}
  create(createBrandDto: CreateBrandDto, user: IUser) {
    return this.brandModel.create({
      ...createBrandDto,
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
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.brandModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.brandModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        currentPage: +currentPage,
        pageSize: +limit,
        pages: totalPages,
        total: totalItems,
      },
      result: result,
    };
  }

  findOne(id: string) {
    return this.brandModel.findById(id).exec();
  }

  update(id: string, updateBrandDto: UpdateBrandDto, user: IUser) {
    const existingBrand = this.brandModel.findById(id).exec();
    if (!existingBrand) {
      throw new NotFoundException(`Brand with ${id} not found`);
    }
    return this.brandModel.updateOne(
      { _id: id },
      {
        ...updateBrandDto,
        updatedBy: {
          id: user._id,
          email: user.email,
        },
      },
    );
  }

  remove(id: string) {
    const existingBrand = this.brandModel.findById(id).exec();
    if (!existingBrand) {
      throw new NotFoundException(`Brand with ${id} not found`);
    }
    return this.brandModel.deleteOne({ _id: id });
  }
}
