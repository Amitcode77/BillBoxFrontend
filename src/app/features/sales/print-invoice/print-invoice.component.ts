import { Component, Input, Output, EventEmitter } from '@angular/core';

interface InvoiceItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Invoice {
  id: string;
  date: Date;
  items: InvoiceItem[];
  total: number;
}

@Component({
  selector: 'app-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.scss']
})
export class PrintInvoiceComponent {
  @Input() invoice: Invoice | null = null;
  @Output() close = new EventEmitter<void>();

  printInvoice() {
    window.print();
  }

  saveAsPDF() {
    window.print();
  }
} 