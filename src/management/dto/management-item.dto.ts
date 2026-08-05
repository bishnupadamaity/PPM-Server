import { IsString, MinLength } from 'class-validator';

export class CreateManagementItemDto {
  @IsString()
  @MinLength(1)
  name: string;
}

export class UpdateManagementItemDto {
  @IsString()
  @MinLength(1)
  name: string;
}
