import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserMenuPage } from './user-menu.page';


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
        path: 'data-management',
        loadChildren: '../data-management/data-management.module#DataManagementPageModule'
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
  ],
  declarations: [
    UserMenuPage
  ],
  exports: [
    RouterModule
  ]
})
export class UserMenuPageModule {}
