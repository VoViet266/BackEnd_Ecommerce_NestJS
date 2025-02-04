import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/user/interface/user.interface';

@Controller('api/v1/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto, @User() user: IUser) {
    return this.categoryService.create(createCategoryDto, user);
  }

  @Get()
  @ResponseMessage('Lây danh sách danh mục thành công')
  @Public()
  findAll(
    @Query('page') currentPage: string,
    @Query('limit') limit: string,
    @Query() qs: string,
  ) {
    return this.categoryService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @Public()
  @ResponseMessage('Lấy thông tin danh mục thành công')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật danh mục thành công')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @User() user: IUser,
  ) {
    return this.categoryService.update(id, updateCategoryDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Xóa danh mục thành công')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
