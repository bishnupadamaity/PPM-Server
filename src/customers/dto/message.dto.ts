import { IsIn, IsObject, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @MinLength(1)
  customerId: string;

  @IsIn(['internal', 'customer'])
  channel: 'internal' | 'customer';

  @IsString()
  @MinLength(1)
  text: string;

  @IsOptional()
  @IsObject()
  attachment?: { name: string; url: string };

  // author is deliberately NOT here — derived server-side from the
  // authenticated user.
}
