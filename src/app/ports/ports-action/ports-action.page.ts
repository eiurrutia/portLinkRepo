import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { PortsService } from '../shared/ports.service';
import { LapsService } from '../../laps/shared/laps.service';
import { DriversService } from '../../drivers/shared/drivers.service';
import { ThirdsService } from '../../thirds/shared/thirds.service';
import { UnitsService } from '../../units/shared/units.service';


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

  buildPackingListHeaders() {
    this.packingListHeaders = Object.keys(this.unitsList[0]);
    const index = this.packingListHeaders.indexOf('vin', 0);
    if (index > -1) {
      this.packingListHeaders.splice(index, 1);
    }
    console.log(this.packingListHeaders);
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
          this.currentLap = result.data[0];
          console.log('se obtuvo la current lap. Esta es');
          console.log(this.currentLap);
        } else {this.currentLap = null; }
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
        this.buildPackingListHeaders();
      },
      error => {
        console.log(`Error fetching units by port: ${error}.`);
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
