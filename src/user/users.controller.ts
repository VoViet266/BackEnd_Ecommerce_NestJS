import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose, { mongo } from 'mongoose';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './interface/user.interface';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    return this.usersService.create(createUserDto, user);
  }

  @Get(':id')
  @Public()
  @ResponseMessage('Lấy thông tin người dùng thành công')
  findOne(@Param('id') id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `User with id ${id} not found`;
    }
    return this.usersService.findOne(id);
  }

  @Patch()
  @ResponseMessage('Cập nhật thông tin người dùng thành công')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  @ResponseMessage('Xóa người dùng thành công')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
