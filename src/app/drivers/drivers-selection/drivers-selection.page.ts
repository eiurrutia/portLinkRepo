import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { IonSlides, AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { PortsService } from '../../ports/shared/ports.service';
import { DriversService } from '../shared/drivers.service';
import { ThirdsService } from '../../thirds/shared/thirds.service';

@Component({
  selector: 'app-drivers-selection',
  templateUrl: './drivers-selection.page.html',
  styleUrls: ['./drivers-selection.page.scss'],
})
export class DriversSelectionPage implements OnInit {

  @ViewChild(IonSlides) slides: IonSlides;
  @Output() sendCount: EventEmitter <boolean> = new EventEmitter<boolean>();

  slideOpts = {
    initialSlide: 0,
    speed: 100,
    width: 375,
    height: 440
  };
  driversList: any;
  thirdsList: any;

  activeDriversDicc = {};
  accountantThirdsDicc = {};
  nameThirdsDicc = {};

  portId: string;
  currentPort: any;

  segment = 'drivers';
  firstMove = true;

  activeDriversCount = 0;
  activeThirdsCount = 0;

  portObjectToPatch = {};
  estimatedLapsByDriver = 0;

  constructor(private activatedRoute: ActivatedRoute,
              private alertController: AlertController,
              private navController: NavController,
              private portsService: PortsService,
              private driversService: DriversService,
              private thirdsService: ThirdsService) { }

  ngOnInit() {
    this.getBackInfo();
  }

  async getBackInfo() {
    this.portId = this.activatedRoute.snapshot.paramMap.get('id');
    await this.getPort(this.portId);
    await this.getDrivers();
    await this.getThirds();
  }

  segmentChanged(ev: any) {
    if (this.firstMove) {
      this.firstMove = false;
      if (ev.detail.value === 'thirds') {
        this.slides.slideNext();
      } else {this.slides.slidePrev(); }
    } else {this.firstMove = true; }
  }

  slideChanged(ev: any) {
    if (this.firstMove) {
      this.firstMove = false;
      this.changeSegment();
    } else {this.firstMove = true; }
  }

  changeSegment() {
    if (this.segment === 'drivers') {
      this.segment = 'thirds';
    } else { this.segment = 'drivers'; }
  }

  countActiveDrivers() {
    this.activeDriversCount = 0;
    for (const value of Object.values(this.activeDriversDicc)) {
      if (value) {this.activeDriversCount += 1; }
    }
    this.calculateEstimatedLapsByDriver();
  }

  countActiveThirds() {
    this.activeThirdsCount = 0;
    for (const value of Object.values(this.accountantThirdsDicc)) {
      if (value) { this.activeThirdsCount += Number(value); }
    }
    this.calculateEstimatedLapsByDriver();
  }

  changeNumber(third: string, num: number) {
    if (this.accountantThirdsDicc[third] + num >= 0) {
      this.accountantThirdsDicc[third] += num;
      this.nameThirdsDicc[third][this.accountantThirdsDicc[third]] = '';
    }
    this.countActiveThirds();
  }

  createArray(n: number): any[] {
    return Array(n);
  }

  checkAllWithName(): boolean {
    for (const third of Object.keys(this.accountantThirdsDicc)) {
      for (const value of Object.keys(this.nameThirdsDicc[third])) {
        if (value <= this.accountantThirdsDicc[third] &&
           this.accountantThirdsDicc[third] > 1 &&
           this.nameThirdsDicc[third][value] === '') {
          this.presentAlertDriversWithoutName();
          return false;
        }
      }
    }
    this.presentAlertConfirm();
    return true;
  }

  async presentAlertConfirm() {
    this.generateObjectToPatch();
    const alert = await this.alertController.create({
      header: 'Continuar',
      message: 'Quieres crear realizar este puerto con ' + (this.activeDriversCount +
          this.activeThirdsCount).toString() + ' conductores en total?' ,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.addListOfDriversAndThirdsToPort();
            this.sendCount.emit(true);
            this.navController.navigateRoot('/user-menu/ports');
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertDriversWithoutName() {
    const alert = await this.alertController.create({
      header: 'Nombres Faltantes',
      message: 'Faltan nombres por agregar al listado de terceros!',
      buttons: [
         {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  getDrivers(): void {
    this.driversService.getDrivers().subscribe(
      driversList => {
        this.driversList = driversList;
        this.generateActivableDriversDicc(this.driversList);
      },
      error => {
        console.log(`Error fetching drivers`);
      }
    );
  }

  generateActivableDriversDicc(driversList: any): void {
    for (const driver of driversList) { this.activeDriversDicc[driver._id] = false; }
    this.countActiveDrivers();
  }

  getThirds(): void {
    this.thirdsService.getThirds().subscribe(
      thirdsList => {
        this.thirdsList = thirdsList;
        this.generateAccountantThirdsDicc(thirdsList);
      },
      error => {
        console.log(`Error fetching thirds`);
      }
    );
  }

  generateAccountantThirdsDicc(thirdsList: any): void {
    for (const third of thirdsList) {
      this.accountantThirdsDicc[third._id] = 0;
      this.nameThirdsDicc[third._id] = {1: ''};
    }
    this.countActiveThirds();
  }

  generateConsideredDriversList() {
    this.portObjectToPatch['consideredDrivers'] = [];
    for (const driver of Object.keys(this.activeDriversDicc)) {
      if (this.activeDriversDicc[driver]) {this.portObjectToPatch['consideredDrivers'].push({'driverId': driver}); }
    }
  }

  generateConsideredThirdsList() {
    this.portObjectToPatch['consideredThirds'] = [];
    for (const third of Object.keys(this.accountantThirdsDicc)) {
      if (this.accountantThirdsDicc[third]) {
        if (this.accountantThirdsDicc[third] > 1) {
          for (let i = 1; i <= this.accountantThirdsDicc[third]; i++) {
            this.portObjectToPatch['consideredThirds'].push({'thirdId': third, 'nickName': this.nameThirdsDicc[third][i]});
          }
        } else {
          this.portObjectToPatch['consideredThirds'].push({'thirdId': third});
        }
      }
    }
  }

  async generateObjectToPatch() {
    this.portObjectToPatch = {};
    await this.generateConsideredDriversList();
    await this.generateConsideredThirdsList();
    this.portObjectToPatch['estimatedTrucks'] = this.activeDriversCount + this.activeThirdsCount;
    return this.portObjectToPatch;
  }

  getPort(portId: string) {
    this.portsService.getPort(portId).subscribe(
      port => {
        this.currentPort = port;
      },
      error => {
        console.log(`Error fetching current port`);
      }
    );
  }

  patchPort(portObjectToPatch: any): void {
    this.portsService.associateDriversToPort(this.portId, portObjectToPatch).subscribe(
      portPatched => {
        console.log('Port patched with drivers and thirds list.');
        console.log(portPatched);
      },
      error => {
        console.log(`Error patching port.`);
      }
    );
  }

  async addListOfDriversAndThirdsToPort() {
    await this.generateObjectToPatch();
    await this.patchPort(this.portObjectToPatch);
  }

  calculateEstimatedLapsByDriver() {
    if (this.activeDriversCount + this.activeThirdsCount > 0) {
      this.estimatedLapsByDriver = parseFloat((+this.currentPort['estimatedLaps'] /
        (this.activeDriversCount + this.activeThirdsCount)).toFixed(1));
    } else {
      this.estimatedLapsByDriver = 0;
    }
  }

}
