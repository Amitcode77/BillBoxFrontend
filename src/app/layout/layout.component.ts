import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { User } from '../features/auth/auth.model';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  user: User | null = null;
  loading = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Subscribe to current user changes
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  logout() {
    this.loading = true;
    
    this.authService.logout().subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Logout successful');
          this.router.navigate(['/login']);
        } else {
          console.error('Logout failed:', response.message);
          // Still navigate to login even if API fails
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Still navigate to login even if API fails
        this.router.navigate(['/login']);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  getUserDisplayName(): string {
    if (!this.user) return 'Guest';
    return this.user.fullName || this.user.email || 'User';
  }

  getUserRole(): string {
    if (!this.user) return 'guest';
    return this.user.role || 'user';
  }
} 