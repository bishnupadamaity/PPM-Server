import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Role {
  // App-supplied (crypto.randomUUID(), not a DB-generated uuid column) so
  // backfilled rows can keep their original Firestore doc id — which isn't
  // valid Postgres `uuid` format — instead of drifting from the mirror.
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  name: string;

  // undefined/null means unrestricted (legacy fallback — role predates
  // per-module permissions or an admin hasn't configured it yet).
  // An explicit [] means an admin deliberately granted zero modules.
  @Column('text', { array: true, nullable: true })
  permissions?: string[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
