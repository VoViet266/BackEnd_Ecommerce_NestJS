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
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/user/interface/user.interface';
import { BrandCacheService } from './brand.cache.service';

@Controller('/api/v1/brand')
export class BrandController {
  constructor(
    private readonly brandService: BrandService,
    private readonly brandCacheService: BrandCacheService,
  ) {}

  @Post()
  @ResponseMessage('Brand created successfully')
  create(@Body() createBrandDto: CreateBrandDto, @User() user: IUser) {
    return this.brandService.create(createBrandDto, user);
  }
  @Get()
  @ResponseMessage('Get all Brand success')
  findAll(
    @Query('page') currentPage: string,
    @Query('limit') limit: string,
    @Query() qs: string,
  ) {
    return this.brandService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Get Brand by id success')
  async findOne(@Param('id') id: string) {
    const brandCache = await this.brandCacheService.getBrandFromCache(id);
    if (brandCache) {
      return brandCache;
    }
    const brand = await this.brandService.findOne(id);
    await this.brandCacheService.setBrandToCache(id, brand);
    return brand;
  }

  @Patch(':id')
  @ResponseMessage('Brand updated successfully')
  update(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
    @User() user: IUser,
  ) {
    return this.brandService.update(id, updateBrandDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Brand deleted successfully')
  remove(@Param('id') id: string) {
    return this.brandService.remove(id);
  }
}
