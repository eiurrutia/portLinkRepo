import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';

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
  recentRegistered = false; // To know if shown unit was recent registered.
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
              private navController: NavController,
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


  // Set search drvier var active and delete search vin bar to start with field empty.
  setSearhBarActive() {
    this.searchBarActive = true;
    this.vinToRegister = '';
    this.unitFound = {};
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
      this.registerUnit(this.unitFound);
      this.recentRegistered = true;
      this.registerUnitAlert();
    } else {
      // Do nothing in other case (we have a registered unit but we want user press the button manually).
      console.log('se intenta re registrar una undiad. aprieta el botón.');
    }
  }


  // Register unit in lap and update unit object in backend.
  registerUnit(unit: any) {
    // Update lap in backend.
    const lapObject = {};
    lapObject['load'] = Object.assign([], this.currentLap.load);
    lapObject['load'].push( {'unit': unit._id, 'loadedDate': Date.now()} );
    lapObject['lastLoad'] = Date.now();
    this.lapsService.updateLapLoad(this.currentLap._id, lapObject).subscribe(
      lap => {
        console.log('Lap actualizada con carga.');
        console.log(lap);
        this.currentLap = lap;
        this.lastLoadText = this.getDateDifference(lap.lastLoad, Date.now());
      },
      error => {
        console.log('Error cargando unidad a vuelta: ', error);
      }
    );

    // Update unit in backend.
    const unitObject = {};
    unitObject['lapAssociated'] = this.currentLap._id;
    unitObject['loadedDate'] = Date.now();
    unitObject['loaded'] = true;
    this.unitsService.updateUnit(unit._id, unitObject).subscribe(
      unitUpdated => {
        console.log('Unidad cargada actualizada.');
        console.log(unitUpdated);
        // We call get unit to update front variables (unitFound).
        this.getUnitById(unitUpdated._id);
        this.updateCountsToPort(unitUpdated);
      },
      error => {
        console.log('Error actualizando unidad cargada: ', error);
      }
    );
  }


  // Alert to reentry a unit.
  async registerUnitAlert() {
    const alert = await this.alertController.create({
      header: 'Unidad Registrada',
      subHeader: `Se registró la unidad ${this.unitFound['vin']}!`,
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {}
        }
      ]
    });
    await alert.present();
  }


  // To reentry a registered unit. Doen't recieve any params because unitFound has the info.
  reentryUnit() {
    console.log('this.unitFound');
    console.log(this.unitFound);
    this.recentRegistered = true;

    // ## Update a old lap removing the unit from list  ## //
    const oldLapObject = {};
    // unitFound has already the lapAssociated object.
    let newLoadedUnitsArray = [];
    newLoadedUnitsArray = Object.assign([], this.unitFound['lapAssociated']['load']);
    // If is empty, we set last load null and we set a empty array.
    if (newLoadedUnitsArray.length === 1) {
      oldLapObject['load'] = [];
      oldLapObject['lastLoad'] = null;
    } else {
      // We remove the unit from list.
      let indexToRemove = -1;
      for (let i = 0; i < newLoadedUnitsArray.length; i++) {
        if (newLoadedUnitsArray[i]['unit'] === this.unitFound['_id']) { indexToRemove = i; }
      }
      if (indexToRemove !== -1 ) {newLoadedUnitsArray.splice(indexToRemove, 1); }
      // And then We get the most currently charged unit and set the lastLoad.
      const mostCurrentlyUnit = this.getLastLoadedUnitFromList(newLoadedUnitsArray);
      oldLapObject['lastLoad'] = mostCurrentlyUnit['loadedDate'];
      oldLapObject['load'] = Object.assign([], newLoadedUnitsArray);
    }
    // And then we update the object in backend.
    this.lapsService.updateLapLoad(this.unitFound['lapAssociated']['_id'], oldLapObject).subscribe(
      newOldLap => {
        console.log('Lap updated when the unit deleted: ', newOldLap._id);
        console.log(newOldLap);
      },
      error => {
        console.log('Error updating the lap when a unit was reentry: ', error);
      }
    );


    // ## Update the unit in backend with new lapAssociated id ## //
    const reentryUnitObject = {};
    reentryUnitObject['lapAssociated'] = this.currentLap['_id'];
    reentryUnitObject['loadedDate'] = Date.now();
    this.unitsService.updateUnit(this.unitFound['_id'], reentryUnitObject).subscribe(
      reentryUnitUpdated => {
        console.log('Reentried unit unit updated in backend');
        console.log(reentryUnitUpdated);
        // We call get unit to update front variables (unitFound).
        this.getUnitById(reentryUnitUpdated._id);
        this.updateCountsToPort(reentryUnitUpdated);
      },
      error => {
        console.log('Error actualizando unidad cargada: ', error);
      }
    );


    // ## Update the current Lap with the new unit ## //
    const currentLapObject = {};
    currentLapObject['load'] = Object.assign([], this.currentLap['load']);
    currentLapObject['load'].push({'unit': this.unitFound['_id'], 'loadedDate': Date.now()});
    currentLapObject['lastLoad'] = Date.now();
    // And then we update the object in backend.
    this.lapsService.updateLapLoad(this.currentLap['_id'], currentLapObject).subscribe(
      newCurrentLap => {
        console.log('Lap updated when the reentried unit: ', newCurrentLap._id);
        console.log(newCurrentLap);
        this.currentLap = newCurrentLap;
        this.lastLoadText = this.getDateDifference(newCurrentLap.lastLoad, Date.now());
      },
      error => {
        console.log('Error updating the current lap when a unit was reentry: ', error);
      }
    );
  }


  // Alert to reentry a unit.
  async reentryUnitAlert() {
    const alert = await this.alertController.create({
      header: 'Reingresar Unidad',
      subHeader: `Deseas registrar la unidad ${this.unitFound['vin']} para el conductor ${this.selectedDriver}
        y descartar el registro anterior?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Aceptar',
          handler: () => {this.reentryUnit(); }
        }
      ]
    });
    await alert.present();
  }


  // Get the last loaded unit object from lap list.
  getLastLoadedUnitFromList(array: any): any {
    let maxDateUnit = array[0];
    for (let i = 0; i < array.length; i++) {
      if (moment(array[i]['loadedDate']).isAfter(maxDateUnit['loadedDate'])) {maxDateUnit = array[i]; }
    }
    return maxDateUnit;
  }


  // Update general port counts.
  updateCountsToPort(unit: any) {
    // First we get the total of collected units.
    this.unitsService.getLoadedUnitsByPort(this.portId).subscribe(
      result => {
        const portObject = {};
        portObject['collectedUnits'] = Object.assign({}, this.currentPort['collectedUnits']);
        portObject['modelsCountDicc'] = Object.assign({}, this.currentPort['modelsCountDicc']);
        portObject['collectedUnits']['totalQuantity'] = result.total;
        // Then we get the collected units by size.
        this.unitsService.getLoadedUnitsByPortAndSize(this.portId, unit.size).subscribe(
          getBySizeResult => {
            portObject['collectedUnits'][this.getSizeCountAttribute(unit.size)] = getBySizeResult.total;
            // Then we get the collected units by model.
            this.unitsService.getLoadedUnitsByPortAndModel(this.portId, unit.model).subscribe(
              getByModelResult => {
                portObject['modelsCountDicc']['collected'][unit.model] = getByModelResult.total;
                // And then we update port with the new info (object).
                this.portsService.updatePort(this.portId, portObject).subscribe(
                  port => {
                    console.log('Cuenta puerto actualizada.');
                    console.log(port);
                    this.currentPort = port;
                  },
                  error => {
                    console.log('Error updating port count: ', error);
                  }
                );
              },
              error => {
                console.log('Error getting by port and model: ', error);
              }
            );
          },
          error => {
            console.log('Error getting by port and size: ', error);
          }
        );
      },
      error => {
        console.log('Error getting unidades cargadas para este puerto: ', error);
      }
    );
  }


  // Clean the size to modify counts diccs by size.
  getSizeCountAttribute(size: string) {
    if (size === 'pequeno') { return 'smallQuantity';
    } else if (size === 'mediano') { return 'mediumQuantity';
    } else if (size === 'grande') { return 'bigQuantity';
    } else { return 'extraQuantity'; }
  }


  // Create a new lap sending object to backend.
  createNewLap(driverId: string, portId: string, isThird: boolean, relativeNumber: number) {
    const lapObject = {};
    lapObject['driver'] = driverId;
    lapObject['port'] = portId;
    lapObject['isThird'] = isThird;
    lapObject['relativeNumber'] = relativeNumber;
    lapObject['load'] = [];
    this.lapsService.createLap(lapObject).subscribe(
      lap => {
        console.log('Vuelta creada!');
        console.log(lap);
        this.currentLap = lap;
      },
      error => {
        console.log('Error creating a lap: ', error);
      }
    );
  }


  // Alert to create a new lap.
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
            this.createNewLap(this.selectedDriverObject._id,
                              this.portId,
                              this.selectedDriverObject.third,
                              numberOfLap);
          }
        }
      ]
    });
    await alert.present();
  }


  // Check if there is enough time since the last load to create a new lap.
  checkHourDifferenceToNewLap(lastLap: any): boolean {
    const a = moment.tz(lastLap.lastLoad, 'America/Santiago');
    const b = moment.tz(Date.now(), 'America/Santiago');
    const diff = b.diff(a, 'hours', true);
    // And then we check if it has been more than 3 hours.
    if (diff >= 3) { return true; }
    return false;
  }


  // Get Date format to display in front.
  getCleanDate(date: Date, format: string): string {
    return moment.tz(date, 'America/Santiago').format(format);
  }


  // Return string with time since the last load.
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


  // Build a dicc with cut vins.
  buildUnitsDiccByVin(unitsList: any) {
    this.unitsDiccByVin = {};
    unitsList.map( unit => {
      const newVin = unit.vin.substring(unit.vin.length - this.currentPort.digitsToConsider);
      this.unitsDiccByVin[newVin] = unit;
    });
    console.log('unitsDiccByVin');
    console.log(this.unitsDiccByVin);
  }


  // Build packing list headers.
  buildPackingListHeaders() {
    this.packingListHeaders = Object.keys(this.unitsList[0]);
    const index = this.packingListHeaders.indexOf('vin', 0);
    if (index > -1) {
      this.packingListHeaders.splice(index, 1);
    }
  }


  // Select Item in searcbar to driver.
  selectItem(driver: any) {
    this.selectedDriver = driver.nick;
    this.selectedDriverObject = driver;
    this.searchBarActive = false;
  }


  // Filter in select driver bar when the user is writing.
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


  // Alert when the user change the slected driver.
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
            console.log('this.selectedDriverObject');
            console.log(this.selectedDriverObject);
            this.getDriverInfoAboutHisLaps(this.selectedDriverObject._id, this.portId);
          }
        }
      ]
    });
    await alert.present();
  }


  // Get the last lap to selected driver or create a new lap if he doesn't have.
  getDriverInfoAboutHisLaps(driverId: string, portId: string) {
    this.lapsService.getLapsByDriverAndPortOrderByRelativeNumber(driverId, portId).subscribe(
      result => {
        if (result.total) {
          this.currentLap = result.data[0];
          this.lastLoadText = this.getDateDifference(result.data[0].lastLoad, Date.now());
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


  // Change selection to bottom tabs-bar.
  changeTabButton(nameButton: string) {
    for (const button of Object.keys(this.buttonTabActiveDicc)) {
      this.buttonTabActiveDicc[button] = false;
    }
    this.buttonTabActiveDicc[nameButton] = true;
  }


  // Search with searchbar in packing list [BUILDING]
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


  // Get Port Object from backend form url.
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


  // Get the current port units to display preview info.
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


  // Get unit info with lap and then driver or third specifications.
  getUnitById(unitId: string) {
    this.unitsService.getUnitById(unitId).subscribe(
      unit => {
        this.unitFound = unit;

        // And if It has already been registered we get his lap lapAssociated and driver.
        if (this.unitFound['lapAssociated']) {
          this.lapsService.getLap(this.unitFound['lapAssociated']).subscribe(
            lap => {
              this.unitFound['lapAssociated'] = lap;
              // And we check if this laps was done by a driver or a third.
              if (!lap.isThird) {
                this.driversService.getDriver(lap.driver).subscribe(
                  driver => {
                    this.unitFound['lapAssociated']['driver'] = driver;
                  },
                  driverError => {
                    console.log('Error getting driver to lap: ', driverError);
                  }
                );
              } else {
                this.thirdsService.getThird(lap.driver).subscribe(
                  third => {
                    this.unitFound['lapAssociated']['driver'] = third;
                  },
                  thirdError => {
                    console.log('Error getting driver to lap: ', thirdError);
                  }
                );
              }
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


  // Generate thirds and drivers array to keep the objects and show lists.
  async generateDriversAndThirdsArray(currentPort: any) {
    // We build drivers array
    await currentPort.consideredDrivers.map( driver => {
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
    await currentPort.consideredThirds.map( third => {
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
    console.log('va a ordenar');
    await console.log(this.activeDriversAndThirdsList);
    await this.activeDriversAndThirdsList.sort( function(a, b) {
      console.log('ordeno entre');
      console.log(a.nick);
      console.log(b.nick);
      if (a.nick < b.nick) {
        return -1;
      } else {
        return 1;
      }
      // if (!a.third && b.third ) {
      //   return -1;
      // }
      // if (a.third && !b.third ) {
      //   return 1;
      // }
      // if (a.third && b.third ) {
      //   if (a.nick < b.nick) {
      //     return -1;
      //   } else {
      //     return 1;
      //   }
      // }
      // if (!a.third && !b.third ) {
      //   if (a.nick < b.nick) {
      //     return -1;
      //   } else {
      //     return 1;
      //   }
      // }
      // return 0;
    } );
    await console.log(this.activeDriversAndThirdsList);
  }


  // Navigate to association
  navigateAssociationUrl() {
    this.navController.navigateForward(`/user-menu/ports/new-port/${this.portId}/drivers/trucks-association`);
  }


  // Compare function to order drivers lists
  compareIsThirdAndThenName(driver1, driver2) {
    console.log('ordeno entre');
    console.log(driver1.nick);
    console.log(driver2.nick);
    if (!driver1.third && driver2.third ) {
      return -1;
    }
    if (driver1.third && !driver2.third ) {
      return 1;
    }
    if (driver1.third && driver2.third ) {
      if (driver1.nick < driver2.nick) {
        return -1;
      } else {
        return 1;
      }
    }
    if (!driver1.third && !driver2.third ) {
      if (driver1.nick < driver2.nick) {
        return -1;
      } else {
        return 1;
      }
    }
    return 0;
  }



}
