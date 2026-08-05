import { randomUUID } from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CustomerContact } from './customer-contact.entity';
import { CustomerDocument } from './customer-document.entity';
import { CustomerMessage } from './customer-message.entity';
import { CustomerInvoice } from './customer-invoice.entity';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { CreateContactDto, UpdateContactDto } from './dto/contact.dto';
import { CreateDocumentDto } from './dto/document.dto';
import { CreateMessageDto } from './dto/message.dto';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer) private readonly customersRepo: Repository<Customer>,
    @InjectRepository(CustomerContact)
    private readonly contactsRepo: Repository<CustomerContact>,
    @InjectRepository(CustomerDocument)
    private readonly documentsRepo: Repository<CustomerDocument>,
    @InjectRepository(CustomerMessage)
    private readonly messagesRepo: Repository<CustomerMessage>,
    @InjectRepository(CustomerInvoice)
    private readonly invoicesRepo: Repository<CustomerInvoice>,
    private readonly projectsService: ProjectsService,
  ) {}

  /* ── Customers ── */

  findAll(): Promise<Customer[]> {
    return this.customersRepo.find({ order: { seq: 'ASC' } });
  }

  async findById(id: string): Promise<Customer> {
    const customer = await this.customersRepo.findOne({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async create(dto: CreateCustomerDto, createdBy: string): Promise<Customer> {
    const maxSeq = await this.customersRepo.maximum('seq', {});
    const seq = (maxSeq ?? 0) + 1;
    const customer = this.customersRepo.create({
      id: randomUUID(),
      ...dto,
      createdBy,
      seq,
    });
    return this.customersRepo.save(customer);
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findById(id);
    Object.assign(customer, dto);
    return this.customersRepo.save(customer);
  }

  /**
   * Cascade delete — authoritative, server-side. Removes every row
   * referencing this customer (contacts/documents/messages/invoices, own
   * entities here, plus Projects via the injected ProjectsService) before
   * the customer row itself. The client mirrors this with a plain Firestore
   * cleanup afterward (see deleteAllCustomerData in customerDetails.ts) —
   * that mirror step no longer needs to be authoritative for anything.
   */
  async remove(id: string): Promise<void> {
    await this.contactsRepo.delete({ customerId: id });
    await this.documentsRepo.delete({ customerId: id });
    await this.messagesRepo.delete({ customerId: id });
    await this.invoicesRepo.delete({ customerId: id });
    await this.projectsService.removeByCustomerId(id);

    const result = await this.customersRepo.delete(id);
    if (!result.affected) throw new NotFoundException('Customer not found');
  }

  /* ── Contacts ── */

  findContacts(customerId: string): Promise<CustomerContact[]> {
    return this.contactsRepo.find({ where: { customerId } });
  }

  findAllContacts(): Promise<CustomerContact[]> {
    return this.contactsRepo.find();
  }

  createContact(dto: CreateContactDto): Promise<CustomerContact> {
    return this.contactsRepo.save(
      this.contactsRepo.create({ id: randomUUID(), ...dto }),
    );
  }

  async updateContact(id: string, dto: UpdateContactDto): Promise<CustomerContact> {
    const contact = await this.contactsRepo.findOne({ where: { id } });
    if (!contact) throw new NotFoundException('Contact not found');
    Object.assign(contact, dto);
    return this.contactsRepo.save(contact);
  }

  async removeContact(id: string): Promise<void> {
    const result = await this.contactsRepo.delete(id);
    if (!result.affected) throw new NotFoundException('Contact not found');
  }

  /* ── Documents ── */

  findDocuments(customerId: string): Promise<CustomerDocument[]> {
    return this.documentsRepo.find({ where: { customerId } });
  }

  createDocument(
    dto: CreateDocumentDto,
    createdBy?: string,
  ): Promise<CustomerDocument> {
    return this.documentsRepo.save(
      this.documentsRepo.create({ id: randomUUID(), ...dto, createdBy }),
    );
  }

  async removeDocument(id: string): Promise<void> {
    const result = await this.documentsRepo.delete(id);
    if (!result.affected) throw new NotFoundException('Document not found');
  }

  /* ── Messages ── */

  findMessages(customerId: string): Promise<CustomerMessage[]> {
    return this.messagesRepo.find({ where: { customerId } });
  }

  createMessage(dto: CreateMessageDto, author?: string): Promise<CustomerMessage> {
    return this.messagesRepo.save(
      this.messagesRepo.create({ id: randomUUID(), ...dto, author }),
    );
  }

  /* ── Invoices ── */

  findAllInvoices(): Promise<CustomerInvoice[]> {
    return this.invoicesRepo.find();
  }

  findInvoicesByCustomer(customerId: string): Promise<CustomerInvoice[]> {
    return this.invoicesRepo.find({ where: { customerId } });
  }

  findInvoicesByProject(projectId: string): Promise<CustomerInvoice[]> {
    return this.invoicesRepo.find({ where: { projectId } });
  }

  async findInvoiceById(id: string): Promise<CustomerInvoice> {
    const invoice = await this.invoicesRepo.findOne({ where: { id } });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  createInvoice(dto: CreateInvoiceDto): Promise<CustomerInvoice> {
    const { dueDate, ...rest } = dto;
    return this.invoicesRepo.save(
      this.invoicesRepo.create({
        id: randomUUID(),
        ...rest,
        status: dto.status ?? 'draft',
        dueDate: dueDate ? new Date(dueDate) : undefined,
      }),
    );
  }

  async updateInvoice(id: string, dto: UpdateInvoiceDto): Promise<CustomerInvoice> {
    const invoice = await this.findInvoiceById(id);
    const { dueDate, ...rest } = dto;
    Object.assign(invoice, rest);
    if (dueDate !== undefined) invoice.dueDate = new Date(dueDate);
    return this.invoicesRepo.save(invoice);
  }

  async removeInvoice(id: string): Promise<void> {
    const result = await this.invoicesRepo.delete(id);
    if (!result.affected) throw new NotFoundException('Invoice not found');
  }
}
