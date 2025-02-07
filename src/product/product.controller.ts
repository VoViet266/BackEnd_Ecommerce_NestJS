import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public, ResponseMessage, Roles, User } from 'src/decorator/customize';
import { IUser } from 'src/user/interface/user.interface';
import { RolesUser } from 'src/constant/roles.enum';

@Controller('api/v1/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ResponseMessage('Tạo sản phẩm thành công')
  // @Roles(RolesUser.Admin)
  create(@Body() createProductDto: CreateProductDto, @User() user: IUser) {
    return this.productService.create(createProductDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage('Lấy danh sách sản phẩm thành công')
  findAll(
    @Query('page') currentPage: string,
    @Query('limit') limit: string,
    @Query() qs: string,
  ) {
    return this.productService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('lấy thông tin sản phẩm thông qua Id thành công')
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Câp nhật sản phẩm thành công')
  @Roles(RolesUser.Admin)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @User() user: IUser,
  ) {
    return this.productService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Roles(RolesUser.Admin)
  @ResponseMessage('Đã xóa sản phẩm thành công')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
