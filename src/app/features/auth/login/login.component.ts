import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get email(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  get emailError(): string | null {
    if (this.email?.touched && this.email?.invalid) {
      if (this.email.errors?.['required']) {
        return 'Email is required';
      }
      if (this.email.errors?.['email']) {
        return 'Please enter a valid email address';
      }
    }
    return null;
  }

  get passwordError(): string | null {
    if (this.password?.touched && this.password?.invalid) {
      if (this.password.errors?.['required']) {
        return 'Password is required';
      }
    }
    return null;
  }

  get isEmailInvalid(): boolean {
    return !!(this.email && this.email.touched && this.email.invalid);
  }

  get isPasswordInvalid(): boolean {
    return !!(this.password && this.password.touched && this.password.invalid);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const { email, password } = this.loginForm.value;
    
    this.authService.login(email, password).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Login successful:', response.data.user);
          this.router.navigate(['/dashboard']);
        } else {
          this.error = response.message || 'Login failed. Please try again.';
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.error = err.error?.message || err.message || 'Login failed. Please try again.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
} 