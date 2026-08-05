import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface LeadNote {
  id: string;
  text: string;
  createdAt: string;
  createdBy?: string;
}

@Entity()
export class Lead {
  // App-supplied (crypto.randomUUID()) so backfilled rows can keep their
  // original Firestore doc id instead of drifting from the mirror.
  @PrimaryColumn()
  id: string;

  @Column()
  company: string;

  @Column()
  contact: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  industry?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ type: 'numeric', nullable: true })
  monthlyEstimate?: number;

  @Column({ nullable: true })
  source?: string;

  @Column({ nullable: true })
  salesExec?: string;

  @Column()
  stage:
    | 'prospect'
    | 'contacted'
    | 'meeting-scheduled'
    | 'discovery-meeting'
    | 'proposal-sent'
    | 'negotiation'
    | 'won'
    | 'lost';

  @Column('jsonb', { default: '[]' })
  notes: LeadNote[];

  @Column({ type: 'timestamptz', nullable: true })
  nextFollowUp?: Date;

  @Column({ nullable: true })
  createdBy?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
