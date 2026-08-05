import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import type { CustomerInvoiceLineItem } from '../customer-invoice.entity';

const STATUSES = ['draft', 'sent', 'paid'];

export class CreateInvoiceDto {
  @IsString()
  @MinLength(1)
  customerId: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  projectName?: string;

  @IsString()
  @MinLength(1)
  invoiceNumber: string;

  @IsOptional()
  @IsString()
  billToAddress?: string;

  @IsOptional()
  @IsString()
  billToTaxId?: string;

  @IsString()
  @MinLength(1)
  currency: string;

  @IsArray()
  lineItems: CustomerInvoiceLineItem[];

  @IsOptional()
  @IsBoolean()
  applyTax?: boolean;

  @IsOptional()
  @IsNumber()
  taxRate?: number;

  @IsNumber()
  subtotal: number;

  @IsOptional()
  @IsNumber()
  taxAmount?: number;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  includeBankDetails?: boolean;

  @IsOptional()
  @IsIn(STATUSES)
  status?: 'draft' | 'sent' | 'paid';
}

export class UpdateInvoiceDto {
  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  projectName?: string;

  @IsOptional()
  @IsString()
  billToAddress?: string;

  @IsOptional()
  @IsString()
  billToTaxId?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsArray()
  lineItems?: CustomerInvoiceLineItem[];

  @IsOptional()
  @IsBoolean()
  applyTax?: boolean;

  @IsOptional()
  @IsNumber()
  taxRate?: number;

  @IsOptional()
  @IsNumber()
  subtotal?: number;

  @IsOptional()
  @IsNumber()
  taxAmount?: number;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  includeBankDetails?: boolean;

  @IsOptional()
  @IsIn(STATUSES)
  status?: 'draft' | 'sent' | 'paid';
}
