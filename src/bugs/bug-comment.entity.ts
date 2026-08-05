import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';

export interface BugCommentMention {
  id: string;
  name: string;
}

@Entity()
@Index(['bugId'])
export class BugComment {
  // App-supplied (crypto.randomUUID()) so backfilled rows can keep their
  // original Firestore doc id instead of drifting from the mirror.
  @PrimaryColumn()
  id: string;

  // Plain column, not a TypeORM relation — Postgres has no subcollection
  // equivalent, so comments are just indexed by their parent bug's id.
  @Column()
  bugId: string;

  @Column('text')
  text: string;

  @Column()
  authorId: string;

  @Column()
  authorName: string;

  @Column('jsonb', { nullable: true })
  mentions?: BugCommentMention[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
