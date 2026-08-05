import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bug } from './bug.entity';
import { BugComment } from './bug-comment.entity';
import { BugsService } from './bugs.service';
import { BugsController } from './bugs.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bug, BugComment]), UsersModule],
  controllers: [BugsController],
  providers: [BugsService],
})
export class BugsModule {}
