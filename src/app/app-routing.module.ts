import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DahsboardsComponent } from './components/dahsboards/dahsboards.component';
import { MonitoreoEquiposComponent } from './components/dahsboards/monitoreo-equipos/monitoreo-equipos.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaquinariaMonitoreoComponent } from './components/shared/maquinaria-monitoreo/maquinaria-monitoreo.component';
import { ModeldataComponent } from './components/shared/modeldata/modeldata.component';
import { DashboardDataExportComponent } from './components/shared/dashboard-data-export/dashboard-data-export.component';


const routes: Routes = [

  { path: 'login',     component: LoginComponent },
  { path: 'dashboard', component:  DahsboardsComponent},
  { path: 'moneq',     component:  MaquinariaMonitoreoComponent},
  { path: 'datexport', component:  DashboardDataExportComponent},
  { path: '**', pathMatch: 'full', redirectTo: 'login' }

];

@NgModule({
  imports: [ CommonModule, RouterModule.forRoot(routes)],
  exports: [ RouterModule]
})
export class AppRoutingModule { }
