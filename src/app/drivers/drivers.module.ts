import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DriversPage } from './drivers.page';
import { DriversSelectionPage } from './drivers-selection/drivers-selection.page';

const routes: Routes = [
  {
    path: '',
    component: DriversPage
  },
  {
    path: 'drivers-selection',
    component: DriversSelectionPage
  },
  {
    path: 'drivers-selection/modify',
    component: DriversSelectionPage
  },
  {
    path: 'trucks',
    loadChildren: '../trucks/trucks.module#TrucksPageModule'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    DriversPage,
    DriversSelectionPage
  ],
  exports: [DriversPage]
})
export class DriversPageModule {}
