import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'user-menu', loadChildren: './user-menu/user-menu.module#UserMenuPageModule' },
  // { path: 'user-profile', loadChildren: './user-profile/user-profile.module#UserProfilePageModule' },
  // { path: 'ports', loadChildren: './ports/ports.module#PortsPageModule' },
  // { path: 'ports-new', loadChildren: './ports-new/ports-new.module#PortsNewPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
