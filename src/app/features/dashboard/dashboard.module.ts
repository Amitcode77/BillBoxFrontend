import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [DashboardHomeComponent],
  imports: [CommonModule, DashboardRoutingModule, NgChartsModule]
})
export class DashboardModule {} 