import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Product, ProductsApiResponse } from '../product.model';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm = '';
  selectedCategory = '';
  sortColumn: keyof Product | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  loading = false;
  error: string | null = null;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  // Categories for filter
  categories: string[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.error = null;

    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('limit', this.itemsPerPage.toString());

    if (this.searchTerm) {
      params = params.set('search', this.searchTerm);
    }

    if (this.selectedCategory) {
      params = params.set('category', this.selectedCategory);
    }

    this.apiService.get<ProductsApiResponse>('/product', params).subscribe({
      next: (response: ProductsApiResponse) => {
        if (response.success) {
          this.products = response.data;
          this.filteredProducts = this.products;
          this.totalItems = response.pagination.total;
          this.totalPages = response.pagination.pages;
          this.currentPage = response.pagination.page;
          
          // Extract unique categories for filter dropdown
          this.extractCategories();
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

  private extractCategories() {
    const categorySet = new Set<string>();
    this.products.forEach(product => {
      if (product.category) {
        categorySet.add(product.category);
      }
    });
    this.categories = Array.from(categorySet).sort();
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.onSearch(value);
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.currentPage = 1; // Reset to first page when searching
    this.loadProducts();
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    this.currentPage = 1; // Reset to first page when filtering
    this.loadProducts();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadProducts();
  }

  sortBy(column: keyof Product) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    // Sort the current page data
    this.filteredProducts = [...this.filteredProducts].sort((a, b) => {
      let aValue = a[column];
      let bValue = b[column];
      
      // Handle undefined values
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return this.sortDirection === 'asc' ? -1 : 1;
      if (bValue === undefined) return this.sortDirection === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.currentPage = 1;
    this.loadProducts();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  // Make Math available in template
  get Math() {
    return Math;
  }
} 