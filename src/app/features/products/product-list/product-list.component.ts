import { Component, OnInit } from '@angular/core';
import { Product } from '../product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm = '';
  sortColumn: keyof Product | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  loading = false;

  ngOnInit(): void {
    // Mock data for now
    this.products = [
      {
        id: '1',
        name: 'Product A',
        description: 'Description for Product A',
        mfdDate: new Date('2024-01-01'),
        expiryDate: new Date('2025-01-01'),
        price: 100,
        quantity: 10
      },
      {
        id: '2',
        name: 'Product B',
        description: 'Description for Product B',
        mfdDate: new Date('2024-02-01'),
        expiryDate: new Date('2025-02-01'),
        price: 150,
        quantity: 5
      },
      {
        id: '3',
        name: 'Product C',
        description: 'Description for Product C',
        mfdDate: new Date('2024-03-01'),
        expiryDate: new Date('2025-03-01'),
        price: 120,
        quantity: 20
      }
    ];
    this.filteredProducts = this.products;
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.onSearch(value);
  }

  async onSearch(term: string) {
    this.searchTerm = term;
    this.loading = true;
    // Simulate network call
    await this.simulateNetworkDelay();
    const lower = term.toLowerCase();
    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower)
    );
    if (this.sortColumn) {
      this.sortBy(this.sortColumn);
    }
    this.loading = false;
  }

  async sortBy(column: keyof Product) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.loading = true;
    // Simulate network call
    await this.simulateNetworkDelay();
    this.filteredProducts = [...this.filteredProducts].sort((a, b) => {
      let aValue = a[column];
      let bValue = b[column];
      if (aValue instanceof Date && bValue instanceof Date) {
        aValue = aValue.getTime();
        bValue = bValue.getTime();
      }
      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    this.loading = false;
  }

  private simulateNetworkDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 500));
  }
} 