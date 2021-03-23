import { Component, AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  private map: L.Map | L.LayerGroup<any> | undefined;
  data = [];
  dataCapt1: any;
  //marker: any;
  latlgn: any;

  smallIcon = new L.Icon({
    iconUrl: '../assets/delete.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
    iconSize:    [25, 25],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize:  [35, 33]
  });

  greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  orangeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
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
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
 
    this.map = L.map('map', {
      center: [ 43.2951, -0.370797 ],
      zoom: 13
    });
 
    tiles.addTo(this.map);

    const marker = L.marker([this.dataCapt1[0].Lat, this.dataCapt1[0].Long], { icon: this.greenIcon }).addTo(this.map);
    marker.bindPopup("Pression :"+ this.dataCapt1[0].Pression, {minWidth: 100, maxHeight: 1000});
    const marker2 = L.marker([43.31612921579041, -0.3604853135427254], { icon: this.greenIcon }).addTo(this.map);
    marker2.bindPopup("Pression :"+ this.dataCapt1[1].Pression, {minWidth: 100, maxHeight: 1000});
    const marker3 = L.marker([43.31393383437617, -0.37402919927750927], { icon: this.greenIcon }).addTo(this.map);
    marker3.bindPopup("Pression :"+ this.dataCapt1[2].Pression, {minWidth: 100, maxHeight: 1000});

    if(this.dataCapt1[0].Pression >= this.dataCapt1[0].Seuil){
      marker.setIcon(this.redIcon);
    }else if (this.dataCapt1[0].Pression > this.dataCapt1[0].Seuil/2){
      marker.setIcon(this.orangeIcon);
    }
    if(this.dataCapt1[1].Pression >= this.dataCapt1[1].Seuil){
      marker2.setIcon(this.redIcon);
    }else if (this.dataCapt1[1].Pression > this.dataCapt1[1].Seuil/2){
      marker2.setIcon(this.orangeIcon);
    }
    if(this.dataCapt1[2].Pression >= this.dataCapt1[2].Seuil){
      marker3.setIcon(this.redIcon);
    }else if (this.dataCapt1[2].Pression > this.dataCapt1[2].Seuil/2){
      marker3.setIcon(this.orangeIcon);
    }

    console.log(this.dataCapt1);
    
    
  }

  /*createMap() {
    const pau = {
      lat: 43.2951,
      lng: -0.370797,
    };

    const zoomLevel = 13;

    this.map = L.map('map', {
      center: [pau.lat, pau.lng],
      zoom: zoomLevel
    });

    const mainLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 12,
      maxZoom: 17,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    mainLayer.addTo(this.map);
    //this.marker = L.marker([this.dataCapt1[0].Lat, this.dataCapt1[0].Long], { icon: this.orangeIcon }).addTo(this.map);
    
    const marker2 = L.marker([43.295918745162524, -0.3740672038575137], { icon: this.greenIcon }).addTo(this.map);
    //console.log(this.dataCapt1[0].Lat);
    //https://github.com/pointhi/leaflet-color-markers
  }*/

  constructor(private breakpointObserver: BreakpointObserver, public appService: AppService) {}
}
