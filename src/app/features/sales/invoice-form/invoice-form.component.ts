import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../../products/product.model';
import { InvoiceApiResponse } from '../invoice.model';
import { ApiService } from '../../../core/api.service';

interface InvoiceItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  available: number;
}

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss']
})
export class InvoiceFormComponent implements OnInit {
  products: Product[] = [];
  invoiceItems: InvoiceItem[] = [];
  invoiceForm: FormGroup;
  error: string | null = null;
  success: string | null = null;
  loading = false;

  // Payment methods
  paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'upi', label: 'UPI' },
    { value: 'other', label: 'Other' }
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.invoiceForm = this.fb.group({
      productId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      paymentMethod: ['cash', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.error = null;

    // Get all products for invoice creation
    this.apiService.get<any>('/product').subscribe({
      next: (response: any) => {
        if (response.success) {
          this.products = response.data.filter((product: Product) => product.quantity > 0); // Only products with stock
        } else {
          this.error = 'Failed to load products';
        }
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.error = error.message || 'An error occurred while loading products';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  get f() { return this.invoiceForm.controls; }

  addItem() {
    this.error = null;
    const productId = this.f['productId'].value;
    const quantity = +this.f['quantity'].value;
    const product = this.products.find(p => p._id === productId);
    if (!product) {
      this.error = 'Please select a product.';
      return;
    }
    if (quantity < 1 || quantity > product.quantity) {
      this.error = `Quantity must be between 1 and ${product.quantity}`;
      return;
    }
    // Check if already added
    const existing = this.invoiceItems.find(item => item.productId === productId);
    if (existing) {
      if (existing.quantity + quantity > product.quantity) {
        this.error = `Total quantity for ${product.name} cannot exceed ${product.quantity}`;
        return;
      }
      existing.quantity += quantity;
    } else {
      this.invoiceItems.push({
        productId: product._id!,
        name: product.name,
        price: product.price,
        quantity,
        available: product.quantity
      });
    }
    this.invoiceForm.patchValue({ productId: '', quantity: '' });
  }

  removeItem(index: number) {
    this.invoiceItems.splice(index, 1);
  }

  get total() {
    return this.invoiceItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  createInvoice() {
    if (this.invoiceItems.length === 0) {
      this.error = 'Add at least one product to the invoice.';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    // Prepare invoice data according to API specification
    const invoiceData = {
      soldBy: '507f1f77bcf86cd799439014', // TODO: Get from auth service
      items: this.invoiceItems.map(item => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price
      })),
      paymentMethod: this.f['paymentMethod'].value
    };

    this.apiService.post<InvoiceApiResponse>('/invoice', invoiceData).subscribe({
      next: (response: InvoiceApiResponse) => {
        if (response.success) {
          this.success = 'Invoice created successfully!';
          console.log('Invoice created:', response.data);
          
          // Clear form and redirect after a short delay
          setTimeout(() => {
            this.router.navigate(['/sales']);
          }, 1500);
        } else {
          this.error = 'Failed to create invoice';
        }
      },
      error: (error: any) => {
        console.error('Error creating invoice:', error);
        this.error = error.message || 'An error occurred while creating the invoice';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
} 