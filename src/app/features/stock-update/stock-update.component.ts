import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { Product, ProductsApiResponse } from '../products/product.model';
import { ApiService } from '../../core/api.service';

interface BulkUpdateResponse {
  message: string;
  success: boolean;
  updated: Array<{
    productId: string;
    name: string;
    oldQuantity: number;
    newQuantity: number;
    success: boolean;
  }>;
  errors: Array<{
    productId: string;
    error: string;
  }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

@Component({
  selector: 'app-stock-update',
  templateUrl: './stock-update.component.html',
  styleUrls: ['./stock-update.component.scss']
})
export class StockUpdateComponent implements OnInit {
  products: Product[] = [];
  stockForm: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.stockForm = this.fb.group({
      items: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.error = null;

    // Get all products without pagination for stock update
    const params = new HttpParams().set('limit', '1000'); // Get all products

    this.apiService.get<ProductsApiResponse>('/product', params).subscribe({
      next: (response: ProductsApiResponse) => {
        if (response.success) {
          this.products = response.data;
          this.initForm();
          this.setupQuantityChangeListeners();
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

  initForm() {
    const items = this.products.map(p => this.fb.group({
      id: [p._id],
      name: [p.name],
      category: [p.category],
      initialQuantity: [p.quantity],
      addQuantity: [null, [Validators.required, Validators.min(0)]],
      updatedQuantity: [{ value: p.quantity, disabled: true }]
    }));
    this.stockForm.setControl('items', this.fb.array(items));
  }

  setupQuantityChangeListeners() {
    // Auto-calculate updatedQuantity on addQuantity change
    this.items.controls.forEach((ctrl, i) => {
      ctrl.get('addQuantity')?.valueChanges.subscribe(() => this.onAddQuantityChange(i));
      this.onAddQuantityChange(i); // initialize
    });
  }

  get items() {
    return this.stockForm.get('items') as FormArray;
  }

  onAddQuantityChange(index: number) {
    const item = this.items.at(index);
    const initial = item.get('initialQuantity')?.value || 0;
    const add = +item.get('addQuantity')?.value || 0;
    item.get('updatedQuantity')?.setValue(initial + add);
  }

  onSubmit() {
    if (this.stockForm.invalid) {
      this.stockForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    // Prepare bulk update data
    const quantityUpdates = this.items.value
      .filter((item: any) => item.addQuantity > 0) // Only include items with quantity changes
      .map((item: any) => ({
        productId: item.id,
        quantity: item.initialQuantity + Number(item.addQuantity)
      }));

    if (quantityUpdates.length === 0) {
      this.error = 'No quantity changes detected. Please add quantities to update.';
      this.loading = false;
      return;
    }

    this.performBulkUpdate(quantityUpdates);
  }

  private performBulkUpdate(quantityUpdates: any[]) {
    const updateData = { quantityUpdates };

    this.apiService.post<BulkUpdateResponse>('/product/stock_update', updateData).subscribe({
      next: (response: BulkUpdateResponse) => {
        if (response.success) {
          this.success = `Bulk update completed! ${response.summary.successful} successful, ${response.summary.failed} failed.`;
          
          // Show detailed results
          if (response.updated.length > 0) {
            console.log('Successfully updated:', response.updated);
          }
          if (response.errors.length > 0) {
            console.error('Update errors:', response.errors);
          }
          
          // Reload products to get updated quantities
          this.loadProducts();
        } else {
          this.error = 'Failed to update quantities';
        }
      },
      error: (error: any) => {
        console.error('Error updating quantities:', error);
        this.error = error.message || 'An error occurred while updating quantities';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        this.ngOnInit();
      }
    });
  }

  clearForm() {
    this.items.controls.forEach(ctrl => {
      ctrl.get('addQuantity')?.setValue(null);
    });
    this.error = null;
    this.success = null;
  }
} 