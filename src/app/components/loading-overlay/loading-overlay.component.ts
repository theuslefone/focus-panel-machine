import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingService } from '../../services/loading/loading.service';

@Component({
  selector: 'app-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.scss']
})
export class LoadingOverlayComponent implements OnInit, OnDestroy {

  public loading: boolean = false;
  private loadingSubscription: Subscription | undefined;

  constructor(private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.loadingSubscription = this.loadingService.loading$.subscribe((loading) => {
      this.loading = loading;
    });
  }

  ngOnDestroy(): void {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }
  
}
