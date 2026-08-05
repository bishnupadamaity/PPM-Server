import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';
import type { BugCommentMention } from '../bug-comment.entity';

export class CreateBugCommentDto {
  @IsString()
  @MinLength(1)
  text: string;

  // authorId/authorName are deliberately NOT here — the controller derives
  // them from the authenticated user, never from client input, to prevent
  // comment authorship spoofing.
  @IsOptional()
  @IsArray()
  mentions?: BugCommentMention[];
}
