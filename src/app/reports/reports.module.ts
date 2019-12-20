import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReportsPage } from './reports.page';
import { ReportPage } from './report/report.page';

const routes: Routes = [
  {
    path: '',
    component: ReportsPage
  },
  {
    path: ':id',
    component: ReportPage
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
    ReportsPage,
    ReportPage
  ],
  exports: [
    ReportsPage,
    ReportPage
  ]
})
export class ReportsPageModule {}
