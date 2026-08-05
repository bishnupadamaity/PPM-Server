import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
} from 'typeorm';

export type NotificationType =
  | 'bug_assigned'
  | 'bug_status_changed'
  | 'bug_mentioned';

@Entity()
@Index(['userId'])
export class Notification {
  // App-supplied (crypto.randomUUID()) so backfilled rows can keep their
  // original Firestore doc id instead of drifting from the mirror.
  @PrimaryColumn()
  id: string;

  // Recipient's user id — matches User.id / Firebase Auth uid.
  @Column()
  userId: string;

  @Column()
  type: NotificationType;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column({ nullable: true })
  link?: string;

  @Column({ default: false })
  read: boolean;

  @Column({ nullable: true })
  entityType?: 'bug';

  @Column({ nullable: true })
  entityId?: string;

  @Column({ nullable: true })
  actorName?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
