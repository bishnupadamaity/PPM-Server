import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MasterDataService } from './master-data.service';
import {
  CreateMasterDataItemDto,
  UpdateMasterDataItemDto,
} from './dto/master-data-item.dto';
import {
  MASTER_DATA_TYPES,
  MasterDataType,
} from './master-data-item.entity';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

function assertValidType(type: string): asserts type is MasterDataType {
  if (!MASTER_DATA_TYPES.includes(type as MasterDataType)) {
    throw new BadRequestException(`Unknown master data type: ${type}`);
  }
}

@Controller('master-data')
@UseGuards(FirebaseAuthGuard)
export class MasterDataController {
  constructor(private readonly masterDataService: MasterDataService) {}

  @Get(':type')
  findByType(@Param('type') type: string) {
    assertValidType(type);
    return this.masterDataService.findByType(type);
  }

  @Post(':type')
  @UseGuards(AdminGuard)
  create(@Param('type') type: string, @Body() dto: CreateMasterDataItemDto) {
    assertValidType(type);
    return this.masterDataService.create(type, dto);
  }

  @Patch(':type/:id')
  @UseGuards(AdminGuard)
  update(
    @Param('type') type: string,
    @Param('id') id: string,
    @Body() dto: UpdateMasterDataItemDto,
  ) {
    assertValidType(type);
    return this.masterDataService.update(type, id, dto);
  }

  @Delete(':type/:id')
  @UseGuards(AdminGuard)
  async remove(@Param('type') type: string, @Param('id') id: string) {
    assertValidType(type);
    await this.masterDataService.remove(type, id);
    return { success: true };
  }
}
