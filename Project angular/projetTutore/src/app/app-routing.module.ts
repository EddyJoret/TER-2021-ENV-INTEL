import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Capteur1Component } from './capteur1/capteur1.component';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';

const routes: Routes = [
  //{path:'**', redirectTo:'/home'},
  {path: 'home', component:HomeComponent},
  {path: 'capt1', component:Capteur1Component},
  {path: 'map', component:MapComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
