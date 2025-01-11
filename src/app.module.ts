import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './user/users.module';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { PermissionsModule } from './permission/permissions.module';
import { RolesModule } from './role/roles.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';
import { OrderModule } from './order/order.module';
import { CartModule } from './cart/cart.module';
import { mongodbConfig } from './config/mongodb.config';
import { FileModule } from './file/file.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-yet';

@Module({
  imports: [
    MongooseModule.forRootAsync(mongodbConfig),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        socket: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
        store: redisStore.redisStore,
        username: configService.get<string>('REDIS_USERNAME'),
        password: configService.get<string>('REDIS_PASSWORD'),
        ttl: 30 * 1000, // Thời gian sống của cache (tính bằng giây)
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    CompaniesModule,
    PermissionsModule,
    RolesModule,
    ProductModule,
    CategoryModule,
    BrandModule,
    OrderModule,
    CartModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
