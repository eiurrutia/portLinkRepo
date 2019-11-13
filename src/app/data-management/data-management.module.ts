import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DataManagementPage } from './data-management.page';

const routes: Routes = [
  {
    path: '',
    component: DataManagementPage
  },
  {
    path: 'drivers',
    loadChildren: '../drivers/drivers.module#DriversPageModule'
  },
  {
    path: 'thirds',
    loadChildren: '../thirds/thirds.module#ThirdsPageModule'
  },
  {
    path: 'trucks',
    loadChildren: '../trucks/trucks.module#TrucksPageModule'
  },
  {
    path: 'ramps',
    loadChildren: '../ramps/ramps.module#RampsPageModule'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DataManagementPage]
})
export class DataManagementPageModule {}
