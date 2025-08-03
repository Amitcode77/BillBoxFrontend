import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UserApiResponse } from '../user.model';
import { ApiService } from '../../../core/api.service';

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
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.userId;
    
    if (this.isEditMode) {
      // Remove password validation for edit mode
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
      
      // Load user data for editing
      this.loadUserData();
    }
  }

  private loadUserData() {
    if (!this.userId) return;

    this.loading = true;
    this.error = null;

    this.apiService.get<UserApiResponse>(`/user/${this.userId}`).subscribe({
      next: (response: UserApiResponse) => {
        if (response.success) {
          const user = response.data;
          this.userForm.patchValue({
            email: user.email,
            fullName: user.fullName,
            phone: user.phone,
            role: user.role
          });
        } else {
          this.error = 'Failed to load user data';
        }
      },
      error: (error: any) => {
        console.error('Error loading user:', error);
        this.error = error.message || 'An error occurred while loading user data';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  get f() { return this.userForm.controls; }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    if (this.isEditMode) {
      // Update user - only send fields that can be updated
      const updateData = {
        fullName: this.userForm.value.fullName,
        phone: this.userForm.value.phone,
        role: this.userForm.value.role
      };
      this.updateUser(updateData);
    } else {
      // Create new user
      const userData: User = {
        email: this.userForm.value.email,
        fullName: this.userForm.value.fullName,
        phone: this.userForm.value.phone,
        password: this.userForm.value.password,
        role: this.userForm.value.role
      };
      this.createUser(userData);
    }
  }

  private updateUser(updateData: any) {
    if (!this.userId) return;

    this.apiService.patch<UserApiResponse>(`/user/${this.userId}`, updateData).subscribe({
      next: (response: UserApiResponse) => {
        if (response.success) {
          console.log('User updated successfully:', response.data);
          this.router.navigate(['/users']);
        } else {
          this.error = 'Failed to update user';
        }
      },
      error: (error: any) => {
        console.error('Error updating user:', error);
        this.error = error.message || 'An error occurred while updating the user';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private createUser(userData: User) {
    this.apiService.post<UserApiResponse>('/user', userData).subscribe({
      next: (response: UserApiResponse) => {
        if (response.success) {
          console.log('User created successfully:', response.data);
          this.router.navigate(['/users']);
        } else {
          this.error = 'Failed to create user';
        }
      },
      error: (error: any) => {
        console.error('Error creating user:', error);
        this.error = error.message || 'An error occurred while creating the user';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
} 