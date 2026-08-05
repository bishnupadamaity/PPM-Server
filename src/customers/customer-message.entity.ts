import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';

export interface CustomerMessageAttachment {
  name: string;
  url: string;
}

@Entity()
@Index(['customerId'])
export class CustomerMessage {
  @PrimaryColumn()
  id: string;

  @Column()
  customerId: string;

  @Column()
  channel: 'internal' | 'customer';

  @Column('text')
  text: string;

  @Column('jsonb', { nullable: true })
  attachment?: CustomerMessageAttachment;

  @Column({ nullable: true })
  author?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
