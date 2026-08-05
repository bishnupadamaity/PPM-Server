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
import { ManagementService } from './management.service';
import {
  CreateManagementItemDto,
  UpdateManagementItemDto,
} from './dto/management-item.dto';
import {
  MANAGEMENT_ITEM_TYPES,
  ManagementItemType,
} from './management-item.entity';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

function assertValidType(type: string): asserts type is ManagementItemType {
  if (!MANAGEMENT_ITEM_TYPES.includes(type as ManagementItemType)) {
    throw new BadRequestException(`Unknown management item type: ${type}`);
  }
}

@Controller('management')
@UseGuards(FirebaseAuthGuard)
export class ManagementController {
  constructor(private readonly managementService: ManagementService) {}

  @Get(':type')
  findByType(@Param('type') type: string) {
    assertValidType(type);
    return this.managementService.findByType(type);
  }

  @Post(':type')
  @UseGuards(AdminGuard)
  create(@Param('type') type: string, @Body() dto: CreateManagementItemDto) {
    assertValidType(type);
    return this.managementService.create(type, dto);
  }

  @Patch(':type/:id')
  @UseGuards(AdminGuard)
  update(
    @Param('type') type: string,
    @Param('id') id: string,
    @Body() dto: UpdateManagementItemDto,
  ) {
    assertValidType(type);
    return this.managementService.update(type, id, dto);
  }

  @Delete(':type/:id')
  @UseGuards(AdminGuard)
  async remove(@Param('type') type: string, @Param('id') id: string) {
    assertValidType(type);
    await this.managementService.remove(type, id);
    return { success: true };
  }
}
