import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

@NgModule({
  declarations: [ProductListComponent, ProductFormComponent, ProductDetailsComponent],
  imports: [CommonModule, ReactiveFormsModule, ProductsRoutingModule]
})
export class ProductsModule {} 