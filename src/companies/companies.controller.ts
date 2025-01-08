import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ResponseMessage, Roles, User } from 'src/decorator/customize';
import { IUser } from 'src/users/interface/user.interface';
import { RolesUser } from 'src/Constant/roles.enum';

@Controller('api/v1')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post('companies')
  create(@Body() CreateCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return this.companiesService.create(CreateCompanyDto, user);
  }

  @Get('companies')
  @ResponseMessage('Get all companies success')
  @Roles(RolesUser.Admin)
  findAll(
    @Query('page') currentPage: string,
    @Query('limit') limit: string,
    @Query() qs: string,
  ) {
    return this.companiesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch('/companies/:id')
  update(
    @Param('id') id: string,
    @Body() updateConpanyDto: UpdateCompanyDto,
    @User() user: IUser,
  ) {
    return this.companiesService.update(id, updateConpanyDto, user);
  }

  @Delete('/companies/:id')
  remove(@Param('id') id: string, @User() user: IUser) {
    console.log('Đã xoá thành công company có id: ', id);
    return this.companiesService.remove(id, user);
  }
}
