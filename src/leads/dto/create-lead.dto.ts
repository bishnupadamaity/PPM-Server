import { IsDateString, IsIn, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

const STAGES = [
  'prospect',
  'contacted',
  'meeting-scheduled',
  'discovery-meeting',
  'proposal-sent',
  'negotiation',
  'won',
  'lost',
];

export class CreateLeadDto {
  @IsString()
  @MinLength(1)
  company: string;

  @IsString()
  @MinLength(1)
  contact: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsNumber()
  monthlyEstimate?: number;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  salesExec?: string;

  @IsIn(STAGES)
  stage:
    | 'prospect'
    | 'contacted'
    | 'meeting-scheduled'
    | 'discovery-meeting'
    | 'proposal-sent'
    | 'negotiation'
    | 'won'
    | 'lost';

  @IsOptional()
  @IsDateString()
  nextFollowUp?: string;

  // notes/createdBy are deliberately NOT here — notes are added exclusively
  // via POST /leads/:id/notes, and createdBy is derived server-side from
  // the authenticated user (spoofing prevention, same as Bugs/Projects).
}
