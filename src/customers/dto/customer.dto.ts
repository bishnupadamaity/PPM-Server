import { IsIn, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

const STATUSES = ['active', 'inactive'];

export class CreateCustomerDto {
  @IsString()
  @MinLength(1)
  company: string;

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
  country?: string;

  @IsIn(STATUSES)
  status: 'active' | 'inactive';

  @IsOptional()
  @IsNumber()
  projectsCount?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  // createdBy is deliberately NOT here — derived server-side from the
  // authenticated user (spoofing prevention, same as Bugs/Projects/Leads).
}

export class UpdateCustomerDto {
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
  country?: string;

  @IsOptional()
  @IsIn(STATUSES)
  status?: 'active' | 'inactive';

  @IsOptional()
  @IsNumber()
  projectsCount?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
