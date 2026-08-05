import {
  IsArray,
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

const STATUSES = ['planning', 'active', 'on-hold', 'completed'];
const PRIORITIES = ['low', 'medium', 'high', 'critical'];

export class CreateProjectDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @MinLength(1)
  customerId: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsIn(STATUSES)
  projectStatus: 'planning' | 'active' | 'on-hold' | 'completed';

  @IsIn(PRIORITIES)
  priority: 'low' | 'medium' | 'high' | 'critical';

  @IsString()
  @MinLength(1)
  category: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsNumber()
  sowCount?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  budget?: number;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  teamLead?: string;

  // createdBy is deliberately NOT here — the controller derives it from the
  // authenticated user, never from client input, to prevent spoofing.
}
