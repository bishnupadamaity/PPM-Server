import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
@Index(['customerId'])
export class CustomerDocument {
  @PrimaryColumn()
  id: string;

  @Column()
  customerId: string;

  @Column()
  name: string;

  @Column()
  docType: string;

  @Column()
  url: string;

  @Column()
  cloudinaryPublicId: string;

  @Column()
  fileType: string;

  // Plain `int4` (not `bigint`) — the pg driver returns bigint columns as
  // strings, and no uploaded file here will approach the int4 ceiling (~2GB).
  @Column()
  fileSize: number;

  @Column({ nullable: true })
  createdBy?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
