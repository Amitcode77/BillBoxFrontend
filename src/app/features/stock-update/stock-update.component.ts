import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../products/product.model';

@Component({
  selector: 'app-stock-update',
  templateUrl: './stock-update.component.html',
  styleUrls: ['./stock-update.component.scss']
})
export class StockUpdateComponent implements OnInit {
  products: Product[] = [];
  stockForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.stockForm = this.fb.group({
      items: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Mock products with quantity
    this.products = [
      { id: '1', name: 'Product A', description: 'Desc A', mfdDate: new Date('2024-01-01'), expiryDate: new Date('2025-01-01'), price: 100, quantity: 10 },
      { id: '2', name: 'Product B', description: 'Desc B', mfdDate: new Date('2024-02-01'), expiryDate: new Date('2025-02-01'), price: 150, quantity: 5 },
      { id: '3', name: 'Product C', description: 'Desc C', mfdDate: new Date('2024-03-01'), expiryDate: new Date('2025-03-01'), price: 120, quantity: 20 },
      { id: '4', name: 'Product D', description: 'Desc D', mfdDate: new Date('2024-04-01'), expiryDate: new Date('2025-04-01'), price: 80, quantity: 0 },
      { id: '5', name: 'Product E', description: 'Desc E', mfdDate: new Date('2024-05-01'), expiryDate: new Date('2025-05-01'), price: 200, quantity: 50 }
    ];
    this.initForm();
    // Auto-calculate updatedQuantity on addQuantity change
    this.items.controls.forEach((ctrl, i) => {
      ctrl.get('addQuantity')?.valueChanges.subscribe(() => this.onAddQuantityChange(i));
      this.onAddQuantityChange(i); // initialize
    });
  }

  initForm() {
    const items = this.products.map(p => this.fb.group({
      id: [p.id],
      name: [p.name],
      initialQuantity: [p.quantity],
      addQuantity: [null, [Validators.required, Validators.min(0)]],
      updatedQuantity: [{ value: p.quantity, disabled: true }]
    }));
    this.stockForm.setControl('items', this.fb.array(items));
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
    // Simulate save
    const updated = this.items.value.map((item: any) => ({
      id: item.id,
      newQuantity: item.initialQuantity + Number(item.addQuantity)
    }));
    // TODO: Call API to update stock
    alert('Stock updated!\n' + JSON.stringify(updated, null, 2));
  }
} 