import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  private requestCount = 0;

  show() {
    this.requestCount++;
    this.loadingSubject.next(true);
  }

  hide() {
    if (this.requestCount > 0) {
      this.requestCount--;
    }
    if (this.requestCount === 0) {
      this.loadingSubject.next(false);
    }
  }
} 