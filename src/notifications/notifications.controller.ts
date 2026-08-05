import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import type { AuthenticatedRequest } from '../common/types/authenticated-request';

@Controller('notifications')
@UseGuards(FirebaseAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('me')
  findMine(@Req() req: AuthenticatedRequest) {
    return this.notificationsService.findMine(req.firebaseUser.uid);
  }

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(dto, req.firebaseUser.uid);
  }

  @Patch(':id/read')
  markRead(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.notificationsService.markRead(id, req.firebaseUser.uid);
  }

  @Post('mark-all-read')
  async markAllRead(@Req() req: AuthenticatedRequest) {
    await this.notificationsService.markAllRead(req.firebaseUser.uid);
    return { success: true };
  }
}
