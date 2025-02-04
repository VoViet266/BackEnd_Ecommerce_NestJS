import { IsEmpty } from 'class-validator';

export class CreateProductDto {
  // @IsEmpty({
  //   message: 'Name Không được để trống',
  // })
  name: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  categoryId: string[];
  brandId: string;
  images: string[];
}
