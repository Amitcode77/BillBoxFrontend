import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, LoginRequest, LoginResponse } from '../features/auth/auth.model';
import { environment } from 'src/environments/environment';

interface LogoutResponse {
  success: boolean;
  message: string;
  data: {
    loggedOut: boolean;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    const loginData: LoginRequest = { email, password };
    
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, loginData).pipe(
      tap(response => {
        if (response.success) {
          // Store token and user data
          sessionStorage.setItem(this.TOKEN_KEY, response.data.token);
          sessionStorage.setItem(this.USER_KEY, JSON.stringify(response.data.user));
          this.currentUserSubject.next(response.data.user);
        }
      })
    );
  }

  logout(): Observable<LogoutResponse> {
    const token = this.getToken();
    let headers = new HttpHeaders();
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return this.http.post<LogoutResponse>(`${environment.apiUrl}/auth/logout`, {}, { headers }).pipe(
      tap(() => {
        // Clear local storage regardless of API response
        this.clearLocalData();
      })
    );
  }

  private clearLocalData() {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): User | null {
    const user = sessionStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

  getUserPermissions(): string[] {
    const user = this.getUser();
    return user ? user.permissions : [];
  }

  hasPermission(permission: string): boolean {
    const permissions = this.getUserPermissions();
    return permissions.includes(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    const userPermissions = this.getUserPermissions();
    return permissions.some(permission => userPermissions.includes(permission));
  }
} 