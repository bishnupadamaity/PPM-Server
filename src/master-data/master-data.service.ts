import { randomUUID } from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MasterDataItem, MasterDataType } from './master-data-item.entity';
import {
  CreateMasterDataItemDto,
  UpdateMasterDataItemDto,
} from './dto/master-data-item.dto';

@Injectable()
export class MasterDataService {
  constructor(
    @InjectRepository(MasterDataItem)
    private readonly repo: Repository<MasterDataItem>,
  ) {}

  findByType(type: MasterDataType): Promise<MasterDataItem[]> {
    return this.repo.find({ where: { type }, order: { sortOrder: 'ASC' } });
  }

  create(
    type: MasterDataType,
    dto: CreateMasterDataItemDto,
  ): Promise<MasterDataItem> {
    return this.repo.save(this.repo.create({ id: randomUUID(), ...dto, type }));
  }

  async update(
    type: MasterDataType,
    id: string,
    dto: UpdateMasterDataItemDto,
  ): Promise<MasterDataItem> {
    const item = await this.repo.findOne({ where: { id, type } });
    if (!item) throw new NotFoundException('Master data item not found');
    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async remove(type: MasterDataType, id: string): Promise<void> {
    const result = await this.repo.delete({ id, type });
    if (!result.affected) {
      throw new NotFoundException('Master data item not found');
    }
  }
}
