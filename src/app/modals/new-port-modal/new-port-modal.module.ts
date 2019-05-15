import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NewPortModalPage } from './new-port-modal.page';

const routes: Routes = [
  {
    path: 'new-port',
    outlet: 'modal',
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
  entryComponents: [NewPortModalPage]
})
export class NewPortModalPageModule {}
