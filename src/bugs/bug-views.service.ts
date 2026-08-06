import { randomUUID } from 'crypto';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BugView } from './bug-view.entity';
import { CreateBugViewDto } from './dto/create-bug-view.dto';

@Injectable()
export class BugViewsService {
  constructor(
    @InjectRepository(BugView)
    private readonly bugViewsRepo: Repository<BugView>,
  ) {}

  findAllForUser(userId: string): Promise<BugView[]> {
    return this.bugViewsRepo.find({
      where: { userId },
      order: { createdAt: 'ASC' },
    });
  }

  create(dto: CreateBugViewDto, userId: string): Promise<BugView> {
    const view = this.bugViewsRepo.create({
      id: randomUUID(),
      userId,
      ...dto,
    });
    return this.bugViewsRepo.save(view);
  }

  async remove(id: string, userId: string): Promise<void> {
    const view = await this.bugViewsRepo.findOne({ where: { id } });
    if (!view) throw new NotFoundException('View not found');
    if (view.userId !== userId) {
      throw new ForbiddenException('Cannot delete another user’s view');
    }
    await this.bugViewsRepo.delete(id);
  }
}
