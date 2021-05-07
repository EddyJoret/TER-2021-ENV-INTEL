import { Component,Input,OnInit } from '@angular/core';
import * as L from 'leaflet';
import Chart from 'chart.js';
import { AppService } from '../../app.service';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

@Component({
    moduleId: module.id,
    selector: 'maps-cmp',
    templateUrl: 'maps.component.html'
})

export class MapsComponent implements OnInit {
    constructor(public appService: AppService) {}
    @Input() checkRecy: any;
    @Input() checkCommun: any;
    @Input() checkVerre: any;
    map:any;
    data = [];
    dataCapt1: any;
    message : string | undefined;
    date: any;
    
    groupVerre = new L.LayerGroup();
    groupCommun = new L.LayerGroup();
    groupRecy = new L.LayerGroup();

    public canvas : any;
    public canvas2 : any;
    public canvas3 : any;
    public canvas4 : any;
    public ctx;
    public ctx2;
    public ctx3;
    public ctx4;
    public chartColor;
    public chartEmail;
    public chartpoub1;
    public chartpoub2;
    public chartpoub3;
    public chartpoub4;

    greenRecy = new L.Icon({
        iconUrl: '../',
        /*iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',*/
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize:    [30, 30],
        iconAnchor:  [12, 41],
        popupAnchor: [1, -34],
    });

    orangeRecy = new L.Icon({
        iconUrl: '../../../assets/img/recyclage-orange.png',
        /*iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',*/
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize:    [30, 30],
        iconAnchor:  [12, 41],
        popupAnchor: [1, -34],
    });

    redRecy = new L.Icon({
        iconUrl: '../../../assets/img/recyclage-red.png',
        /*iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',*/
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize:    [30, 30],
        iconAnchor:  [12, 41],
        popupAnchor: [1, -34],
    });

    greenCom = new L.Icon({
        iconUrl: '../../../assets/img/commun-green.png',
        /*iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',*/
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize:    [30, 30],
        iconAnchor:  [12, 41],
        popupAnchor: [1, -34],
    });

    orangeCom = new L.Icon({
        iconUrl: '../../../assets/img/commun-orange.png',
        /*iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',*/
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize:    [30, 30],
        iconAnchor:  [12, 41],
        popupAnchor: [1, -34],
    });

    redCom = new L.Icon({
        iconUrl: '../../../assets/img/commun-red.png',
        /*iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',*/
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize:    [30, 30],
        iconAnchor:  [12, 41],
        popupAnchor: [1, -34],
    });

    greenGlass = new L.Icon({
        iconUrl: '../../../assets/img/glass-green.png',
        /*iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',*/
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize:    [30, 30],
        iconAnchor:  [12, 41],
        popupAnchor: [1, -34],
    });

    orangeGlass = new L.Icon({
        iconUrl: '../../../assets/img/glass-orange.png',
        /*iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',*/
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize:    [30, 30],
        iconAnchor:  [12, 41],
        popupAnchor: [1, -34],
    });

    redGlass = new L.Icon({
        iconUrl: '../../../assets/img/glass-red.png',
        /*iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',*/
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize:    [30, 30],
        iconAnchor:  [12, 41],
        popupAnchor: [1, -34],
    });
    ngOnInit() {
        this.appService.connect();
        this.sendMessage();
        this.receiveData();
        setInterval(() => {
            this.sendMessage();
            //this.sendMessagePoubelleId();
            this.receiveData();
            //this.receiveDataPoubelleId();
        }, 60000);
        this.initMap()
        //this.initchart();
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
    }
    receiveData(){
        /*this.dataCapt1 = [...message];
          console.log('ok  let');
          if(this.groupRecy != undefined){
            this.map.removeLayer(this.groupRecy);
            this.groupRecy.clearLayers();
          }
          if(this.groupCommun != undefined){
            this.map.removeLayer(this.groupCommun);
            this.groupCommun.clearLayers();
          }
          if(this.groupVerre != undefined){
            this.map.removeLayer(this.groupVerre);
            this.groupVerre.clearLayers();
          }
          this.addMarker(message);
          console.log(message);
          this.initchart(message);
          this.date = new Date();
          //console.log(this.date);*/
        this.appService.receiveData().subscribe((message) =>{
          console.log(message);
          this.dataCapt1 = [...message];
          if(this.groupRecy != undefined){
            this.map.removeLayer(this.groupRecy);
            this.groupRecy.clearLayers();
          }
          if(this.groupCommun != undefined){
            this.map.removeLayer(this.groupCommun);
            this.groupCommun.clearLayers();
          }
          if(this.groupVerre != undefined){
            this.map.removeLayer(this.groupVerre);
            this.groupVerre.clearLayers();
          }
          this.addMarker(message);
          //console.log(message);
          //this.initchart(message);
          this.date = new Date();
          //console.log(this.date);
    
          
        },
        (error) => {
          console.log(error);
        },
        () => {
          console.log('Fini');
          
        }
        );
    }
      sendMessage(){
        this.appService.sendMessage(this.message);
        this.message = "ok";
      }

    addMarker(message:any){
        for(let i = 0; i <= message.length; i++){
            if(message[i] != undefined){
                this.initMarker(message[i].Coord.Lat, message[i].Coord.Long, message[i]).addTo(this.map);
                this.map.addLayer(this.groupRecy);
                this.map.addLayer(this.groupCommun);
                this.map.addLayer(this.groupVerre);
            }
            
        }
    }

