import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NewPortModalPage } from './new-port-modal.page';

const routes: Routes = [
  {
    path: '',
    component: NewPortModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NewPortModalPage],
  exports: [NewPortModalPage]
})
export class NewPortModalPageModule {}
