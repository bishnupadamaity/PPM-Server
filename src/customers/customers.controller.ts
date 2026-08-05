import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { CreateContactDto, UpdateContactDto } from './dto/contact.dto';
import { CreateDocumentDto } from './dto/document.dto';
import { CreateMessageDto } from './dto/message.dto';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import type { AuthenticatedRequest } from '../common/types/authenticated-request';

@Controller()
@UseGuards(FirebaseAuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  /* ── Customers ── */

  @Get('customers')
  findAll() {
    return this.customersService.findAll();
  }

  @Get('customers/:id')
  findOne(@Param('id') id: string) {
    return this.customersService.findById(id);
  }

  @Post('customers')
  @UseGuards(AdminGuard)
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateCustomerDto) {
    return this.customersService.create(dto, req.currentUser!.name);
  }

  @Patch('customers/:id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    return this.customersService.update(id, dto);
  }

  @Delete('customers/:id')
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: string) {
    await this.customersService.remove(id);
    return { success: true };
  }

  /* ── Contacts ── */

  @Get('customers/:id/contacts')
  findContacts(@Param('id') id: string) {
    return this.customersService.findContacts(id);
  }

  @Get('contacts')
  findAllContacts() {
    return this.customersService.findAllContacts();
  }

  @Post('customers/:id/contacts')
  @UseGuards(AdminGuard)
  createContact(@Param('id') id: string, @Body() dto: CreateContactDto) {
    return this.customersService.createContact({ ...dto, customerId: id });
  }

  @Patch('contacts/:id')
  @UseGuards(AdminGuard)
  updateContact(@Param('id') id: string, @Body() dto: UpdateContactDto) {
    return this.customersService.updateContact(id, dto);
  }

  @Delete('contacts/:id')
  @UseGuards(AdminGuard)
  async removeContact(@Param('id') id: string) {
    await this.customersService.removeContact(id);
    return { success: true };
  }

  /* ── Documents ── */

  @Get('customers/:id/documents')
  findDocuments(@Param('id') id: string) {
    return this.customersService.findDocuments(id);
  }

  @Post('customers/:id/documents')
  @UseGuards(AdminGuard)
  createDocument(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: CreateDocumentDto,
  ) {
    return this.customersService.createDocument(
      { ...dto, customerId: id },
      req.currentUser!.name,
    );
  }

  @Delete('documents/:id')
  @UseGuards(AdminGuard)
  async removeDocument(@Param('id') id: string) {
    await this.customersService.removeDocument(id);
    return { success: true };
  }

  /* ── Messages ── */

  @Get('customers/:id/messages')
  findMessages(@Param('id') id: string) {
    return this.customersService.findMessages(id);
  }

  @Post('customers/:id/messages')
  @UseGuards(AdminGuard)
  createMessage(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.customersService.createMessage(
      { ...dto, customerId: id },
      req.currentUser!.name,
    );
  }

  /* ── Invoices ── */

  @Get('invoices')
  findAllInvoices() {
    return this.customersService.findAllInvoices();
  }

  @Get('invoices/by-project/:projectId')
  findInvoicesByProject(@Param('projectId') projectId: string) {
    return this.customersService.findInvoicesByProject(projectId);
  }

  @Get('invoices/:id')
  findInvoice(@Param('id') id: string) {
    return this.customersService.findInvoiceById(id);
  }

  @Get('customers/:id/invoices')
  findInvoicesByCustomer(@Param('id') id: string) {
    return this.customersService.findInvoicesByCustomer(id);
  }

  @Post('customers/:id/invoices')
  @UseGuards(AdminGuard)
  createInvoice(@Param('id') id: string, @Body() dto: CreateInvoiceDto) {
    return this.customersService.createInvoice({ ...dto, customerId: id });
  }

  @Patch('invoices/:id')
  @UseGuards(AdminGuard)
  updateInvoice(@Param('id') id: string, @Body() dto: UpdateInvoiceDto) {
    return this.customersService.updateInvoice(id, dto);
  }

  @Delete('invoices/:id')
  @UseGuards(AdminGuard)
  async removeInvoice(@Param('id') id: string) {
    await this.customersService.removeInvoice(id);
    return { success: true };
  }
}
