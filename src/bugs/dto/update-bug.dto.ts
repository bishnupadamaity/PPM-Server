import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';
import type { BugAttachment } from '../bug.entity';

const STATUSES = ['open', 'in-progress', 'resolved', 'closed'];
const PRIORITIES = ['low', 'medium', 'high', 'critical'];
const SEVERITIES = ['minor', 'major', 'critical', 'blocker'];
const TYPES = ['bug', 'feature', 'improvement', 'task'];

export class UpdateBugDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(STATUSES)
  bugStatus?: 'open' | 'in-progress' | 'resolved' | 'closed';

  @IsOptional()
  @IsIn(PRIORITIES)
  priority?: 'low' | 'medium' | 'high' | 'critical';

  @IsOptional()
  @IsIn(SEVERITIES)
  severity?: 'minor' | 'major' | 'critical' | 'blocker';

  @IsOptional()
  @IsIn(TYPES)
  type?: 'bug' | 'feature' | 'improvement' | 'task';

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

  // createdBy is deliberately NOT here — it's immutable after creation and
  // must never be settable via client input (spoofing prevention).
}
