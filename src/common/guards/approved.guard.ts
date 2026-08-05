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
export class ApprovedGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = await this.usersService.findById(request.firebaseUser.uid);
    if (!user?.approved) {
      throw new ForbiddenException('Approved account required');
    }
    request.currentUser = user;
    return true;
  }
}
