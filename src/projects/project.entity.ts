import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Index(['customerId'])
export class Project {
  // App-supplied (crypto.randomUUID()) so backfilled rows can keep their
  // original Firestore doc id instead of drifting from the mirror.
  @PrimaryColumn()
  id: string;

  // Typed non-optional (despite the nullable column) so TypeORM's
  // PickKeysByType resolves this for repo.maximum('seq', ...) — always set
  // on create, in practice never absent. Same as Bug.seq.
  @Column({ nullable: true })
  seq: number;

  @Column()
  name: string;

  @Column({ default: '' })
  description: string;

  @Column()
  customerId: string;

  @Column({ nullable: true })
  customerName?: string;

  @Column()
  projectStatus: 'planning' | 'active' | 'on-hold' | 'completed';

  @Column()
  priority: 'low' | 'medium' | 'high' | 'critical';

  @Column()
  category: string;

  @Column({ nullable: true })
  code?: string;

  @Column({ nullable: true })
  sowCount?: number;

  @Column('text', { array: true, default: '{}' })
  tags: string[];

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz', nullable: true })
  endDate?: Date;

  @Column({ type: 'numeric', nullable: true })
  budget?: number;

  @Column({ nullable: true })
  logoUrl?: string;

  @Column({ nullable: true })
  teamLead?: string;

  @Column({ nullable: true })
  createdBy?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
