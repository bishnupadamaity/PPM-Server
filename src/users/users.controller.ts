import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateSelfProfileDto } from './dto/update-self-profile.dto';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import type { AuthenticatedRequest } from '../common/types/authenticated-request';

@Controller('users')
@UseGuards(FirebaseAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AdminGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('pending')
  @UseGuards(AdminGuard)
  findPending() {
    return this.usersService.findPending();
  }

  @Get('approved')
  findApproved() {
    return this.usersService.findApproved();
  }

  @Get('me')
  async findMe(@Req() req: AuthenticatedRequest) {
    const user = await this.usersService.findById(req.firebaseUser.uid);
    if (!user) throw new NotFoundException('User not found — call /auth/sync first');
    return user;
  }

  @Patch('me')
  updateMe(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateSelfProfileDto,
  ) {
    return this.usersService.updateSelfProfile(req.firebaseUser.uid, dto);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Patch(':id/approve')
  @UseGuards(AdminGuard)
  approve(@Param('id') id: string) {
    return this.usersService.approve(id);
  }

  @Patch(':id/promote')
  @UseGuards(AdminGuard)
  promote(@Param('id') id: string) {
    return this.usersService.promote(id);
  }

  @Patch(':id/demote')
  @UseGuards(AdminGuard)
  demote(@Param('id') id: string) {
    return this.usersService.demote(id);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async reject(@Param('id') id: string) {
    await this.usersService.reject(id);
    return { success: true };
  }

  @Patch(':id')
  async updateDetails(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    const requestingUser = await this.usersService.getByIdOrThrow(
      req.firebaseUser.uid,
    );
    return this.usersService.updateDetails(id, dto, requestingUser);
  }
}
