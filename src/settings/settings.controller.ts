import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SETTING_KEYS, SettingKey } from './setting.entity';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

function assertValidKey(key: string): asserts key is SettingKey {
  if (!SETTING_KEYS.includes(key as SettingKey)) {
    throw new BadRequestException(`Unknown settings key: ${key}`);
  }
}

@Controller('settings')
@UseGuards(FirebaseAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get(':key')
  async get(@Param('key') key: string) {
    assertValidKey(key);
    return this.settingsService.get(key);
  }

  @Put(':key')
  @UseGuards(AdminGuard)
  upsert(@Param('key') key: string, @Body() data: Record<string, unknown>) {
    assertValidKey(key);
    return this.settingsService.upsert(key, data);
  }
}
