import { IsArray, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import type { BugAttachment } from '../bug.entity';

const STATUSES = ['open', 'in-progress', 'resolved', 'closed'];
const PRIORITIES = ['low', 'medium', 'high', 'critical'];
const SEVERITIES = ['minor', 'major', 'critical', 'blocker'];
const TYPES = ['bug', 'feature', 'improvement', 'task'];

export class CreateBugDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsIn(STATUSES)
  bugStatus: 'open' | 'in-progress' | 'resolved' | 'closed';

  @IsIn(PRIORITIES)
  priority: 'low' | 'medium' | 'high' | 'critical';

  @IsIn(SEVERITIES)
  severity: 'minor' | 'major' | 'critical' | 'blocker';

  @IsIn(TYPES)
  type: 'bug' | 'feature' | 'improvement' | 'task';

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  projectName?: string;

  @IsOptional()
  @IsString()
  assignee?: string;

  @IsOptional()
  @IsString()
  reporter?: string;

  @IsOptional()
  @IsString()
  stepsToReproduce?: string;

  @IsOptional()
  @IsString()
  expectedBehavior?: string;

  @IsOptional()
  @IsString()
  actualBehavior?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  attachments?: BugAttachment[];

  // createdBy is deliberately NOT here — the controller derives it from the
  // authenticated user, never from client input, to prevent spoofing.

  // Client-resolved ticket-key prefix (e.g. "ORD") — derived from the
  // Project, which isn't in Postgres yet. See bugs.service.ts create().
  @IsString()
  @MinLength(1)
  codePrefix: string;
}
