import { Component, ViewChild, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';
import { ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-capteur1',
  templateUrl: './capteur1.component.html',
  styleUrls: ['./capteur1.component.css']
})
export class Capteur1Component implements OnInit {

  /** Based on the screen size, switch from standard to one column per row */
  /*cards = [];
  cardsForHandset = [];
  cardsForWeb = [];

  lineChartData: ChartDataSets[] = [
    { data: [0], label: 'Humidité dans le sol' },
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
          console.log(response.handsetCards);
          this.lineChartData[0].data?.push(response.handsetCards[i].Pression);
          //this.lineChartLabels.push(response.handsetCards[i].date);
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

  ngOnInit(){}

}
