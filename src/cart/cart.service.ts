import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart, CartDocument } from './schemas/cart.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/user/interface/user.interface';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name)
    private readonly categoryModel: SoftDeleteModel<CartDocument>,
  ) {}

  create(createCartDto: CreateCartDto, user: IUser) {
    return this.categoryModel.create({
      ...createCartDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }
  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: string) {
    return this.categoryModel
      .findById(id)
      .populate('products.productId')
      .exec();
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
