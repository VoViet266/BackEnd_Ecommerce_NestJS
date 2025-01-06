import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    name: string;

    @IsNotEmpty({
        message: 'Password không được để trống'
    })
    password: string;

    @IsEmail({}, {
        message: 'Email không đúng định dạng'
    })
    @IsNotEmpty({
        message: 'Email không được để trống'
    })
    email: string;
    address: string;
    age :string;
}
