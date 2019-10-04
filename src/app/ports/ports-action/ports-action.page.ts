import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { PortsService } from '../shared/ports.service';
import { LapsService } from '../../laps/shared/laps.service';
import { DriversService } from '../../drivers/shared/drivers.service';
import { ThirdsService } from '../../thirds/shared/thirds.service';
import { UnitsService } from '../../units/shared/units.service';

import * as moment from 'moment-timezone';


@Component({
  selector: 'app-ports-action',
  templateUrl: './ports-action.page.html',
  styleUrls: ['./ports-action.page.scss'],
})
export class PortsActionPage implements OnInit {
  portsArray: any;
  portId = null;
  currentPort: any;
  unitsList: any;
  unitsDiccByVin: any;
  vinToRegister: any;

  correctVin = 1; // Variable to define state of vin input. 0 --> invalid vin. 1 --> writing. 2 --> valid vin.
  unitFound = {}; // Empty dicc when there is no unit selected.
  lapAssociatedToUnitFound = {};
  lastLoadText: string;

  correctSlectedDriver = false;
  lastSelectedDriver: string;
  lastSelectedDriverObject: any;

  selectedDriver: string;
  selectedDriverObject: any;
  searchBarActive = false;

  currentLap: any;

  activeDriversAndThirdsList = [];
  namesArray = [];
  driversFiltered = [];

  buttonTabActiveDicc = {
                        'barcode': true,
                        'resume': false,
                        'packing': false,
                        'share': false
                        };

