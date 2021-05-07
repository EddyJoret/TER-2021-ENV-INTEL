import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { environment } from '../environments/environment'
import { MapsComponent } from '../app/pages/maps/maps.component';

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
  mapcompo: MapsComponent ;

  connect(){
    this.socket = io(environment.SOCKET_ENDPOINT);
    /*this.socket?.on('new-message', (message)=>{
      //observer.next(message);
      //console.log(message);
      console.log(message);
      if(this.mapcompo != undefined){
        console.log('recu');
        this.mapcompo.receiveData(message);
      }
      
    })*/
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

  /*sendMessagePoubelleId(message:any){
    this.socket?.emit('new-poubelle_id', message);
  }

  receiveDataPoubelleId() : Observable<any>{
    return new Observable((observer) =>{
      this.socket?.on('new-poubelle_id', (message)=>{
        observer.next(message);
      })
    })
  }*/
}
