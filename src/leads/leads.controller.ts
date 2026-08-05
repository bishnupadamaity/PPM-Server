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
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { AddLeadNoteDto } from './dto/add-lead-note.dto';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import type { AuthenticatedRequest } from '../common/types/authenticated-request';

@Controller('leads')
@UseGuards(FirebaseAuthGuard)
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  findAll() {
    return this.leadsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leadsService.findById(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateLeadDto) {
    return this.leadsService.create(dto, req.currentUser!.name);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() dto: UpdateLeadDto) {
    return this.leadsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: string) {
    await this.leadsService.remove(id);
    return { success: true };
  }

  @Post(':id/notes')
  @UseGuards(AdminGuard)
  addNote(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: AddLeadNoteDto,
  ) {
    return this.leadsService.addNote(id, dto, req.currentUser!.name);
  }
}
