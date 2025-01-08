import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RolesUser } from '../../Constant/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<RolesUser[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Kiểm tra quyền người dùng có khớp với roles yêu cầu
    const hasRole = roles.some((role) => user.role.includes(role));
    if (!hasRole || !user || !user.role) {
      throw new ForbiddenException(
        'You do not have permission (Roles) to access this resource',
      );
    }
    return hasRole;
  }
}
