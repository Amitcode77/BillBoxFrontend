import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  userId: string | null = null;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      phone_number: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)]],
      role_type: ['', Validators.required],
      isActive: [true, Validators.required]
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.userId;
    if (this.isEditMode) {
      // Simulate loading user data (replace with API call)
      const mockUser: User = {
        id: this.userId!,
        name: 'Alice Smith',
        username: 'alice',
        phone_number: '123-456-7890',
        role_type: 'admin',
        isActive: true
      };
      this.userForm.patchValue({
        name: mockUser.name,
        username: mockUser.username,
        phone_number: mockUser.phone_number,
        role_type: mockUser.role_type,
        isActive: mockUser.isActive
      });
    }
  }

  get f() { return this.userForm.controls; }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    // Simulate API call
    if (this.isEditMode) {
      // Update user
      // ...
    } else {
      // Add user
      // ...
    }
    // Redirect to user list after save
    this.router.navigate(['/users']);
  }
} 