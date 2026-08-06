import { IsObject, IsString, MinLength } from 'class-validator';

export class CreateBugViewDto {
  @IsString()
  @MinLength(1)
  name: string;

  // userId is deliberately NOT here — the controller derives it from the
  // authenticated user, never from client input.
  @IsObject()
  filters: Record<string, unknown>;
}
