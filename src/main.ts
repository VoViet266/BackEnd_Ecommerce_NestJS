import { NestApplication, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/passport/jwt.auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';
import { RolesGuard } from './auth/passport/roles.guard';
import cookieParser = require('cookie-parser');
// require('dotenv').config();

declare const module: any;
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  app.use(cookieParser());
  // Cần phải xác thực token mới cho phép truy cập vào các api khác
  const reflector = app.get(Reflector);
  //jwtAuthGuard và RolesGuard sẽ được sử dụng cho tất cả các route
  // jwtAuthGuard sẽ xác thực token
  // RolesGuard sẽ xác thực role của user
  //
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));

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
