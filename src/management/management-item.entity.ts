import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ManagementItemType = 'categories' | 'statuses';

export const MANAGEMENT_ITEM_TYPES: ManagementItemType[] = [
  'categories',
  'statuses',
];

@Entity()
@Index(['type'])
export class ManagementItem {
  // App-supplied (crypto.randomUUID()) so backfilled rows can keep their
  // original Firestore doc id instead of drifting from the mirror.
  @PrimaryColumn()
  id: string;

  @Column()
  type: ManagementItemType;

  @Column()
  name: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
