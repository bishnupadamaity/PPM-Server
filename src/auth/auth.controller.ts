import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import type { AuthenticatedRequest } from '../common/types/authenticated-request';

@Controller('auth')
@UseGuards(FirebaseAuthGuard)
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  /** Called right after Firebase login succeeds — upserts the Postgres profile. */
  @Post('sync')
  sync(@Req() req: AuthenticatedRequest) {
    return this.usersService.syncOnLogin(req.firebaseUser);
  }
}
