import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart, CartDocument } from './schemas/cart.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/user/interface/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from 'src/product/schemas/product.schemas';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: SoftDeleteModel<CartDocument>,
    @InjectModel(Product.name)
    private readonly productModel: SoftDeleteModel<ProductDocument>,
  ) {}

  async create(createCartDto: CreateCartDto, user: IUser) {
    const products = await Promise.all(
      createCartDto.products.map(async (product) => {
        const productData = await this.productModel.findById(product.productId);
        if (!productData) {
          throw new Error(`Product with ID ${product.productId} not found`);
        }
        const total = productData.price * product.quantity;
        return {
          productId: product.productId,
          quantity: product.quantity,
          price: productData.price,
          total,
        };
      }),
    );

    return this.cartModel.create({
      ...createCartDto,
      userId: user._id,
      products,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }
  findAll() {
    return this.cartModel.find().exec();
  }

  findOne(id: string) {
    return this.cartModel.findById(id).populate('products.productId').exec();
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return this.cartModel.updateOne(
      {
        _id: id,
      },
      updateCartDto,
    );
  }

  remove(id: number) {
    return this.cartModel.deleteOne({
      _id: id,
    });
  }
}
