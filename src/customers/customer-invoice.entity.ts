import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface CustomerInvoiceLineItem {
  description: string;
  amount: number;
}

@Entity()
@Index(['customerId'])
@Index(['projectId'])
export class CustomerInvoice {
  @PrimaryColumn()
  id: string;

  @Column()
  customerId: string;

  @Column({ nullable: true })
  projectId?: string;

  @Column({ nullable: true })
  projectName?: string;

  @Column()
  invoiceNumber: string;

  @Column({ nullable: true })
  billToAddress?: string;

  @Column({ nullable: true })
  billToTaxId?: string;

  @Column()
  currency: string;

  @Column('jsonb', { default: '[]' })
  lineItems: CustomerInvoiceLineItem[];

  @Column({ nullable: true })
  applyTax?: boolean;

  @Column({ type: 'numeric', nullable: true })
  taxRate?: number;

  @Column({ type: 'numeric' })
  subtotal: number;

  @Column({ type: 'numeric', nullable: true })
  taxAmount?: number;

  @Column({ type: 'numeric' })
  amount: number;

  @Column({ type: 'timestamptz', nullable: true })
  dueDate?: Date;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  includeBankDetails?: boolean;

  @Column()
  status: 'draft' | 'sent' | 'paid';

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
