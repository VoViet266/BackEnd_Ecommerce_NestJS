import { IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty({
    message: 'Name không được để trống',
  })
  name: string;

  @IsNotEmpty({
    message: 'Address không được để trống',
  })
  address: string;

  description: string;

  createdBy: {
    _id: string;
    email: string;
  };
}
