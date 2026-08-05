import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
@Index(['customerId'])
export class CustomerContact {
  @PrimaryColumn()
  id: string;

  @Column()
  customerId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  whatsappAvailable?: boolean;

  @Column({ nullable: true })
  photoUrl?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
