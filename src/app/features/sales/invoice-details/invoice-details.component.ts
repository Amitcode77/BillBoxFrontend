import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Invoice, InvoiceApiResponse } from '../invoice.model';
import { ApiService } from '../../../core/api.service';
import { ProductMappingService } from '../product-mapping.service';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss']
})
export class InvoiceDetailsComponent implements OnInit {
  invoice: Invoice | null = null;
  loading = false;
  error: string | null = null;
  invoiceId: string | null = null;
  productsLoaded = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private apiService: ApiService,
    private productMappingService: ProductMappingService
  ) {}

  ngOnInit(): void {
    this.invoiceId = this.route.snapshot.paramMap.get('id');
    
    // Load products mapping first, then load invoice
    this.productMappingService.loadProducts().subscribe(
      (loaded: boolean) => {
        this.productsLoaded = loaded;
        if (this.invoiceId) {
          this.loadInvoice(this.invoiceId);
        }
      }
    );
  }

  loadInvoice(id: string) {
    this.loading = true;
    this.error = null;

    this.apiService.get<InvoiceApiResponse>(`/invoice/${id}`).subscribe({
      next: (response: InvoiceApiResponse) => {
        if (response.success) {
          this.invoice = response.data;
          // Resolve product names
          this.resolveProductNames();
        } else {
          this.error = 'Failed to load invoice';
        }
      },
      error: (error: any) => {
        console.error('Error loading invoice:', error);
        this.error = error.message || 'An error occurred while loading the invoice';
      },
      complete: () => {
        this.loading = false;
      }
    });
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

  retry() {
    if (this.invoiceId) {
      this.loadInvoice(this.invoiceId);
    }
  }

  goBack() {
    this.router.navigate(['/sales']);
  }
} 