  packingListExample = [
                        {
                          'vin': 'CDGSJVXL1324',
                          'modelo': 'Yaris SD',
                          'color': 'azul',
                          'tamano': 'pequeño',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:04'
                        },
                        {
                          'vin': 'CDGSJVXL1365',
                          'modelo': '4Runner SD',
                          'color': 'amarillo',
                          'tamano': 'grande',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:08'
                        },
                        {
                          'vin': 'CDGSJVXL1324',
                          'modelo': 'Yaris SD',
                          'color': 'azul',
                          'tamano': 'pequeño',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:04'
                        },
                        {
                          'vin': 'CDGSJVXL1365',
                          'modelo': '4Runner SD',
                          'color': 'amarillo',
                          'tamano': 'grande',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:08'
                        },
                        {
                          'vin': 'CDGSJVXL1324',
                          'modelo': 'Yaris SD',
                          'color': 'azul',
                          'tamano': 'pequeño',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:04'
                        },
                        {
                          'vin': 'CDGSJVXL1365',
                          'modelo': '4Runner SD',
                          'color': 'amarillo',
                          'tamano': 'grande',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:08'
                        },
                        {
                          'vin': 'CDGSJVXL1324',
                          'modelo': 'Yaris SD',
                          'color': 'azul',
                          'tamano': 'pequeño',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:04'
                        },
                        {
                          'vin': 'CDGSJVXL1365',
                          'modelo': '4Runner SD',
                          'color': 'amarillo',
                          'tamano': 'grande',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:08'
                        },
                        {
                          'vin': 'CDGSJVXL1324',
                          'modelo': 'Yaris SD',
                          'color': 'azul',
                          'tamano': 'pequeño',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:04'
                        },
                        {
                          'vin': 'CDGSJVXL1365',
                          'modelo': '4Runner SD',
                          'color': 'amarillo',
                          'tamano': 'grande',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:08'
                        },
                        {
                          'vin': 'CDGSJVXL1324',
                          'modelo': 'Yaris SD',
                          'color': 'azul',
                          'tamano': 'pequeño',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:04'
                        },
                        {
                          'vin': 'CDGSJVXL1365',
                          'modelo': '4Runner SD',
                          'color': 'amarillo',
                          'tamano': 'grande',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:08'
                        },
                        {
                          'vin': 'CDGSJVXL1324',
                          'modelo': 'Yaris SD',
                          'color': 'azul',
                          'tamano': 'pequeño',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:04'
                        },
                        {
                          'vin': 'CDGSJVXL1365',
                          'modelo': '4Runner SD',
                          'color': 'amarillo',
                          'tamano': 'grande',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:08'
                        },
                        {
                          'vin': 'CDGSJVXL1324',
                          'modelo': 'Yaris SD',
                          'color': 'azul',
                          'tamano': 'pequeño',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:04'
                        },
                        {
                          'vin': 'CDGSJVXL1365',
                          'modelo': '4Runner SD',
                          'color': 'amarillo',
                          'tamano': 'grande',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:08'
                        },
                        {
                          'vin': 'CDGSJVXL1324',
                          'modelo': 'Yaris SD',
                          'color': 'azul',
                          'tamano': 'pequeño',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:04'
                        },
                        {
                          'vin': 'CDGSJVXL1365',
                          'modelo': '4Runner SD',
                          'color': 'amarillo',
                          'tamano': 'grande',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:08'
                        },
                        {
                          'vin': 'CDGSJVXL1324',
                          'modelo': 'Yaris SD',
                          'color': 'azul',
                          'tamano': 'pequeño',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:04'
                        },
                        {
                          'vin': 'CDGSJVXL1365',
                          'modelo': '4Runner SD',
                          'color': 'amarillo',
                          'tamano': 'grande',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:08'
                        },
                        {
                          'vin': 'CDGSJVXL1324',
                          'modelo': 'Yaris SD',
                          'color': 'azul',
                          'tamano': 'pequeño',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:04'
                        },
                        {
                          'vin': 'CDGSJVXL1365',
                          'modelo': '4Runner SD',
                          'color': 'amarillo',
                          'tamano': 'grande',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:08'
                        },
                        {
                          'vin': 'CDGSJVXL1324',
                          'modelo': 'Yaris SD',
                          'color': 'azul',
                          'tamano': 'pequeño',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:04'
                        },
                        {
                          'vin': 'CDGSJVXL1365',
                          'modelo': '4Runner SD',
                          'color': 'amarillo',
                          'tamano': 'grande',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:08'
                        },
                        {
                          'vin': 'CDGSJVXL1324',
                          'modelo': 'Yaris SD',
                          'color': 'azul',
                          'tamano': 'pequeño',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:04'
                        },
                        {
                          'vin': 'CDGSJVXL1365',
                          'modelo': '4Runner SD',
                          'color': 'amarillo',
                          'tamano': 'grande',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:08'
                        },
                        {
                          'vin': 'CDGSJVXL1324',
                          'modelo': 'Yaris SD',
                          'color': 'azul',
                          'tamano': 'pequeño',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:04'
                        },
                        {
                          'vin': 'CDGSJVXL1365',
                          'modelo': '4Runner SD',
                          'color': 'amarillo',
                          'tamano': 'grande',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:08'
                        },
                        {
                          'vin': 'CDGSJVXL1324',
                          'modelo': 'Yaris SD',
                          'color': 'azul',
                          'tamano': 'pequeño',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:04'
                        },
                        {
                          'vin': 'CDGSJVXL1365',
                          'modelo': '4Runner SD',
                          'color': 'amarillo',
                          'tamano': 'grande',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:08'
                        },
                        {
                          'vin': 'CDGSJVXL1324',
                          'modelo': 'Yaris SD',
                          'color': 'azul',
                          'tamano': 'pequeño',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:04'
                        },
                        {
                          'vin': 'CDGSJVXL1365',
                          'modelo': '4Runner SD',
                          'color': 'amarillo',
                          'tamano': 'grande',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:08'
                        },
                        {
                          'vin': 'CDGSJVXL1324',
                          'modelo': 'Yaris SD',
                          'color': 'azul',
                          'tamano': 'pequeño',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:04'
                        },
                        {
                          'vin': 'CDGSJVXL1365',
                          'modelo': '4Runner SD',
                          'color': 'amarillo',
                          'tamano': 'grande',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:08'
                        },
                        {
                          'vin': 'CDGSJVXL1324',
                          'modelo': 'Yaris SD',
                          'color': 'azul',
                          'tamano': 'pequeño',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:04'
                        },
                        {
                          'vin': 'CDGSJVXL1365',
                          'modelo': '4Runner SD',
                          'color': 'amarillo',
                          'tamano': 'grande',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:08'
                        },
                        {
                          'vin': 'CDGSJVXL1324',
                          'modelo': 'Yaris SD',
                          'color': 'azul',
                          'tamano': 'pequeño',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:04'
                        },
                        {
                          'vin': 'CDGSJVXL1365',
                          'modelo': '4Runner SD',
                          'color': 'amarillo',
                          'tamano': 'grande',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:08'
                        },
                        {
                          'vin': '222222222222222',
                          'modelo': 'Yaris SD',
                          'color': 'azul',
                          'tamano': 'pequeño',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:04'
                        },
                        {
                          'vin': '111111111111111',
                          'modelo': '4Runner SD',
                          'color': 'amarillo',
                          'tamano': 'grande',
                          'conductor': 'Miguel Vargas',
                          'vuelta': 3,
                          'Fecha': '12/05/2019',
                          'Hora': '22:08'
                        }
                        ];
  packingListHeaders: any;
  packingListHeadersWithoutVin: any;

