import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateSelfProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}
