import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../product.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: string | null = null;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      mfdDate: ['', Validators.required],
      expiryDate: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;
    if (this.isEditMode) {
      // Simulate loading product data (replace with API call)
      const mockProduct: Product = {
        id: this.productId!,
        name: 'Product A',
        description: 'Description for Product A',
        mfdDate: new Date('2024-01-01'),
        expiryDate: new Date('2025-01-01'),
        price: 100
      };
      this.productForm.patchValue({
        name: mockProduct.name,
        description: mockProduct.description,
        mfdDate: this.formatDate(mockProduct.mfdDate),
        expiryDate: this.formatDate(mockProduct.expiryDate),
        price: mockProduct.price
      });
    }
  }

  formatDate(date: Date): string {
    // Format date as yyyy-MM-dd for input[type=date]
    return date.toISOString().split('T')[0];
  }

  get f() { return this.productForm.controls; }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    // Simulate API call
    if (this.isEditMode) {
      // Update product
      // ...
    } else {
      // Add product
      // ...
    }
    // Redirect to product list after save
    this.router.navigate(['/products']);
  }
} 