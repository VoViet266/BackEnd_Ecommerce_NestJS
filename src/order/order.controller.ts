import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { use } from 'passport';
import { IUser } from 'src/user/interface/user.interface';
import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter';

@Controller('/api/v1/order')
@UseFilters(HttpExceptionFilter)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ResponseMessage('Tạo đơn hàng thành công')
  create(@Body() createOrderDto: CreateOrderDto, @User() user: IUser) {
    return this.orderService.create(createOrderDto, user);
  }

  @Get()
  @ResponseMessage('Lấy danh sách đơn hàng thành công')
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin đơn hàng thành công')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật đơn hàng thành công')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @User() user: IUser,
  ) {
    return this.orderService.update(id, updateOrderDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Xóa đơn hàng thành công')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
