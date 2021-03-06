import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {AppRoutingPreloaderService } from './app-routing-preloader.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  {
    path: 'user-menu',
    loadChildren: './user-menu/user-menu.module#UserMenuPageModule',
    data: {preload: true}
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: AppRoutingPreloaderService}),
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
