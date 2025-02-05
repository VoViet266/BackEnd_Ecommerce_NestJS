export class CreateCartDto {
  userId: string;
  products: { productId: string; quantity: number }[];
}
