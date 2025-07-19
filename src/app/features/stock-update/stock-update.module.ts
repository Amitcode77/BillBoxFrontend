import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StockUpdateComponent } from './stock-update.component';
import { StockUpdateRoutingModule } from './stock-update-routing.module';

@NgModule({
  declarations: [StockUpdateComponent],
  imports: [CommonModule, ReactiveFormsModule, StockUpdateRoutingModule]
})
export class StockUpdateModule {} 