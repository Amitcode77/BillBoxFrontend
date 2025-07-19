import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  user = {
    name: 'John Doe',
    role: 'admin'
  };

  constructor(private router: Router) {}

  logout() {
    // TODO: Call AuthService.logout() in real app
    this.router.navigate(['/login']);
  }
} 