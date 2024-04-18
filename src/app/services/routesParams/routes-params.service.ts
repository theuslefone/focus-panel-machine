import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteParamsService {
  private idClientSubject = new BehaviorSubject<string>('');
  private idClpSubject = new BehaviorSubject<string>('');

  idClient$ = this.idClientSubject.asObservable();
  idClp$ = this.idClpSubject.asObservable();

  setIdClient(idClient: string) {
    this.idClientSubject.next(idClient);
  }

  setIdClp(idClp: string) {
    this.idClpSubject.next(idClp);
  }
}
