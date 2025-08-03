import { Component, OnInit } from '@angular/core';
import { Invoice, InvoicesApiResponse } from '../invoice.model';
import { ApiService } from '../../../core/api.service';
import { ProductMappingService } from '../product-mapping.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];
  showPrintInvoice = false;
  selectedInvoice: Invoice | null = null;
  loading = false;
  error: string | null = null;
  productsLoaded = false;

  constructor(
    private apiService: ApiService,
    private productMappingService: ProductMappingService
  ) {}

  ngOnInit(): void {
    // Load products mapping first, then load invoices
    this.productMappingService.loadProducts().subscribe(
      (loaded: boolean) => {
        this.productsLoaded = loaded;
        this.loadInvoices();
      }
    );
  }

  loadInvoices() {
    this.loading = true;
    this.error = null;

    this.apiService.get<InvoicesApiResponse>('/invoice').subscribe({
      next: (response: InvoicesApiResponse) => {
        if (response.success) {
          this.invoices = response.data;
          // Resolve product names for all invoices
          this.resolveProductNames();
        } else {
          this.error = 'Failed to load invoices';
        }
      },
      error: (error: any) => {
        console.error('Error loading invoices:', error);
        this.error = error.message || 'An error occurred while loading invoices';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private resolveProductNames() {
    this.invoices.forEach(invoice => {
      if (invoice.items) {
        invoice.items.forEach(item => {
          if (item.product && !item.name) {
            item.name = this.productMappingService.getProductName(item.product);
          }
        });
      }
    });
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