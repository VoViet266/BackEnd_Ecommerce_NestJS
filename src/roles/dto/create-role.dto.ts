import { IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({
    message: 'Name không được để trống',
  })
  name: string;

  description: string;

  isActive: boolean;

  permissions: string[];
}
