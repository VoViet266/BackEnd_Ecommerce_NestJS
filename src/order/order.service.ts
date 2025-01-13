import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
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
    let totalPrice = 0;

    for (const product of createOrderDto.products) {
      const productDoc = await this.ProductModel.findById(product.productId);
      if (!productDoc) {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: `Không tìm thấy sản phẩm ${product.productId}`,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      if (productDoc.stock < product.quantity) {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: `Không đủ hàng cho sản phẩm ${productDoc.name}`,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      await this.ProductModel.findByIdAndUpdate(product.productId, {
        stock: productDoc.stock - product.quantity,
      });

      totalPrice += productDoc.price * product.quantity;
    }

    createOrderDto.totalPrice = totalPrice;

    const newOrder = await this.OrderModel.create({
      ...createOrderDto,
      createdBy: {
        id: user._id,
        email: user.email,
      },
    });

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

  async update(id: string, updateOrderDto: UpdateOrderDto, user: IUser) {
    let totalPrice = 0;
    for (const product of updateOrderDto.products) {
      const productDoc = await this.ProductModel.findById(product.productId);
      const order = await this.OrderModel.findById(id);

      //Kiêm tra sản phẩm để quay lại số lượng cũ khi update
      await this.ProductModel.updateOne(
        {
          _id: product.productId,
        },
        {
          stock: (productDoc.stock += order.products.find(
            (p) => p.productId.toString() === product.productId.toString(),
          ).quantity),
        },
      );

      //Kiểm tra số lượng tồn kho khi update
      if (productDoc.stock < product.quantity) {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: `Không đủ hàng cho sản phẩm ${productDoc.name}`,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      //Cập nhật số lượng tồn kho mới
      await this.ProductModel.updateOne(
        {
          _id: product.productId,
        },
        {
          stock: (productDoc.stock -= product.quantity),
        },
      );
      //Tính tổng giá trị đơn hàng
      totalPrice += productDoc.price * product.quantity;
    }
    updateOrderDto.totalPrice = totalPrice;

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
