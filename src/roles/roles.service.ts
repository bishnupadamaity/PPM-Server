import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly rolesRepo: Repository<Role>,
  ) {}

  findAll(): Promise<Role[]> {
    return this.rolesRepo.find({ order: { createdAt: 'DESC' } });
  }

  create(dto: CreateRoleDto): Promise<Role> {
    return this.rolesRepo.save(this.rolesRepo.create(dto));
  }

  async update(id: string, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.rolesRepo.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');
    Object.assign(role, dto);
    return this.rolesRepo.save(role);
  }

  async remove(id: string): Promise<void> {
    const result = await this.rolesRepo.delete(id);
    if (!result.affected) throw new NotFoundException('Role not found');
  }
}
