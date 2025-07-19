import { Component, OnInit } from '@angular/core';
import { User } from '../user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';

  ngOnInit(): void {
    // Mock data for now
    this.users = [
      {
        id: '1',
        name: 'Alice Smith',
        username: 'alice',
        phone_number: '123-456-7890',
        role_type: 'admin',
        isActive: true
      },
      {
        id: '2',
        name: 'Bob Johnson',
        username: 'bobby',
        phone_number: '987-654-3210',
        role_type: 'user',
        isActive: false
      }
    ];
    this.filteredUsers = this.users;
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.onSearch(value);
  }

  onSearch(term: string) {
    this.searchTerm = term;
    const lower = term.toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      u.name.toLowerCase().includes(lower) ||
      u.username.toLowerCase().includes(lower) ||
      u.phone_number.includes(lower) ||
      u.role_type.toLowerCase().includes(lower)
    );
  }
} 