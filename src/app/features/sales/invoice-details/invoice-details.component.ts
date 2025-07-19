import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface InvoiceItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Invoice {
  id: string;
  date: Date;
  items: InvoiceItem[];
  total: number;
}

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss']
})
export class InvoiceDetailsComponent implements OnInit {
  invoice: Invoice | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    // Mock data for now
    if (id === 'INV-001') {
      this.invoice = {
        id: 'INV-001',
        date: new Date('2025-07-19T10:00:00'),
        items: [
          { productId: '1', name: 'Product A', price: 100, quantity: 2 },
          { productId: '2', name: 'Product B', price: 150, quantity: 1 }
        ],
        total: 350
      };
    } else if (id === 'INV-002') {
      this.invoice = {
        id: 'INV-002',
        date: new Date('2025-07-18T15:30:00'),
        items: [
          { productId: '3', name: 'Product C', price: 120, quantity: 3 }
        ],
        total: 360
      };
    } else {
      this.invoice = null;
    }
  }

  printInvoice() {
    window.print();
  }
} 