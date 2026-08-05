import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateSelfProfileDto } from './dto/update-self-profile.dto';
import { FirebaseUserClaims } from '../common/types/authenticated-request';

/**
 * Custom job-role labels flow into the same `role` field used for
 * authorization, but the "Admin" tier must only ever be granted via
 * promote() — never through a freeform label — so it's rejected here.
 * Mirrors the client's sanitizeCustomRole in utils/firebase/users.ts.
 */
function sanitizeCustomRole(role?: string): string | undefined {
  if (!role || role.trim().toLowerCase() === 'admin') return undefined;
  return role;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepo.find({ order: { createdAt: 'DESC' } });
  }

  findPending(): Promise<User[]> {
    return this.usersRepo.find({
      where: { approved: false },
      order: { createdAt: 'DESC' },
    });
  }

  findApproved(): Promise<User[]> {
    return this.usersRepo.find({
      where: { approved: true },
      order: { createdAt: 'DESC' },
    });
  }

  findAdmins(): Promise<User[]> {
    return this.usersRepo.find({ where: { role: 'Admin' } });
  }

  async adminCount(): Promise<number> {
    return this.usersRepo.count({ where: { role: 'Admin' } });
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  async getByIdOrThrow(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /** Upsert on Firebase login: create with defaults if new, else touch lastLoginAt. */
  async syncOnLogin(claims: FirebaseUserClaims): Promise<User> {
    const existing = await this.findById(claims.uid);
    const now = new Date();

    if (!existing) {
      const created = this.usersRepo.create({
        id: claims.uid,
        email: claims.email ?? '',
        name: claims.name ?? '',
        photoUrl: claims.picture,
        role: 'user',
        approved: false,
        lastLoginAt: now,
      });
      return this.usersRepo.save(created);
    }

    existing.lastLoginAt = now;
    return this.usersRepo.save(existing);
  }

  async approve(id: string): Promise<User> {
    const user = await this.getByIdOrThrow(id);
    user.approved = true;
    return this.usersRepo.save(user);
  }

  async reject(id: string): Promise<void> {
    const result = await this.usersRepo.delete(id);
    if (!result.affected) throw new NotFoundException('User not found');
  }

  async promote(id: string): Promise<User> {
    const user = await this.getByIdOrThrow(id);
    user.role = 'Admin';
    return this.usersRepo.save(user);
  }

  async demote(id: string): Promise<User> {
    const count = await this.adminCount();
    if (count <= 1) {
      throw new ForbiddenException('Cannot remove the last admin.');
    }
    const user = await this.getByIdOrThrow(id);
    user.role = 'user';
    return this.usersRepo.save(user);
  }

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.findById(dto.id);
    if (existing) throw new ConflictException('User already exists');

    const safeRole = sanitizeCustomRole(dto.jobRole);
    const user = this.usersRepo.create({
      id: dto.id,
      email: dto.email,
      name: dto.name,
      role: safeRole || 'user',
      jobRole: dto.jobRole,
      approved: dto.approved ?? true,
      lastLoginAt: new Date(),
    });
    return this.usersRepo.save(user);
  }

  /**
   * Update editable fields. `requestingUser` must be either the target user
   * (self-edit, role must stay unchanged) or an Admin (may reassign a
   * non-Admin custom role — promoting to Admin must go through promote()).
   */
  async updateDetails(
    id: string,
    dto: UpdateUserDto,
    requestingUser: User,
  ): Promise<User> {
    const isSelf = requestingUser.id === id;
    const isAdmin = requestingUser.role === 'Admin';
    if (!isSelf && !isAdmin) {
      throw new ForbiddenException('Not allowed to edit this user');
    }

    const user = await this.getByIdOrThrow(id);
    const safeRole = sanitizeCustomRole(dto.role);

    if (isSelf && !isAdmin && safeRole && safeRole !== user.role) {
      throw new ForbiddenException('Cannot change your own role');
    }

    user.name = dto.name;
    user.jobRole = dto.jobRole;
    if (safeRole) user.role = safeRole;
    return this.usersRepo.save(user);
  }

  async updateSelfProfile(
    id: string,
    dto: UpdateSelfProfileDto,
  ): Promise<User> {
    const user = await this.getByIdOrThrow(id);
    if (dto.name) user.name = dto.name;
    if (dto.photoUrl) user.photoUrl = dto.photoUrl;
    return this.usersRepo.save(user);
  }
}
