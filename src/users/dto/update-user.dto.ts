import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(1)
  name: string;

  // Non-admins may not change their own role — enforced in UsersService,
  // not here. "Admin" tier may only be granted via the promote endpoint.
  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  jobRole?: string;
}
