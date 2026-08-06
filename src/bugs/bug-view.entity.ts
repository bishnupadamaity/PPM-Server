import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
@Index(['userId'])
export class BugView {
  @PrimaryColumn()
  id: string;

  // Plain column, not a relation — scopes the view to its owner the same
  // way BugComment scopes to its parent bug.
  @Column()
  userId: string;

  @Column()
  name: string;

  @Column('jsonb')
  filters: Record<string, unknown>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
