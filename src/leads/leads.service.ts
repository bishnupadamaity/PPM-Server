import { randomUUID } from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { AddLeadNoteDto } from './dto/add-lead-note.dto';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead) private readonly repo: Repository<Lead>,
  ) {}

  findAll(): Promise<Lead[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<Lead> {
    const lead = await this.repo.findOne({ where: { id } });
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async create(dto: CreateLeadDto, createdBy: string): Promise<Lead> {
    const { nextFollowUp, ...rest } = dto;
    const lead = this.repo.create({
      id: randomUUID(),
      ...rest,
      notes: [],
      nextFollowUp: nextFollowUp ? new Date(nextFollowUp) : undefined,
      createdBy,
    });
    return this.repo.save(lead);
  }

  async update(id: string, dto: UpdateLeadDto): Promise<Lead> {
    const lead = await this.findById(id);
    const { nextFollowUp, ...rest } = dto;
    Object.assign(lead, rest);
    if (nextFollowUp !== undefined) {
      lead.nextFollowUp = new Date(nextFollowUp);
    }
    return this.repo.save(lead);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (!result.affected) throw new NotFoundException('Lead not found');
  }

  async addNote(
    id: string,
    dto: AddLeadNoteDto,
    createdBy?: string,
  ): Promise<Lead> {
    const lead = await this.findById(id);
    lead.notes = [
      ...(lead.notes ?? []),
      {
        id: randomUUID(),
        text: dto.text,
        createdAt: new Date().toISOString(),
        createdBy,
      },
    ];
    return this.repo.save(lead);
  }
}
