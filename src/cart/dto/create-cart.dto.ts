export class CreateCartDto {
  userId: string;
  product: { productId: string; quantity: number }[];
}
