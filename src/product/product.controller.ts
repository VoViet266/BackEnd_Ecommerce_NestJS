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
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/user/interface/user.interface';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('api/v1/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ResponseMessage('Product created successfully')
  create(@Body() createProductDto: CreateProductDto, @User() user: IUser) {
    return this.productService.create(createProductDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage('Get all products success')
  findAll(
    @Query('page') currentPage: string,
    @Query('limit') limit: string,
    @Query() qs: string,
  ) {
    return this.productService.findAll(+currentPage, +limit, qs);
  }

  // @Public()
  // @Get('search')
  // @ResponseMessage('Search product success')
  // getProductWithQuery( @Query('page') currentPage: string,
  // @Query('limit') limit: string,
  // @Query() qs: string,) {
  //   return this.productService.findAllByCategory(+currentPage, +limit, qs);
  // }

  @Public()
  @Get(':id')
  @ResponseMessage('Get product by id success')
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Product updated successfully')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @User() user: IUser,
  ) {
    return this.productService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Product deleted successfully')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
