import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './passport/local.guard';
import { AuthService } from './auth.service';
import { Public } from '../decorator/customize';

@Controller() // Namespace cho module Auth
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('/login')
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }
}
