import {
  Controller,
  Get,
  UseGuards,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './common/guards/jwt.auth.guard';
import { Public } from './decorator/customize';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller()
@UseInterceptors(CacheInterceptor)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @Public()
  getHello() {
    console.log('day la controller');
    return this.appService.getHello();
  }
}
