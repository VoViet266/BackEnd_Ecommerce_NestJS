import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/user/interface/user.interface';
import { Product, ProductDocument } from 'src/product/schemas/product.schemas';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private readonly OrderModel: SoftDeleteModel<OrderDocument>,
    @InjectModel(Product.name)
    private readonly ProductModel: SoftDeleteModel<ProductDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: IUser) {
    // Tạo đơn hàng
    const newOrder = await this.OrderModel.create({
      ...createOrderDto,
      createdBy: {
        id: user._id,
        email: user.email,
      },
    });
    // Dùng for...of để chờ từng sản phẩm được xử lý
    for (const product of createOrderDto.products) {
      const productDoc = await this.ProductModel.findById(product.productId);
      if (!productDoc) {
        return `Không tìm thấy sản phẩm với id ${product.productId}`;
      }
      if (productDoc.stock < product.quantity) {
        return `Sản phẩm ${productDoc.name} không đủ số lượng`;
      }

      // Cập nhật số lượng kho sau khi đơn hàng được tạo
      await this.ProductModel.findByIdAndUpdate(product.productId, {
        stock: productDoc.stock - product.quantity,
      });
    }

    return newOrder;
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
