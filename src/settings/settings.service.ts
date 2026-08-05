import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting, SettingKey } from './setting.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting) private readonly repo: Repository<Setting>,
  ) {}

  async get(key: SettingKey): Promise<Record<string, unknown> | null> {
    const setting = await this.repo.findOne({ where: { key } });
    return setting?.data ?? null;
  }

  async upsert(
    key: SettingKey,
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    await this.repo.save(this.repo.create({ key, data }));
    return data;
  }
}
