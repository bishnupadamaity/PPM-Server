import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  // Firebase Auth uid for an account the client already created
  // (via the secondary-app email/password sign-up trick).
  @IsString()
  @MinLength(1)
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsString()
  jobRole?: string;

  @IsOptional()
  @IsBoolean()
  approved?: boolean;
}
