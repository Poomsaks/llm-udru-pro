import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  private totalSource = new BehaviorSubject<number>(0);
  total$ = this.totalSource.asObservable();

  setTotal(value: number) {
    this.totalSource.next(value);
  }

}
