import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bug } from './bug.entity';
import { BugComment } from './bug-comment.entity';
import { BugView } from './bug-view.entity';
import { BugsService } from './bugs.service';
import { BugsController } from './bugs.controller';
import { BugViewsService } from './bug-views.service';
import { BugViewsController } from './bug-views.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bug, BugComment, BugView]), UsersModule],
  controllers: [BugsController, BugViewsController],
  providers: [BugsService, BugViewsService],
})
export class BugsModule {}
