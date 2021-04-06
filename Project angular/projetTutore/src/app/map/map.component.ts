import { Component, AfterViewInit, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as L from 'leaflet';
import { map, shareReplay } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit{
  @Input() checkRecy: any;
  @Input() checkCommun: any;
  @Input() checkVerre: any;

  private map: L.Map | L.LayerGroup<any> | undefined;
  data = [];
  dataCapt1: any;
  
  groupVerre = new L.LayerGroup();
  groupCommun = new L.LayerGroup();
  groupRecy = new L.LayerGroup();

  greenRecy = new L.Icon({
    iconUrl: '../assets/recyclage-green.png',
    /*iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',*/
    iconSize:    [30, 30],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
  });

  orangeRecy = new L.Icon({
    iconUrl: '../assets/recyclage-orange.png',
    /*iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',*/
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize:    [30, 30],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
  });

  redRecy = new L.Icon({
    iconUrl: '../assets/recyclage-red.png',
    /*iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',*/
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize:    [30, 30],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
  });

  greenCom = new L.Icon({
    iconUrl: '../assets/commun-green.png',
    /*iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',*/
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize:    [30, 30],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
  });

  orangeCom = new L.Icon({
    iconUrl: '../assets/commun-orange.png',
    /*iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',*/
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize:    [30, 30],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
  });

  redCom = new L.Icon({
    iconUrl: '../assets/commun-red.png',
    /*iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',*/
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize:    [30, 30],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
  });

  greenGlass = new L.Icon({
    iconUrl: '../assets/glass-green.png',
    /*iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',*/
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize:    [30, 30],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
  });

  orangeGlass = new L.Icon({
    iconUrl: '../assets/glass-orange.png',
    /*iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',*/
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize:    [30, 30],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
  });

  redGlass = new L.Icon({
    iconUrl: '../assets/glass-red.png',
    /*iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',*/
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize:    [30, 30],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
  });

  

  isHandset: boolean = false;
  isHandsetObserver: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return true;
      }
      return false;
    })
  );

  ngOnInit(): void {
    this.isHandsetObserver.subscribe(currentObserverValue =>{
      this.isHandset = currentObserverValue;
    });
    this.appService.getDeals().subscribe(
      response=>{
        this.dataCapt1 = response.handsetCards;
        const container = L.DomUtil.get('map');
        if (container != null) {
          this.map?.off();
          this.map?.remove();
        }
        this.initMap();
      },
      error =>{
        alert('Impossible de recevoir les données du serveur');
      });
      //this.initMap();
  }

  private initMap(): void {
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 12,
      maxZoom: 20,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
 
    this.map = L.map('map', {
      center: [ 43.2951, -0.370797 ],
      zoom: 13
    });
 
    tiles.addTo(this.map);

    for(let i = 0; i <= this.dataCapt1.length; i++){
      this.initMarker(this.dataCapt1[i].Coord.Lat, this.dataCapt1[i].Coord.Long, this.dataCapt1[i]).addTo(this.map);
      this.map.addLayer(this.groupRecy);
      this.map.addLayer(this.groupCommun);
      this.map.addLayer(this.groupVerre);
    }
  }

  initMarker(lat: any, long:any, object:any){
    const marker = L.marker([lat, long]);
    marker.bindPopup("Poubelle numéro: " + object._id + "<br>" + "Type: " + object.Type + "<br><br>" + "<button id='btn-info' onclick='infoPoubelle()'>+ d'info</button>");
    if(object.Type == "Recyclage"){
      this.groupRecy?.addLayer(marker);
      marker.setIcon(this.greenRecy);
      if(object.Seuil <= object.Pression){
        marker.setIcon(this.redRecy);
      }else if(object.Seuil/2 < object.Pression){
        marker.setIcon(this.orangeRecy);
      }
    }else if(object.Type == "Commun"){
      this.groupCommun?.addLayer(marker);
      marker.setIcon(this.greenCom);
      if(object.Seuil <= object.Pression){
        marker.setIcon(this.redCom);
      }else if(object.Seuil/2 < object.Pression){
        marker.setIcon(this.orangeCom);
      }
    }else{
      this.groupVerre?.addLayer(marker);
      marker.setIcon(this.greenGlass);
      if(object.Seuil <= object.Pression){
        marker.setIcon(this.redGlass);
      }else if(object.Seuil/2 < object.Pression){
        marker.setIcon(this.orangeGlass);
      }
    }
    return marker;
  }

  removeRecy(){
    this.checkRecy = !this.checkRecy;
    if(!this.checkRecy){
      this.map?.addLayer(this.groupRecy);
    }else{
      this.map?.removeLayer(this.groupRecy);
    }
  }

  removeCommun(){
    this.checkCommun = !this.checkCommun;
    if(!this.checkCommun){
      this.map?.addLayer(this.groupCommun);
    }else{
      this.map?.removeLayer(this.groupCommun);
    }
  }

  removeVerre(){
    this.checkVerre = !this.checkVerre;
    if(!this.checkVerre){
      this.map?.addLayer(this.groupVerre);
    }else{
      this.map?.removeLayer(this.groupVerre);
    }
  }

  infoPoubelle(){
    console.log('ok poubelle');
  }

  constructor(private breakpointObserver: BreakpointObserver, public appService: AppService) {}
}
