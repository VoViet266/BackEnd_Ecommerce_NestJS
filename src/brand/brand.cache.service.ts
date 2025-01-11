import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ProductController } from 'src/product/product.controller';
import { Product, ProductDocument } from 'src/product/schemas/product.schemas';

@Injectable()
export class BrandCacheService {
  constructor(
    // @Inject(Product.name)
    // private readonly productModel: SoftDeleteModel<ProductDocument>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getBrandFromCache(id: string) {
    // Kiểm tra cache
    const cached = await this.cacheManager.get(`brand-${id}`);
    if (cached) {
      return cached; // Trả về từ cache
    }
  }
  async setBrandToCache(id: string, product: any) {
    // Lưu vào cache
    await this.cacheManager.set(`brand-${id}`, JSON.stringify(product), 10);
  }
  //   async deleteProductCache(id: string) {
  //     // Xóa cache
  //     await this.cacheManager.del(`product-${id}`);
  //   }
}
