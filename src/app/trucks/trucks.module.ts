import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TrucksPage } from './trucks.page';
import { TrucksAssociationPage } from './trucks-association/trucks-association.page';

const routes: Routes = [
  {
    path: '',
    component: TrucksAssociationPage
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
    TrucksPage,
    TrucksAssociationPage
  ]
})
export class TrucksPageModule {}
