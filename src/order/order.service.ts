import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/user/interface/user.interface';
import path from 'path';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private readonly OrderModel: SoftDeleteModel<OrderDocument>,
  ) {}
  create(createOrderDto: CreateOrderDto, user: IUser) {
    return this.OrderModel.create({
      ...createOrderDto,
      createdBy: {
        id: user._id,
        email: user.email,
      },
    });
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: string) {
    return this.OrderModel.findById(id)
      .populate([
        {
          path: 'userId',
          select: 'name email',
        },
        {
          path: 'products.productId',
          select: 'name price',
        },
      ])
      .exec();
  }

  update(id: string, updateOrderDto: UpdateOrderDto, user: IUser) {
    return this.OrderModel.updateOne(
      {
        _id: id,
      },
      {
        ...updateOrderDto,
        updatedBy: {
          id: user._id,
          email: user.email,
        },
      },
    );
  }

  remove(id: string) {
    return this.OrderModel.deleteOne({
      _id: id,
    });
  }
}
