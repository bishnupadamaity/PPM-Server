import { IsDateString, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

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

export class UpdateLeadDto {
  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  contact?: string;

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

  @IsOptional()
  @IsIn(STAGES)
  stage?:
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

  // notes/createdBy are deliberately NOT here — see create-lead.dto.ts.
}
