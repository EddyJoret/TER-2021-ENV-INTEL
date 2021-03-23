import { Component, AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';
import { ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit{
  private map: L.Map | L.LayerGroup<any> | undefined;
  data = [];
  dataCapt1: any;
  marker: any;
  latlgn: any;

  smallIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
    iconSize:    [25, 41],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize:  [41, 41]
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
        this.initMap();
        console.log(this.map);
        /*for(let i = 0; i <= response.handsetCards.length; i++){
          //console.log(response.handsetCards[i])
          //console.log(response.handsetCards[i].data);
          //console.log(JSON.stringify(response.handsetCards[i].data))
          //this.marker.bindPopup(JSON.stringify(response.handsetCards[i]._id));
          this.latlgn = L.latLng(response.handsetCards[0].Lat, response.handsetCards[0].Long);
          console.log(this.latlgn);
        }*/
      },
      error =>{
        alert('Impossible de recevoir les données du serveur');
      });
      //this.initMap();
      console.log(this.map);
  }

  private initMap(): void {
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
 
    const container = L.DomUtil.get('map');
    //console.log(container.leaflet_id);
    if (container != null) {
      //container._leaflet_id = null;
    }
 
    this.map = L.map('map', {
      center: [ 43.2951, -0.370797 ],
      zoom: 13
    });
 
    tiles.addTo(this.map);
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
