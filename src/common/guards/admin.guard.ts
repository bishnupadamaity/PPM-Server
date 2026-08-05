import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { AuthenticatedRequest } from '../types/authenticated-request';

/** Must run after FirebaseAuthGuard — relies on request.firebaseUser. */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = await this.usersService.findById(request.firebaseUser.uid);
    if (!user || user.role !== 'Admin') {
      throw new ForbiddenException('Admin access required');
    }
    request.currentUser = user;
    return true;
  }
}
