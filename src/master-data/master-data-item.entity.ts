import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export type MasterDataType =
  | 'industry'
  | 'leadSource'
  | 'country'
  | 'currency'
  | 'workCategory';

export const MASTER_DATA_TYPES: MasterDataType[] = [
  'industry',
  'leadSource',
  'country',
  'currency',
  'workCategory',
];

@Entity()
@Index(['type'])
export class MasterDataItem {
  // App-supplied (crypto.randomUUID()) so backfilled rows can keep their
  // original Firestore doc id instead of drifting from the mirror.
  @PrimaryColumn()
  id: string;

  @Column()
  type: MasterDataType;

  @Column()
  code: string;

  @Column()
  label: string;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: 'active' })
  status: 'active' | 'inactive';

  @Column({ nullable: true })
  isdCode?: string;

  @Column({ nullable: true })
  timezone?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
