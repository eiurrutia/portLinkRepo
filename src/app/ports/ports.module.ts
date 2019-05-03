import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PortsPage } from './ports.page';
import { PortsNewPage } from './ports-new/ports-new.page';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'new-port',
        component: PortsNewPage,
        data: {preload: true}
      }
    ]
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
    PortsPage,
    PortsNewPage
  ],
  exports: [PortsPage]
})
export class PortsPageModule {}
