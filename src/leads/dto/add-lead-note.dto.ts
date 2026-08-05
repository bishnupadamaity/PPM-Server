import { IsString, MinLength } from 'class-validator';

export class AddLeadNoteDto {
  @IsString()
  @MinLength(1)
  text: string;

  // createdBy is deliberately NOT here — derived server-side from the
  // authenticated user, same as Bugs' comment authorship fix.
}
