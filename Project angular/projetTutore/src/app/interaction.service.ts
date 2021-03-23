import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {
  
  private _messageSource = new Subject<string>();
  dataMessage$ = this._messageSource.asObservable();
  constructor() { }

  sendData(data: string){
    this._messageSource.next(data);
  }
}
