import { NestApplication, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './common/guards/jwt.auth.guard';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { RolesGuard } from './common/guards/roles.guard';
import cookieParser = require('cookie-parser');
import * as express from 'express';
// require('dotenv').config();

declare const module: any;
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  app.use(cookieParser());
  // Cần phải xác thực token mới cho phép truy cập vào các api khác
  const reflector = app.get(Reflector);
  //jwtAuthGuard và RolesGuard sẽ được sử dụng cho tất cả các route
  // jwtAuthGuard sẽ xác thực token
  // RolesGuard sẽ xác thực role của user
  //
  // app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));
  // app.setViewEngine('ejs');
  app.use(express.json()); // Giải mã JSON
  app.use(express.urlencoded({ extended: true })); // Giải mã x-www-form-urlencoded
  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  const configService = app.get(ConfigService);

  await app.listen(configService.get<string>('PORT'));
  console.log(
    `Application is running on: http://localhost:${configService.get<string>(
      'PORT',
    )}`,
  );
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
