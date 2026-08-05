import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface BugAttachment {
  url: string;
  publicId: string;
  name: string;
}

@Entity()
@Index(['projectId'])
export class Bug {
  // App-supplied (crypto.randomUUID()) so backfilled rows can keep their
  // original Firestore doc id instead of drifting from the mirror.
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  code?: string;

  // Typed non-optional (despite the nullable column) so TypeORM's
  // PickKeysByType resolves this for repo.maximum('seq', ...) in
  // bugs.service.ts — always set on create, in practice never absent.
  @Column({ nullable: true })
  seq: number;

  @Column()
  title: string;

  @Column({ default: '' })
  description: string;

  @Column()
  bugStatus: 'open' | 'in-progress' | 'resolved' | 'closed';

  @Column()
  priority: 'low' | 'medium' | 'high' | 'critical';

  @Column()
  severity: 'minor' | 'major' | 'critical' | 'blocker';

  @Column()
  type: 'bug' | 'feature' | 'improvement' | 'task';

  @Column({ nullable: true })
  projectId?: string;

  @Column({ nullable: true })
  projectName?: string;

  @Column({ nullable: true })
  assignee?: string;

  @Column({ nullable: true })
  reporter?: string;

  @Column({ nullable: true })
  stepsToReproduce?: string;

  @Column({ nullable: true })
  expectedBehavior?: string;

  @Column({ nullable: true })
  actualBehavior?: string;

  @Column('text', { array: true, default: '{}' })
  tags: string[];

  @Column('jsonb', { nullable: true })
  attachments?: BugAttachment[];

  @Column({ nullable: true })
  createdBy?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