  wordSearchedInPacking: string;

  constructor(private activatedRoute: ActivatedRoute,
              private alertController: AlertController,
              private portsService: PortsService,
              private lapsService: LapsService,
              private driversService: DriversService,
              private thirdsService: ThirdsService,
              private unitsService: UnitsService) { }

  ngOnInit() {
    this.portId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getPort(this.portId);
    this.driversFiltered = this.activeDriversAndThirdsList;
  }

  // First we check in the local array if exist that vin. Then we get from the backend.
  searchUnit() {
    if (this.vinToRegister.length > this.currentPort.digitsToConsider) {
      // Firs we check if the last digits are equals.
      if (this.unitsDiccByVin[this.vinToRegister.substring(this.vinToRegister.length - this.currentPort.digitsToConsider)]) {
        // Then we check if part of short-vin is inside of model complete-vin.
        if (this.unitsDiccByVin[
          this.vinToRegister.substring(
            this.vinToRegister.length - this.currentPort.digitsToConsider)]
          .vin.includes(this.vinToRegister)) {
            console.log('se encontró la unidad 1');
            this.correctVin = 2;
            this.getUnitById(this.unitsDiccByVin[this.vinToRegister.substring(
              this.vinToRegister.length - this.currentPort.digitsToConsider)]._id);
          } else {
            console.log('unidad no encontrada que conincida con todos caractéres que se incluyen.');
            this.unitFound = {};
            this.correctVin = 0;
          }
      } else { console.log('unidad no encontrada 1');
               this.unitFound = {};
               this.correctVin = 0;
      }
    } else {
      if (this.unitsDiccByVin[this.vinToRegister]) {
        this.correctVin = 2;
        console.log('se encontró la unidad 2');
        this.getUnitById(this.unitsDiccByVin[this.vinToRegister]._id);
      } else { console.log('unidad no encontrada 2');
               this.unitFound = {};
               this.correctVin = 0;
      }
    }
  }


  // Depends the moment keyup has differents functions.
  registerOrSearchUnit() {
    // Case when we are searching for first time.
    if (this.correctVin !== 2) {
      this.searchUnit();
    // We found a vin a we want to register.
    // But enter keyup only works if vin isn't already registered.
    // We make sure with unitFound['model'] that could get unit from backend.
  } else if (this.unitFound['model'] && !this.unitFound['lapAssociated']) {
      console.log('Unidad registrada!');
    } else {
      // Do nothing in other case (we have a registered unit but we want user press the button manually).
      console.log('se intenta re registrar una undiad. aprieta el botón.');
    }
  }

  registerUnit(unit: any) {
    // Firs we check if we have to create a new lap
    // or only we have to add the unit to the currente lap.
  }

  createNewLap() {

  }


