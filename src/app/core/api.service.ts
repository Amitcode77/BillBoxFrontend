import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ApiService {
  // Base URL can be set here or injected from environment
  private readonly baseUrl = '/api';

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { params, headers }).pipe(
      catchError(this.handleError)
    );
  }

  post<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  put<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  delete<T>(endpoint: string, headers?: HttpHeaders): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    // You can extend this for better error handling/logging
    let errorMsg = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side/network error
      errorMsg = `Error: ${error.error.message}`;
    } else {
      // Backend error
      errorMsg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMsg));
  }
} 