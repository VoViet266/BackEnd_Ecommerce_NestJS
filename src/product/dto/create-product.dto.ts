export class CreateProductDto {
  name: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  categoryId: string[];
  brandId: string;
  images: string[];
}
