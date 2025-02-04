import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongodb';
import mongoose, { HydratedDocument } from 'mongoose';
import { Brand } from 'src/brand/schemas/brand.schema';
import { Category } from 'src/category/schemas/category.schemas';
import { TypeImage } from 'src/constant/typeImage.enum';

export type ProductDocument = HydratedDocument<Product>;
class Image {
  @Prop({ type: String, required: true })
  main: string[];
  @Prop({ type: String, required: true })
  thumbnail: string[];
  @Prop({ type: String })
  gallery: string[];
}
@Schema({ timestamps: true })
export class Product {
  @Prop({ type: String, required: true })
  name: string; 

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop()
  stock: number; //số lượng tồn kho

  @Prop()
  discount: number; //phần trăm giảm giá, nếu có

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: Category.name,
  })
  categoryId: mongoose.Types.ObjectId[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: Brand.name,
  })
  brandId: mongoose.Types.ObjectId[];

  @Prop()
  images: Image[];

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

export const ProductSchema = SchemaFactory.createForClass(Product);
