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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get username(): AbstractControl | null {
    return this.loginForm.get('username');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  get usernameError(): string | null {
    if (this.username?.touched && this.username?.invalid) {
      if (this.username.errors?.['required']) {
        return 'Username is required';
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

  get isUsernameInvalid(): boolean {
    return !!(this.username && this.username.touched && this.username.invalid);
  }

  get isPasswordInvalid(): boolean {
    return !!(this.password && this.password.touched && this.password.invalid);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.router.navigate(['/dashboard']);
    // this.error = null;
    // const { username, password } = this.loginForm.value;
    // this.authService.login(username, password).subscribe({
    //   next: () => {
    //     this.router.navigate(['/dashboard']);
    //   },
    //   error: (err) => {
    //     this.error = err.message || 'Login failed. Please try again.';
    //   }
    // });
  }
} 