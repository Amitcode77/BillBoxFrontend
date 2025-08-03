import { Component, OnInit } from '@angular/core';
import { User, UsersApiResponse } from '../user.model';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';
  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = null;

    this.apiService.get<UsersApiResponse>('/user').subscribe({
      next: (response: UsersApiResponse) => {
        if (response.success) {
          this.users = response.data;
          this.filteredUsers = this.users;
        } else {
          this.error = 'Failed to load users';
        }
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
        this.error = error.message || 'An error occurred while loading users';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.onSearch(value);
  }

  onSearch(term: string) {
    this.searchTerm = term;
    const lower = term.toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      u.fullName.toLowerCase().includes(lower) ||
      u.email.toLowerCase().includes(lower) ||
      u.phone.includes(lower) ||
      u.role.toLowerCase().includes(lower)
    );
  }
} 