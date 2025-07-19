import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'new', component: ProductFormComponent },
  { path: ':id/edit', component: ProductFormComponent },
  { path: ':id', component: ProductDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule {} 