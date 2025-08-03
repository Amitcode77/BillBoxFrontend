import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductApiResponse } from '../product.model';
import { ApiService } from '../../../core/api.service';

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
  loading = false;



  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      image: ['']
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;
    
    if (this.isEditMode) {
      // In edit mode, make category, description, and image optional since they're not in update API
      this.productForm.get('category')?.clearValidators();
      this.productForm.get('category')?.updateValueAndValidity();
      this.productForm.get('description')?.clearValidators();
      this.productForm.get('description')?.updateValueAndValidity();
      this.productForm.get('image')?.clearValidators();
      this.productForm.get('image')?.updateValueAndValidity();
      
      // Load product data for editing
      this.loadProductData();
    }
  }

  private loadProductData() {
    if (!this.productId) return;

    this.loading = true;
    this.error = null;

    this.apiService.get<ProductApiResponse>(`/product/${this.productId}`).subscribe({
      next: (response: ProductApiResponse) => {
        if (response.success) {
          const product = response.data;
          this.productForm.patchValue({
            name: product.name,
            category: product.category,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            image: product.image || ''
          });
        } else {
          this.error = 'Failed to load product data';
        }
      },
      error: (error: any) => {
        console.error('Error loading product:', error);
        this.error = error.message || 'An error occurred while loading product data';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  get f() { return this.productForm.controls; }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    if (this.isEditMode) {
      // Update product - only send fields that can be updated
      const updateData = {
        name: this.productForm.value.name,
        price: this.productForm.value.price,
        quantity: this.productForm.value.quantity
      };
      this.updateProduct(updateData);
    } else {
      // Create new product
      const productData: Product = {
        name: this.productForm.value.name,
        category: this.productForm.value.category,
        description: this.productForm.value.description,
        price: this.productForm.value.price,
        quantity: this.productForm.value.quantity,
        image: this.productForm.value.image || undefined
      };
      this.createProduct(productData);
    }
  }

  private createProduct(productData: Product) {
    this.apiService.post<ProductApiResponse>('/product', productData).subscribe({
      next: (response: ProductApiResponse) => {
        if (response.success) {
          console.log('Product created successfully:', response.data);
          this.router.navigate(['/products']);
        } else {
          this.error = 'Failed to create product';
        }
      },
      error: (error: any) => {
        console.error('Error creating product:', error);
        this.error = error.message || 'An error occurred while creating the product';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private updateProduct(updateData: any) {
    if (!this.productId) return;

    this.apiService.patch<ProductApiResponse>(`/product/${this.productId}`, updateData).subscribe({
      next: (response: ProductApiResponse) => {
        if (response.success) {
          console.log('Product updated successfully:', response.data);
          this.router.navigate(['/products']);
        } else {
          this.error = 'Failed to update product';
        }
      },
      error: (error: any) => {
        console.error('Error updating product:', error);
        this.error = error.message || 'An error occurred while updating the product';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
} 