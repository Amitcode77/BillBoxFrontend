import { Component } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent {
  // KPIs
  totalSalesToday = 12500;
  inventoryValue = 48000;
  lowStockCount = 3;

  // Sales Trends (Line Chart)
  salesTrendsData: ChartData<'line'> = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [2000, 3500, 4000, 3000, 5000, 7000, 6500],
        label: 'Sales',
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };
  salesTrendsType = 'line' as const;
  salesTrendsOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };

  // Top Products (Bar Chart)
  topProductsData: ChartData<'bar'> = {
    labels: ['Product A', 'Product B', 'Product C', 'Product D'],
    datasets: [
      {
        data: [120, 90, 70, 50],
        label: 'Units Sold',
        backgroundColor: ['#1976d2', '#43a047', '#ffa000', '#d32f2f']
      }
    ]
  };
  topProductsType = 'bar' as const;
  topProductsOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { display: false } },
    indexAxis: 'y',
    scales: { x: { beginAtZero: true } }
  };
} 