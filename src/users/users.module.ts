import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AdminGuard } from '../common/guards/admin.guard';
import { ApprovedGuard } from '../common/guards/approved.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, AdminGuard, ApprovedGuard],
  exports: [UsersService],
})
export class UsersModule {}
