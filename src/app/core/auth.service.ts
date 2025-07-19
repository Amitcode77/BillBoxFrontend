import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private currentUserSubject = new BehaviorSubject<any>(this.getUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('https://dummyjson.com/auth/login', { username, password }).pipe(
      tap(res => {
        sessionStorage.setItem(this.TOKEN_KEY, res.token);
        sessionStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
        this.currentUserSubject.next(res.user);
      })
    );
  }

  logout() {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): any {
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
} 