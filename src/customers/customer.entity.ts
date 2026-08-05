import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Customer {
  // App-supplied (crypto.randomUUID()) so backfilled rows can keep their
  // original Firestore doc id instead of drifting from the mirror.
  @PrimaryColumn()
  id: string;

  // Typed non-optional (despite the nullable column) so TypeORM's
  // PickKeysByType resolves this for repo.maximum('seq', ...). Same as
  // Bug.seq / Project.seq.
  @Column({ nullable: true })
  seq: number;

  @Column()
  company: string;

  @Column({ nullable: true })
  contact?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  country?: string;

  @Column()
  status: 'active' | 'inactive';

  @Column({ nullable: true })
  projectsCount?: number;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  createdBy?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
