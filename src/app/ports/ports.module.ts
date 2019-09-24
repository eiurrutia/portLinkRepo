import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { NewPortModalPageModule } from '../modals/new-port-modal/new-port-modal.module';
import { DriversPageModule } from '../drivers/drivers.module';

import { PortsPage } from './ports.page';
import { PortsNewPage } from './ports-new/ports-new.page';
import { PortsActionPage } from './ports-action/ports-action.page';
import { NewPortModalPage } from '../modals/new-port-modal/new-port-modal.page';


const routes: Routes = [
  {
    path: '',
    component: PortsPage
  },
  {
    path: 'new-port',
    component: PortsNewPage,
    data: {preload: true}
  },
  {
    path: 'action/:id',
    component: PortsActionPage,
    data: {preload: true}
  },
  {
    path: ':id/drivers',
    loadChildren: '../drivers/drivers.module#DriversPageModule'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NewPortModalPageModule,
    DriversPageModule
  ],
  declarations: [
    PortsPage,
    PortsNewPage,
    PortsActionPage
  ],
  exports: [PortsPage,
            PortsNewPage,
            PortsActionPage]
})
export class PortsPageModule {}
