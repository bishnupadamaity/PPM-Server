import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
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
