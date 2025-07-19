import { Component, OnInit } from '@angular/core';

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
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];
  showPrintInvoice = false;
  selectedInvoice: Invoice | null = null;

  ngOnInit(): void {
    // Mock data for now
    this.invoices = [
      {
        id: 'INV-001',
        date: new Date('2025-07-19T10:00:00'),
        items: [
          { productId: '1', name: 'Product A', price: 100, quantity: 2 },
          { productId: '2', name: 'Product B', price: 150, quantity: 1 }
        ],
        total: 350
      },
      {
        id: 'INV-002',
        date: new Date('2025-07-18T15:30:00'),
        items: [
          { productId: '3', name: 'Product C', price: 120, quantity: 3 }
        ],
        total: 360
      }
    ];
  }

  openPrintInvoice(invoice: Invoice) {
    this.selectedInvoice = invoice;
    this.showPrintInvoice = true;
  }

  closePrintInvoice() {
    this.showPrintInvoice = false;
    this.selectedInvoice = null;
  }
} 