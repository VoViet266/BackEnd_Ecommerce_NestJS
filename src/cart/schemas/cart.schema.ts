import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';
import { Product } from 'src/product/schemas/product.schemas';

export type CartDocument = HydratedDocument<Cart>;
@Schema({
  timestamps: true,
})
export class Cart extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  userId: Types.ObjectId;

  @Prop([
    {
      productId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: Product.name,
      },
      quantity: { type: Number, required: true }, // Số lượng sản phẩm
      price: { type: Number, required: true }, // Giá lúc thêm vào giỏ hàng
      total: { type: Number, required: true }, // Tổng giá trị của sản phẩm trong giỏ hàng
    },
  ])
  products: {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
    total: number;
  }[];

  @Prop()
  createdAt: Date;

  @Prop({
    type: Object,
  })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
