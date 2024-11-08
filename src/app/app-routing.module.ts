import { DashboardDataExportComponent } from './components/shared/dashboard-data-export/dashboard-data-export.component';
import { MaquinariaMonitoreoComponent } from './components/shared/maquinaria-monitoreo/maquinaria-monitoreo.component';
import { DahsboardsComponent } from './components/dahsboards/dahsboards.component';
import { LoginComponent } from './components/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

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
