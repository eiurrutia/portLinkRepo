import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserMenuPage } from './user-menu.page';
import { UserProfilePage } from '../user-profile/user-profile.page';

const routes: Routes = [
  {
    path: '',
    component: UserMenuPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserMenuPage,
                UserProfilePage]
})
export class UserMenuPageModule {}
