import { SetMetadata } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RolesUser } from 'src/Constant/roles.enum';

// Define a custom decorator to mark a route as public
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// Define a custom decorator to mark a route as protected
export const Roles = (...roles: RolesUser[]) => SetMetadata('roles', roles);

// Define a custom decorator to get the user from the request
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const RESPONSE_MESSAGE = 'response_Message';
export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE, message);
