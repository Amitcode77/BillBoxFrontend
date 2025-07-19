import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

interface Product {
  id: string;
  name: string;
  price: number;
  available: number;
}

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

  constructor(private fb: FormBuilder) {
    this.invoiceForm = this.fb.group({
      productId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    // Dummy product data
    this.products = [
      { id: '1', name: 'Product A', price: 100, available: 10 },
      { id: '2', name: 'Product B', price: 150, available: 5 },
      { id: '3', name: 'Product C', price: 120, available: 8 }
    ];
  }

  get f() { return this.invoiceForm.controls; }

  addItem() {
    this.error = null;
    const productId = this.f['productId'].value;
    const quantity = +this.f['quantity'].value;
    const product = this.products.find(p => p.id === productId);
    if (!product) {
      this.error = 'Please select a product.';
      return;
    }
    if (quantity < 1 || quantity > product.available) {
      this.error = `Quantity must be between 1 and ${product.available}`;
      return;
    }
    // Check if already added
    const existing = this.invoiceItems.find(item => item.productId === productId);
    if (existing) {
      if (existing.quantity + quantity > product.available) {
        this.error = `Total quantity for ${product.name} cannot exceed ${product.available}`;
        return;
      }
      existing.quantity += quantity;
    } else {
      this.invoiceItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        available: product.available
      });
    }
    this.invoiceForm.reset({ productId: '', quantity: '' });
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
    // Simulate API call
    this.success = 'Invoice created successfully!';
    this.error = null;
    this.invoiceItems = [];
    this.invoiceForm.reset({ productId: '', quantity: '' });
    setTimeout(() => this.success = null, 2000);
  }
} 