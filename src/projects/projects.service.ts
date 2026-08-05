import { randomUUID } from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private readonly repo: Repository<Project>,
  ) {}

  findAll(): Promise<Project[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<Project> {
    const project = await this.repo.findOne({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  findByCustomerId(customerId: string): Promise<Project[]> {
    return this.repo.find({ where: { customerId } });
  }

  async create(dto: CreateProjectDto, createdBy: string): Promise<Project> {
    const maxSeq = await this.repo.maximum('seq', {});
    const seq = (maxSeq ?? 0) + 1;
    const { startDate, endDate, tags, ...rest } = dto;

    const project = this.repo.create({
      id: randomUUID(),
      ...rest,
      tags: tags ?? [],
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      createdBy,
      seq,
    });
    return this.repo.save(project);
  }

  async update(id: string, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.findById(id);
    const { startDate, endDate, ...rest } = dto;
    Object.assign(project, rest);
    if (startDate !== undefined) project.startDate = new Date(startDate);
    if (endDate !== undefined) project.endDate = new Date(endDate);
    return this.repo.save(project);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (!result.affected) throw new NotFoundException('Project not found');
  }

  /** Bulk-delete, used by CustomersService's cascade when a customer is removed. */
  async removeByCustomerId(customerId: string): Promise<void> {
    await this.repo.delete({ customerId });
  }
}
