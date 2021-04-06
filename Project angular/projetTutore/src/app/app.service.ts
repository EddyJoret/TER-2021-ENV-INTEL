import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(public httpClient:HttpClient) { }

  /*getDeals(): Observable<any>{
    return this.httpClient.get('http://localhost:3000/capt1');
  }*/

  /*getMqtt(): Observable<any>{
    return this.httpClient.get('http://localhost:3000/mqtt');
  }*/

  socket: Socket | undefined;

  connect(){
    this.socket = io(environment.SOCKET_ENDPOINT);
  }

  receiveData() : Observable<any>{
    return new Observable((observer) =>{
      this.socket?.on('new-message', (message)=>{
        observer.next(message);
      })
    })
  }

  sendMessage(message:any){
    this.socket?.emit('new-message', message);
  }
}
