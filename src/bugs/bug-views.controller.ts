import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BugViewsService } from './bug-views.service';
import { CreateBugViewDto } from './dto/create-bug-view.dto';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import { ApprovedGuard } from '../common/guards/approved.guard';
import type { AuthenticatedRequest } from '../common/types/authenticated-request';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';

// Separate controller (rather than nested under /bugs) so its static routes
// never have to be ordered around BugsController's `:id` params.
@Controller('bug-views')
@UseGuards(FirebaseAuthGuard)
@UseInterceptors(ResponseInterceptor)
export class BugViewsController {
  constructor(private readonly bugViewsService: BugViewsService) {}

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.bugViewsService.findAllForUser(req.firebaseUser.uid);
  }

  @Post()
  @UseGuards(ApprovedGuard)
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateBugViewDto) {
    return this.bugViewsService.create(dto, req.firebaseUser.uid);
  }

  @Delete(':id')
  @UseGuards(ApprovedGuard)
  async remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    await this.bugViewsService.remove(id, req.firebaseUser.uid);
  }
}
