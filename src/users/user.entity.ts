import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  // Firebase Auth uid — keeps this row's id identical to the AppUser.id
  // the client already uses everywhere (assignee pickers, mentions, etc.)
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  photoUrl?: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ nullable: true })
  jobRole?: string;

  @Column({ default: false })
  approved: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  lastLoginAt?: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updatedAt?: Date;
}
