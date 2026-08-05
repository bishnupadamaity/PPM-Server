import { randomUUID } from 'crypto';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
    private readonly usersService: UsersService,
  ) {}

  findMine(userId: string): Promise<Notification[]> {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  /**
   * Any approved user may create a notification on behalf of another user
   * (e.g. assigning a bug to someone else) — mirrors the Firestore rule's
   * trust model, same level as other ticket writes.
   */
  async create(
    dto: CreateNotificationDto,
    requestingUserId: string,
  ): Promise<Notification> {
    const requestingUser = await this.usersService.findById(requestingUserId);
    if (!requestingUser?.approved) {
      throw new ForbiddenException('Only approved users may create notifications');
    }
    return this.repo.save(
      this.repo.create({
        id: randomUUID(),
        ...dto,
        actorName: requestingUser.name,
      }),
    );
  }

  /** Only the recipient may mark their own notification read. */
  async markRead(id: string, requestingUserId: string): Promise<Notification> {
    const notification = await this.repo.findOne({ where: { id } });
    if (!notification) throw new NotFoundException('Notification not found');
    if (notification.userId !== requestingUserId) {
      throw new ForbiddenException('Not your notification');
    }
    notification.read = true;
    return this.repo.save(notification);
  }

  async markAllRead(requestingUserId: string): Promise<void> {
    await this.repo.update(
      { userId: requestingUserId, read: false },
      { read: true },
    );
  }
}
