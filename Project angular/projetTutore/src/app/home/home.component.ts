import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  /*
  cards = [];
  cardsForHandset = [];
  cardsForWeb = [];

  lineChartData: ChartDataSets[] = [
    { data: [0], label: 'Crude oil prices' },
  ];

  lineChartLabels: Label[] = [];

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba( 143, 160, 231 )',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType: ChartType = 'line';

  
  isHandset: boolean = false;
  isHandsetObserver: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return true;
      }
      return false;
    })
  );

  constructor(private breakpointObserver: BreakpointObserver, public appService: AppService) {}

  ngOnInit(){
    this.isHandsetObserver.subscribe(currentObserverValue =>{
      this.isHandset = currentObserverValue;
      this.loadCards();
    });
    this.appService.getDeals().subscribe(
      response=>{
        this.cardsForHandset = response.handsetCards;
        this.cardsForWeb = response.webCards;
        for(let i = 0; i <= response.handsetCards.length; i++){
          this.lineChartData[0].data?.push(response.handsetCards[i].data);
          this.lineChartLabels.push(response.handsetCards[i].date);
        }
        //this.loadCards();
        
      },
      error =>{
        alert('Impossible de recevoir les données du serveur');

      }
    )
  }

  loadCards(){
    this.cards = this.isHandset ? this.cardsForHandset : this.cardsForWeb;
  }*/
}
