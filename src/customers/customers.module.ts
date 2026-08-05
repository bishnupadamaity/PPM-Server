import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { CustomerContact } from './customer-contact.entity';
import { CustomerDocument } from './customer-document.entity';
import { CustomerMessage } from './customer-message.entity';
import { CustomerInvoice } from './customer-invoice.entity';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { UsersModule } from '../users/users.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      CustomerContact,
      CustomerDocument,
      CustomerMessage,
      CustomerInvoice,
    ]),
    UsersModule,
    ProjectsModule,
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
