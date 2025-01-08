export class CreateOrderDto {
  userId: string;
  product: { productId: string; quantity: number; price: number }[];
  totalPrice: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
}
