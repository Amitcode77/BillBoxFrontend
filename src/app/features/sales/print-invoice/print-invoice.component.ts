import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Invoice } from '../invoice.model';
import { ProductMappingService } from '../product-mapping.service';

@Component({
  selector: 'app-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.scss']
})
export class PrintInvoiceComponent implements OnInit {
  @Input() invoice: Invoice | null = null;
  @Output() close = new EventEmitter<void>();

  constructor(private productMappingService: ProductMappingService) {}

  ngOnInit(): void {
    // Load products mapping if not already loaded
    if (!this.productMappingService.isLoaded()) {
      this.productMappingService.loadProducts().subscribe(() => {
        this.resolveProductNames();
      });
    } else {
      this.resolveProductNames();
    }
  }

  private resolveProductNames() {
    if (this.invoice && this.invoice.items) {
      this.invoice.items.forEach(item => {
        if (item.product && !item.name) {
          item.name = this.productMappingService.getProductName(item.product);
        }
      });
    }
  }

  printInvoice() {
    window.print();
  }
} 