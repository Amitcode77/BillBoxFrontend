import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../products/product.model';
import { ApiService } from '../../core/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductMappingService {
  private productsMap = new Map<string, Product>();
  private productsLoaded = new BehaviorSubject<boolean>(false);
  private loading = false;

  constructor(private apiService: ApiService) {}

  /**
   * Load all products and create a mapping
   */
  loadProducts(): Observable<boolean> {
    if (this.loading) {
      return this.productsLoaded.asObservable();
    }

    if (this.productsMap.size > 0) {
      return this.productsLoaded.asObservable();
    }

    this.loading = true;

    // Get all products without pagination
    this.apiService.get<any>('/product?limit=1000').subscribe({
      next: (response: any) => {
        if (response.success) {
          this.productsMap.clear();
          response.data.forEach((product: Product) => {
            this.productsMap.set(product._id!, product);
          });
          this.productsLoaded.next(true);
        } else {
          this.productsLoaded.next(false);
        }
      },
      error: (error: any) => {
        console.error('Error loading products for mapping:', error);
        this.productsLoaded.next(false);
      },
      complete: () => {
        this.loading = false;
      }
    });

    return this.productsLoaded.asObservable();
  }

  /**
   * Get product name by ID
   */
  getProductName(productId: string): string {
    const product = this.productsMap.get(productId);
    return product ? product.name : `Product ${productId}`;
  }

  /**
   * Get product by ID
   */
  getProduct(productId: string): Product | undefined {
    return this.productsMap.get(productId);
  }

  /**
   * Check if products are loaded
   */
  isLoaded(): boolean {
    return this.productsMap.size > 0;
  }

  /**
   * Clear the mapping (useful for testing or refresh)
   */
  clearMapping(): void {
    this.productsMap.clear();
    this.productsLoaded.next(false);
  }
} 