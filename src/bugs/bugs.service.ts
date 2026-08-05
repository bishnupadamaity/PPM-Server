import { randomUUID } from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Bug } from './bug.entity';
import { BugComment } from './bug-comment.entity';
import { CreateBugDto } from './dto/create-bug.dto';
import { UpdateBugDto } from './dto/update-bug.dto';
import { CreateBugCommentDto } from './dto/create-bug-comment.dto';

@Injectable()
export class BugsService {
  constructor(
    @InjectRepository(Bug) private readonly bugsRepo: Repository<Bug>,
    @InjectRepository(BugComment)
    private readonly commentsRepo: Repository<BugComment>,
  ) {}

  findAll(): Promise<Bug[]> {
    return this.bugsRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<Bug> {
    const bug = await this.bugsRepo.findOne({ where: { id } });
    if (!bug) throw new NotFoundException('Bug not found');
    return bug;
  }

  /**
   * `codePrefix` is resolved client-side (from the bug's Project, which
   * isn't in Postgres yet) — this only computes the per-project sequence
   * number and assembles `code`. Same non-atomic scan-and-increment
   * approach as the Firestore version it replaces, so no regression.
   */
  async create(dto: CreateBugDto, createdBy: string): Promise<Bug> {
    const { codePrefix, tags, ...rest } = dto;
    const maxSeq = await this.bugsRepo.maximum('seq', {
      projectId: rest.projectId ?? IsNull(),
    });
    const seq = (maxSeq ?? 0) + 1;

    const bug = this.bugsRepo.create({
      id: randomUUID(),
      ...rest,
      createdBy,
      tags: tags ?? [],
      seq,
      code: `${codePrefix}-${seq}`,
    });
    return this.bugsRepo.save(bug);
  }

  async update(id: string, dto: UpdateBugDto): Promise<Bug> {
    const bug = await this.findById(id);
    Object.assign(bug, dto);
    return this.bugsRepo.save(bug);
  }

  async remove(id: string): Promise<void> {
    await this.commentsRepo.delete({ bugId: id });
    const result = await this.bugsRepo.delete(id);
    if (!result.affected) throw new NotFoundException('Bug not found');
  }

  findComments(bugId: string): Promise<BugComment[]> {
    return this.commentsRepo.find({
      where: { bugId },
      order: { createdAt: 'ASC' },
    });
  }

  addComment(
    bugId: string,
    dto: CreateBugCommentDto,
    author: { id: string; name: string },
  ): Promise<BugComment> {
    const comment = this.commentsRepo.create({
      id: randomUUID(),
      bugId,
      ...dto,
      authorId: author.id,
      authorName: author.name,
    });
    return this.commentsRepo.save(comment);
  }
}
