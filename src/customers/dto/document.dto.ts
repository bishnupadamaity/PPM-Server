import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @MinLength(1)
  customerId: string;

  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  docType: string;

  @IsString()
  @MinLength(1)
  url: string;

  @IsString()
  @MinLength(1)
  cloudinaryPublicId: string;

  @IsString()
  @MinLength(1)
  fileType: string;

  @IsNumber()
  fileSize: number;

  // createdBy is deliberately NOT here — derived server-side from the
  // authenticated user.
}
