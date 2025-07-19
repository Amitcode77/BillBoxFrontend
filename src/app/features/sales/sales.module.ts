import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SalesRoutingModule } from './sales-routing.module';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceFormComponent } from './invoice-form/invoice-form.component';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { PrintInvoiceComponent } from './print-invoice/print-invoice.component';

@NgModule({
  declarations: [InvoiceListComponent, InvoiceFormComponent, InvoiceDetailsComponent, PrintInvoiceComponent],
  imports: [CommonModule, ReactiveFormsModule, SalesRoutingModule]
})
export class SalesModule {} 