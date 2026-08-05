import { IsIn, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import type { NotificationType } from '../notification.entity';

const TYPES: NotificationType[] = [
  'bug_assigned',
  'bug_status_changed',
  'bug_mentioned',
];

export class CreateNotificationDto {
  @IsString()
  @MinLength(1)
  userId: string;

  @IsIn(TYPES)
  type: NotificationType;

  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  message: string;

  // Must be an internal app path, never an absolute/external URL — this is
  // rendered as a clickable link to the recipient, so an unrestricted value
  // would be a phishing vector. Second char can't be `/` or `\` either,
  // since browsers treat a leading `//` (or `/\`) as protocol-relative —
  // i.e. still an external redirect despite starting with a single `/`.
  @IsOptional()
  @IsString()
  @Matches(/^\/(?![\/\\])[^\s\\]*$/, {
    message: 'link must be a relative in-app path (not protocol-relative)',
  })
  link?: string;

  @IsOptional()
  @IsIn(['bug'])
  entityType?: 'bug';

  @IsOptional()
  @IsString()
  entityId?: string;

  // actorName is deliberately NOT here — the controller derives it from the
  // authenticated user, never from client input, to prevent impersonation.
}