  async createNewLapAlert(numberOfLap: number = 1) {
    const alert = await this.alertController.create({
      header: 'Nueva Vuelta',
      subHeader: `Deseas crear la vuelta número ${numberOfLap} para el conductor ${this.selectedDriver}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            if (numberOfLap === 1) {
              this.correctSlectedDriver = false;
              this.selectedDriver = null;
              this.selectedDriverObject = null;
              this.lastSelectedDriver = null;
              this.lastSelectedDriverObject = null;
            }
          }
        }, {
          text: 'Aceptar',
          handler: () => {
          }
        }
      ]
    });
    await alert.present();
  }


  checkHourDifferenceToNewLap(lastLap: any): boolean {
    const a = moment.tz(lastLap.lastLoad, 'America/Santiago');
    const b = moment.tz(Date.now(), 'America/Santiago');
    const diff = b.diff(a, 'hours', true);
    // And then we check if it has been more than 3 hours.
    if (diff >= 3) { return true; }
    return false;
  }




  getCleanDate(date: Date, format: string): string {
    return moment.tz(date, 'America/Santiago').format(format);
  }

  getDateDifference(date1: any, date2: any): string {
    const a = moment.tz(date1, 'America/Santiago');
    const b = moment.tz(date2, 'America/Santiago');
    const diff = b.diff(a, 'hours', true);
    const hours = Math.floor(diff);
    const minutes =  Math.floor(((diff % 1) * 60));
    let stringToReturn = '';
    if (hours > 0) {stringToReturn += `${hours} hora(s)`; }
    if (hours > 0 && minutes > 0) {stringToReturn += ' y '; }
    stringToReturn += `${minutes} minuto(s)`;
    return stringToReturn;
  }

  probar2() {
    console.log('peo 2');
    console.log(this.vinToRegister);
  }

  buildUnitsDiccByVin(unitsList: any) {
    this.unitsDiccByVin = {};
    unitsList.map( unit => {
      const newVin = unit.vin.substring(unit.vin.length - this.currentPort.digitsToConsider);
      this.unitsDiccByVin[newVin] = unit;
    });
    console.log('unitsDiccByVin');
    console.log(this.unitsDiccByVin);
  }

  buildPackingListHeaders() {
    this.packingListHeaders = Object.keys(this.unitsList[0]);
    const index = this.packingListHeaders.indexOf('vin', 0);
    if (index > -1) {
      this.packingListHeaders.splice(index, 1);
    }
  }

  selectItem(driver: any) {
    this.selectedDriver = driver.nick;
    this.selectedDriverObject = driver;
    this.searchBarActive = false;
  }

  filterWithSearch(toSearch: any) {
    if (!toSearch) {this.driversFiltered = this.activeDriversAndThirdsList;
    } else { this.driversFiltered = this.activeDriversAndThirdsList.filter((driver) => {
      return driver.nick.toLocaleLowerCase().includes(toSearch.toLocaleLowerCase());
      });
    }

    if (this.namesArray.includes(this.selectedDriver)) {
      this.correctSlectedDriver = true;
      if (!this.lastSelectedDriverObject) {
        this.lastSelectedDriver = this.selectedDriver;
        this.lastSelectedDriverObject = this.selectedDriverObject;
        this.getDriverInfoAboutHisLaps(this.selectedDriverObject._id, this.portId);
      } else if (this.lastSelectedDriver !== this.selectedDriver) {
        this.changeDriver();
      }
    } else { this.correctSlectedDriver = false; }
  }

  async changeDriver() {
    const alert = await this.alertController.create({
      header: 'Cambiar Conductor',
      subHeader: 'Deseas cambiar al conductor a registrar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.selectedDriver = this.lastSelectedDriver;
            this.selectedDriverObject = this.lastSelectedDriverObject;
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.lastSelectedDriver = this.selectedDriver;
            this.lastSelectedDriverObject = this.selectedDriverObject;
            this.getDriverInfoAboutHisLaps(this.selectedDriverObject._id, this.portId);
          }
        }
      ]
    });
    await alert.present();
  }

  getDriverInfoAboutHisLaps(driverId: string, portId: string) {
    this.lapsService.getLapsByDriverAndPortOrderByRelativeNumber(driverId, portId).subscribe(
      result => {
        if (result.total) {
          //  MAS TARDE FILTAR LAS DIFERENCIAS DE HORAS CON LA ACTUAL PARA VER SI EFECTIVAMENTE ES LA VUELTA ACTUAL
          this.currentLap = result.data[0];
          this.lastLoadText = this.getDateDifference(this.currentLap.lastLoad, Date.now());
          console.log('se obtuvo la current lap. Esta es');
          console.log(this.currentLap);
          if (this.checkHourDifferenceToNewLap(this.currentLap)) {
            this.createNewLapAlert(this.currentLap.relativeNumber + 1);
          }
        } else {
          this.currentLap = null;
          this.createNewLapAlert(); // First lap.
        }
      },
      error => {
        console.log('Error getting the driver laps: ', error);
      }
    );
  }


  getDriverInfo() {

  }

  changeTabButton(nameButton: string) {
    for (const button of Object.keys(this.buttonTabActiveDicc)) {
      this.buttonTabActiveDicc[button] = false;
    }
    this.buttonTabActiveDicc[nameButton] = true;
  }

  searchInPacking() {
    const vinArray = this.packingListExample.filter(
      movement => movement.vin.toLocaleLowerCase().includes(this.wordSearchedInPacking.toLocaleLowerCase()));
    const modelArray = this.packingListExample.filter(
      movement => movement.modelo.toLocaleLowerCase().includes(this.wordSearchedInPacking.toLocaleLowerCase()));
    const driverArray = this.packingListExample.filter(
      movement => movement.conductor.toLocaleLowerCase().includes(this.wordSearchedInPacking.toLocaleLowerCase()));
    const sizeArray = this.packingListExample.filter(
      movement => movement.tamano.toLocaleLowerCase().includes(this.wordSearchedInPacking.toLocaleLowerCase()));

    console.log(vinArray);
    console.log(modelArray);
    console.log(driverArray);
    console.log(sizeArray);
  }


  getPort(portId: string): void {
    this.portsService.getPort(portId).subscribe(
      currentPort => {
        this.currentPort = currentPort;
        this.getCurrentPortUnits(currentPort._id);
        this.generateDriversAndThirdsArray(currentPort);
      },
      error => {
        console.log(`Error fetching port: ${error}.`);
      }
    );
  }

  getCurrentPortUnits(portId: string): void {
    this.unitsService.getUnitsByPort(portId).subscribe(
      unitsList => {
        this.unitsList = unitsList.data;
        this.buildUnitsDiccByVin(this.unitsList);
        this.buildPackingListHeaders();
      },
      error => {
        console.log(`Error fetching units by port: ${error}.`);
      }
    );
  }

  getUnitById(unitId: string) {
    this.unitsService.getUnitById(unitId).subscribe(
      unit => {
        this.unitFound = unit;

        // And if It has already been registered we get his lap lapAssociated and driver.
        if (this.unitFound['lapAssociated']) {
          this.lapsService.getLap(this.unitFound['lapAssociated']).subscribe(
            lap => {
              this.unitFound['lapAssociated'] = lap;
              this.driversService.getDriver(lap.driver).subscribe(
                driver => {
                  this.unitFound['lapAssociated']['driver'] = driver;
                },
                driverError => {
                  console.log('Error getting driver to lap: ', driverError);
                }
              );
            },
            error => {
              console.log('Error getting lap to unit found: ', error);
            }
          );
        }

        console.log(this.unitFound);
      },
      error => {
        console.log(`Error getting unit: ${unitId} E:${error}.`);
      }
    );
  }

  generateDriversAndThirdsArray(currentPort: any) {
    // We build drivers array
    currentPort.consideredDrivers.map( driver => {
      this.driversService.getDriver(driver.driverId).subscribe(
        backDriver => {
          this.activeDriversAndThirdsList.push({'_id': backDriver._id, 'nick': backDriver.name, 'third': false});
          this.namesArray.push(backDriver.name);
        },
        error => {
          console.log('Error getting driver: ', error);
        }
      );
    });

    // We build thirds array
    currentPort.consideredThirds.map( third => {
      this.thirdsService.getThird(third.thirdId).subscribe(
        backThird => {
          if (third.nickName) {
            this.activeDriversAndThirdsList.push({'_id': backThird._id,
                                                  'nick': backThird.name + ' - ' + third.nickName,
                                                  'third': true});
            this.namesArray.push(backThird.name + ' - ' + third.nickName);
          } else {
            this.activeDriversAndThirdsList.push({'_id': backThird._id,
                                                  'nick': backThird.name,
                                                  'third': true});
            this.namesArray.push(backThird.name);
          }
        },
        error => {
          console.log('Error getting third: ', error);
        }
      );
    });
  }



}
