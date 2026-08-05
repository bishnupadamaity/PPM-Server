import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagementItem } from './management-item.entity';
import { ManagementService } from './management.service';
import { ManagementController } from './management.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ManagementItem]), UsersModule],
  controllers: [ManagementController],
  providers: [ManagementService],
})
export class ManagementModule {}
