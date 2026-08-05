import { randomUUID } from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ManagementItem, ManagementItemType } from './management-item.entity';
import {
  CreateManagementItemDto,
  UpdateManagementItemDto,
} from './dto/management-item.dto';

@Injectable()
export class ManagementService {
  constructor(
    @InjectRepository(ManagementItem)
    private readonly repo: Repository<ManagementItem>,
  ) {}

  findByType(type: ManagementItemType): Promise<ManagementItem[]> {
    return this.repo.find({ where: { type }, order: { createdAt: 'DESC' } });
  }

  create(
    type: ManagementItemType,
    dto: CreateManagementItemDto,
  ): Promise<ManagementItem> {
    return this.repo.save(this.repo.create({ id: randomUUID(), ...dto, type }));
  }

  async update(
    type: ManagementItemType,
    id: string,
    dto: UpdateManagementItemDto,
  ): Promise<ManagementItem> {
    const item = await this.repo.findOne({ where: { id, type } });
    if (!item) throw new NotFoundException('Management item not found');
    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async remove(type: ManagementItemType, id: string): Promise<void> {
    const result = await this.repo.delete({ id, type });
    if (!result.affected) {
      throw new NotFoundException('Management item not found');
    }
  }
}
