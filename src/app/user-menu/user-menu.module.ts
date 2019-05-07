import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule, PreloadingStrategy } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserMenuPage } from './user-menu.page';
import { UserProfilePage } from '../user-profile/user-profile.page';
import { PortsPage } from '../ports/ports.page';
import { PortsNewPage } from '../ports/ports-new/ports-new.page';

import { AppRoutingPreloaderService } from '../app-routing-preloader.service';

import { PortsPageModule } from '../ports/ports.module';
import { UserProfilePageModule } from '../user-profile/user-profile.module';
import { DriversPageModule } from '../drivers/drivers.module';

const routes: Routes = [
  {
    path: '',
    component: UserMenuPage,
    children: [
      {
        path: 'user-profile',
        loadChildren: '../user-profile/user-profile.module#UserProfilePageModule'
      },
      {
        path: 'ports',
        loadChildren: '../ports/ports.module#PortsPageModule'
      },
      {
        path: 'drivers',
        loadChildren: '../drivers/drivers.module#DriversPageModule'
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PortsPageModule,
    DriversPageModule,
    UserProfilePageModule
  ],
  declarations: [
    UserMenuPage
  ],
  exports: [
    RouterModule
  ]
})
export class UserMenuPageModule {}
