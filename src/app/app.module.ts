import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';

import { AppRoutingPreloaderService } from './app-routing-preloader.service';
import { LapsService } from './laps/shared/laps.service';
import { PortsService } from './ports/shared/ports.service';
import { UnitsService } from './units/shared/units.service';
import { ImportersService } from './importers/shared/importers.service';
import { DriversService } from './drivers/shared/drivers.service';
import { ThirdsService } from './thirds/shared/thirds.service';
import { TrucksService } from './trucks/shared/trucks.service';
import { RampsService } from './ramps/shared/ramps.service';
import { DriverTruckRampAssociationsService } from './drivers/shared/driver-truck-ramp-associations.service';
import { Globals } from './globals';

import { UserProfilePageModule } from './user-profile/user-profile.module';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [AppComponent],
  imports: [BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    UserProfilePageModule,
    HttpClientModule],

  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SocialSharing,
    FileChooser,
    FilePath,
    FileOpener,
    File,
    AppRoutingPreloaderService,
    PortsService,
    LapsService,
    UnitsService,
    ImportersService,
    DriversService,
    ThirdsService,
    TrucksService,
    RampsService,
    DriverTruckRampAssociationsService,
    Globals
  ],

  bootstrap: [AppComponent]
})
export class AppModule {}
