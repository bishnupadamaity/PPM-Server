import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BugsService } from './bugs.service';
import { CreateBugDto } from './dto/create-bug.dto';
import { UpdateBugDto } from './dto/update-bug.dto';
import { CreateBugCommentDto } from './dto/create-bug-comment.dto';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import { ApprovedGuard } from '../common/guards/approved.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import type { AuthenticatedRequest } from '../common/types/authenticated-request';

@Controller('bugs')
@UseGuards(FirebaseAuthGuard)
export class BugsController {
  constructor(private readonly bugsService: BugsService) {}

  @Get()
  findAll() {
    return this.bugsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bugsService.findById(id);
  }

  @Post()
  @UseGuards(ApprovedGuard)
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateBugDto) {
    return this.bugsService.create(dto, req.currentUser!.name);
  }

  @Patch(':id')
  @UseGuards(ApprovedGuard)
  update(@Param('id') id: string, @Body() dto: UpdateBugDto) {
    return this.bugsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: string) {
    await this.bugsService.remove(id);
    return { success: true };
  }

  @Get(':id/comments')
  findComments(@Param('id') id: string) {
    return this.bugsService.findComments(id);
  }

  @Post(':id/comments')
  @UseGuards(ApprovedGuard)
  addComment(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: CreateBugCommentDto,
  ) {
    return this.bugsService.addComment(id, dto, {
      id: req.currentUser!.id,
      name: req.currentUser!.name,
    });
  }
}
