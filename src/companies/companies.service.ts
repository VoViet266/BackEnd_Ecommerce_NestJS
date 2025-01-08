import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/company.schemas';
import { Model } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/user/interface/user.interface';
import aqp from 'api-query-params';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private readonly conpanyModel: SoftDeleteModel<CompanyDocument>,
  ) {}
  create(CreateCompanyDto: CreateCompanyDto, user: IUser) {
    //create company

    let company = this.conpanyModel.create({
      ...CreateCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return company;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10; //nếu không có limit thì mặc định là 10 item

    const totalItems = (await this.conpanyModel.find(filter)).length; // tổng số phần tử
    const totalPages = Math.ceil(totalItems / defaultLimit); // tổng số trang
    const result = await this.conpanyModel
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
    return this.conpanyModel.findById(id);
  }

  update(id: string, updateConpanyDto: UpdateCompanyDto, user: IUser) {
    return this.conpanyModel.updateOne(
      { _id: id },
      {
        ...updateConpanyDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    await this.conpanyModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.conpanyModel.softDelete({ _id: id });
  }
}
