import { Component } from '@angular/core';
import { LoaderService } from './core/loader.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loaderVisible$: Observable<boolean>;

  constructor(private loaderService: LoaderService) {
    this.loaderVisible$ = this.loaderService.loading$;
  }
}