    initMarker(lat: any, long:any, object:any){
        const marker = L.marker([lat, long]);
        marker.bindPopup("Type: " + object.Type + "<br><br>" + "Pression: " + object.Pression + "<br><br>" + "Seuil: " + object.Seuil);
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

    initchart(object:any){
        this.chartColor = "#FFFFFF";
        this.canvas = document.getElementById("chartpoub1");
        this.canvas2 = document.getElementById("chartpoub2");
        this.canvas3 = document.getElementById("chartpoub3");
        this.canvas4 = document.getElementById("chartpoub4");
        this.ctx = this.canvas.getContext("2d");
        this.ctx2 = this.canvas2.getContext("2d");
        this.ctx3 = this.canvas3.getContext("2d");
        this.ctx4 = this.canvas4.getContext("2d");
        //console.log(object[0].Pression);
        this.chartpoub1 = new Chart(this.ctx, {
            type: 'bar',

            data: {
                labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
                datasets: [{
                    borderColor: "#6bd098",
                    backgroundColor: "#6bd098",
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    borderWidth: 3,
                    //data: [300, 310, 316, 322, 330, 326, 333, 345, 338, 354]
                    data : [0, object[0].Pression]
                },]
            },
            options: {
                legend: {
                    display: false
                },

                tooltips: {
                    enabled: false
                },

                scales: {
                    yAxes: [{

                        ticks: {
                            fontColor: "#9f9f9f",
                            beginAtZero: false,
                            maxTicksLimit: 5,
                        },
                        gridLines: {
                            drawBorder: false,
                            zeroLineColor: "#ccc",
                            color: 'rgba(255,255,255,0.05)'
                        }

                    }],

                    xAxes: [{
                        barPercentage: 1.6,
                        gridLines: {
                            drawBorder: false,
                            color: 'rgba(255,255,255,0.1)',
                            zeroLineColor: "transparent",
                            display: false,
                        },
                        ticks: {
                            padding: 20,
                            fontColor: "#9f9f9f"
                        }
                    }]
                },
            }
        });
        this.chartpoub2 = new Chart(this.ctx2, {
            type: 'bar',

            data: {
                labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
                datasets: [{
                    borderColor: "#6bd098",
                    backgroundColor: "#6bd098",
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    borderWidth: 3,
                    //data: [300, 310, 316, 322, 330, 326, 333, 345, 338, 354]
                    data : [0, object[3].Pression]
                },]
            },
            options: {
                legend: {
                    display: false
                },

                tooltips: {
                    enabled: false
                },

                scales: {
                    yAxes: [{

                        ticks: {
                            fontColor: "#9f9f9f",
                            beginAtZero: false,
                            maxTicksLimit: 5,
                        },
                        gridLines: {
                            drawBorder: false,
                            zeroLineColor: "#ccc",
                            color: 'rgba(255,255,255,0.05)'
                        }

                    }],

                    xAxes: [{
                        barPercentage: 1.6,
                        gridLines: {
                            drawBorder: false,
                            color: 'rgba(255,255,255,0.1)',
                            zeroLineColor: "transparent",
                            display: false,
                        },
                        ticks: {
                            padding: 20,
                            fontColor: "#9f9f9f"
                        }
                    }]
                },
            }
        });
        this.chartpoub3 = new Chart(this.ctx3, {
            type: 'bar',

            data: {
                labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
                datasets: [{
                    borderColor: "#6bd098",
                    backgroundColor: "#6bd098",
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    borderWidth: 3,
                    //data: [300, 310, 316, 322, 330, 326, 333, 345, 338, 354]
                    data : [0, object[8].Pression]
                },]
            },
            options: {
                legend: {
                    display: false
                },

                tooltips: {
                    enabled: false
                },

                scales: {
                    yAxes: [{

                        ticks: {
                            fontColor: "#9f9f9f",
                            beginAtZero: false,
                            maxTicksLimit: 5,
                        },
                        gridLines: {
                            drawBorder: false,
                            zeroLineColor: "#ccc",
                            color: 'rgba(255,255,255,0.05)'
                        }

                    }],

                    xAxes: [{
                        barPercentage: 1.6,
                        gridLines: {
                            drawBorder: false,
                            color: 'rgba(255,255,255,0.1)',
                            zeroLineColor: "transparent",
                            display: false,
                        },
                        ticks: {
                            padding: 20,
                            fontColor: "#9f9f9f"
                        }
                    }]
                },
            }
        });
        this.chartpoub4 = new Chart(this.ctx4, {
            type: 'bar',

            data: {
                labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
                datasets: [{
                    borderColor: "#6bd098",
                    backgroundColor: "#6bd098",
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    borderWidth: 3,
                    //data: [300, 310, 316, 322, 330, 326, 333, 345, 338, 354]
                    data : [0, object[4].Pression]
                },]
            },
            options: {
                legend: {
                    display: false
                },

                tooltips: {
                    enabled: false
                },

                scales: {
                    yAxes: [{

                        ticks: {
                            fontColor: "#9f9f9f",
                            beginAtZero: false,
                            maxTicksLimit: 5,
                        },
                        gridLines: {
                            drawBorder: false,
                            zeroLineColor: "#ccc",
                            color: 'rgba(255,255,255,0.05)'
                        }

                    }],

                    xAxes: [{
                        barPercentage: 1.6,
                        gridLines: {
                            drawBorder: false,
                            color: 'rgba(255,255,255,0.1)',
                            zeroLineColor: "transparent",
                            display: false,
                        },
                        ticks: {
                            padding: 20,
                            fontColor: "#9f9f9f"
                        }
                    }]
                },
            }
        });
    }

}
