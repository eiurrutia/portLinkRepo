import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, LoadingController, Platform } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { File } from '@ionic-native/file/ngx';
import * as Papa from 'papaparse';

import { PortsService } from '../shared/ports.service';
import { LapsService } from '../../laps/shared/laps.service';
import { DriversService } from '../../drivers/shared/drivers.service';
import { ThirdsService } from '../../thirds/shared/thirds.service';
import { UnitsService } from '../../units/shared/units.service';
import { CommissionsService } from '../../commissions/shared/commissions.service';

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
  unitsDiccByVin = {};
  unitsDiccById = {};
  vinToRegister: any;
  driversDicc = {};
  thirdsDicc = {};
  commissionsDicc = {};
  toReport = {};
  toReportModels = {};

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
                        'setting': false,
                        'share': false
                        };
  packingListHeaders: any;
  packingListHeadersWithoutVin: any;

  showConfigCommissions = false;
  editConfigCommissions = false;
  commissionsChanged = false;

  wordSearchedInPacking: string;

  loading: any;
  lapLoading: any;

  headerRow: any;
  csvData: any;

  constructor(private activatedRoute: ActivatedRoute,
              private alertController: AlertController,
              private navController: NavController,
              private loadingController: LoadingController,
              private platform: Platform,
              private file: File,
              private socialSharing: SocialSharing,
              private portsService: PortsService,
              private lapsService: LapsService,
              private driversService: DriversService,
              private thirdsService: ThirdsService,
              private unitsService: UnitsService,
              private commissionsService: CommissionsService) { }

  async ngOnInit() {
    this.portId = this.activatedRoute.snapshot.paramMap.get('id');
    await this.presentLoading();
    this.getPort(this.portId);
    this.driversFiltered = this.activeDriversAndThirdsList;
    this.getDrivers();
    this.getThirds();
    this.getUnitsByPort(this.portId);
    this.getComissions();
  }


  doRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      if (this.selectedDriverObject.third) {
        this.getDriverInfoAboutHisLaps(this.selectedDriverObject._id, this.portId, this.selectedDriverObject.nick);
      } else { this.getDriverInfoAboutHisLaps(this.selectedDriverObject._id, this.portId); }
      event.target.complete();
    }, 100);
  }


  // Get drivers and build dicc.
  getDrivers() {
    this.driversService.getDrivers().subscribe(
      drivers => {
        drivers.map( driver => {
          this.driversDicc[driver['_id']] = driver;
        });
        console.log(this.driversDicc);
      },
      error => {
        console.log('Error fetching drivers: ', error);
      }
    );
  }


  // Get thirds and build dicc.
  getThirds() {
    this.thirdsService.getThirds().subscribe(
      thirds => {
        thirds.map( third => {
          this.thirdsDicc[third['_id']] = third;
        });
        console.log(this.thirdsDicc);
      },
      error => {
        console.log('Error fetching thirds: ', error);
      }
    );
  }


  // Get units info and build dicc.
  getUnitsByPort(portId: string) {
    this.unitsService.getUnitsByPort(portId).subscribe(
      units => {
        units.data.map( unit => { this.unitsDiccById[unit['_id']] = unit; });
      },
      error => {
        console.log('Error fetching units by port: ', error);
      }
    );
  }


  // Get commissions from backend.
  getComissions() {
    this.commissionsService.getComissions().subscribe(
      result => {
        result.data.map(commission => {
          this.commissionsDicc[commission['kind']] = commission;
         }
        );
      },
      error => {
        console.log('Error fetching commissions: ', error);
      }
    );
  }


  // Write csv to report.
  downloadResumeCSV() {
    let driversLapsCount = 0;
    let driversUnitsCount = 0;
    let thirdsLapsCount = 0;
    let thirdsUnitsCount = 0;
    const resumeDataArray = [];
    // We add the shipName and date.
    resumeDataArray.push(['', '', '', this.currentPort.shipName, '', this.getCleanDate(this.currentPort.arrivalDate, 'DD/MM/YY')]);

    // Break Line
    resumeDataArray.push(['', '', '']);

    // Headers to resume Table
    resumeDataArray.push([
      'Conductor', 'Unidades Trasladadas', 'Total Vueltas', 'Vueltas Día Normal',
      'Vueltas Sábados', 'Vueltas Domingos y Festivos', 'Comisión Total',
      'Total Días', 'Viático Total'
    ]);

    // Info about laps. We iterate over the drivers and thirds.
    // Drivers
    for (const driver of Object.keys(this.toReport['drivers'])) {
      driversLapsCount += this.toReport['drivers'][driver]['totalLaps'];
      driversUnitsCount += this.toReport['drivers'][driver]['movedUnits'];
      resumeDataArray.push([
        this.driversDicc[driver]['name'], this.toReport['drivers'][driver]['movedUnits'], this.toReport['drivers'][driver]['totalLaps'],
        this.toReport['drivers'][driver]['normalDayLaps'], this.toReport['drivers'][driver]['saturdayLaps'],
        this.toReport['drivers'][driver]['holidayLaps'], 'Comisión Total',
        this.toReport['drivers'][driver]['totalDays'], 'Viático Total'
      ]);
    }

    // Thirds
    for (const driver of Object.keys(this.toReport['thirds'])) {
      thirdsLapsCount += this.toReport['thirds'][driver]['totalLaps'];
      thirdsUnitsCount += this.toReport['thirds'][driver]['movedUnits'];
      resumeDataArray.push([
        '*' + driver, this.toReport['thirds'][driver]['movedUnits'], this.toReport['thirds'][driver]['totalLaps'],
        this.toReport['thirds'][driver]['normalDayLaps'], this.toReport['thirds'][driver]['saturdayLaps'],
        this.toReport['thirds'][driver]['holidayLaps'], 'Comisión Total',
        this.toReport['thirds'][driver]['totalDays'], 'Viático Total'
      ]);
    }

    // Break Line
    resumeDataArray.push(['', '', '']);
    resumeDataArray.push(['', '', '']);

    // Total by drivers and thirds
    resumeDataArray.push([ 'Total Conductores:', driversUnitsCount, driversLapsCount]);
    resumeDataArray.push([ 'Total Terceros:', thirdsUnitsCount, thirdsLapsCount]);

    // Break Line
    resumeDataArray.push(['', '', '']);

    // Total
    resumeDataArray.push([ 'Total:', driversUnitsCount + thirdsUnitsCount, driversLapsCount + thirdsLapsCount]);

    // Break Line
    resumeDataArray.push(['', '', '']);

    // Title to Resume
    resumeDataArray.push([
      '', '', '', 'RESUMEN POR MODELOS']);

    // Break Line
    resumeDataArray.push(['', '', '']);

    // Models titles
    resumeDataArray.push(['', 'Modelo', '', 'Tamaño', '', 'Cantidad']);

    // Differents models
    for (const model of Object.keys(this.toReportModels)) {
      resumeDataArray.push(['', model, '', 'Mediano', '', this.toReportModels[model]]);
    }

    const csv = Papa.unparse(resumeDataArray);
    console.log('resumeDataArray');
    console.log(resumeDataArray);

    if (this.platform.is('cordova')) {
      this.file.writeFile(this.file.externalRootDirectory + '/Download/', 'Resumen ' + this.currentPort.shipName + '.csv',
        csv, { replace: true }).then(async (res) => {
          // this.socialSharing.share(null, null, res.nativeUrl, null);
          this.socialSharing.shareViaEmail(
            'Se adjunta el reporte del barco ' + this.currentPort.shipName + 'con 30% de avance.',
            'Resumen ' + this.currentPort.shipName,
            ['eiurrutia@uc.cl'], null, null,
            res.nativeURL.replace('%20', ' ')).then(
              () => { console.log('compartido via email'); }
            ).catch(e => {
              console.log('error share via email: ', e);
            });
        });
    } else {
      // To download in browser.
      const blob = new Blob([csv]);
      const a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = 'Archivo Resumen ' + this.currentPort.shipName + '.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }


  // Get units movement report in csv.
  downloadMovementsDetailCSV() {
    const movementsDataArray = [];
    // movementsDataArray.push(['SEP=;']);

    // We add the shipName and Date
    movementsDataArray.push(['', '', '', this.currentPort.shipName, '', this.getCleanDate(this.currentPort.arrivalDate, 'DD/MM/YY')]);

    // Break Line
    movementsDataArray.push(['', '', '']);

    // Titles
    movementsDataArray.push(['VIN', 'Modelo', 'Color', 'Tamano', 'Conductor', 'Camión', 'Rampla', 'Fecha', 'Hora', 'Vuelta']);

    // Info for each unit
    this.unitsService.getUnitsByPort(this.currentPort._id).subscribe(
      units => {
        Promise.all(units.data.sort( this.compareVIN ).map( async (unit) => {
          return new Promise( resolve => {
            if (unit['lapAssociated']) {
              this.lapsService.getLap(unit['lapAssociated']).subscribe(
                lap => {
                  let driver = '';
                  if (!lap.isThird) { driver = this.driversDicc[lap['driver']]['name'];
                  } else { driver = lap['nickName']; }
                  movementsDataArray.push([unit['vin'], unit['model'], unit['color'], unit['size'],
                                          driver, lap['truck'], lap['ramp'] ? lap['ramp'] : '-',
                                          this.getCleanDate(unit['loadedDate'], 'DD/MM/YY'), this.getCleanDate(unit['loadedDate'], 'HH:mm'),
                                          lap['relativeNumber']]);
                  resolve();
                },
                error => {
                  console.log('Error fetching lap associated for unit: ', error);
                  resolve();
                }
              );
            } else {
              movementsDataArray.push([unit['vin'], unit['model'], unit['color'], unit['size'] ]);
              resolve();
            }
          });
        })).then( () => {
          this.shareReportViaEmail(movementsDataArray,
            'Se adjunta el reporte de movimientos del barco ' + this.currentPort.shipName + 'con 30% de avance.',
            'Movimientos ' + this.currentPort.shipName,
            ['eiurrutia@uc.cl'],
            'Movimientos ' + this.currentPort.shipName + '.csv');
        });
      },
      error => {
        console.log('Error fetching units by port: ', error);
      }
    );
  }


  // Sharing download(dektop) or mail(device)
  shareReportViaEmail(array: any, message: string, subject: string, directions: string[], fileName: string) {
    console.log(array);
    console.log('array');
    const csv = Papa.unparse(array, {'delimiter': ';'});
    if (this.platform.is('cordova')) {
      this.file.writeFile(this.file.externalRootDirectory + '/Download/', fileName,
        csv, { replace: true }).then(async (res) => {
          // this.socialSharing.share(null, null, res.nativeUrl, null);
          this.socialSharing.shareViaEmail(
            message, subject, directions, null, null, res.nativeURL.replace('%20', ' '))
            .then(
              () => { console.log('compartido via email'); }
            ).catch(e => {
              console.log('error share via email: ', e);
            });
        });
    } else {
      // To download in browser.
      const blob = new Blob([csv]);
      const a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  // Get info to report.
  getInfoToReportResumeInCSV() {
    this.toReport['drivers'] = {};
    this.toReport['thirds'] = {};
    this.toReportModels = {};
    this.lapsService.getLapsByPort(this.currentPort._id).subscribe(
      result => {
        Promise.all(result.data.map( async (lap) => {
          return new Promise ( resolve => {
            let kind = '';
            let id = '';
            if (!lap.isThird) { kind = 'drivers'; id = lap.driver;
            } else { kind = 'thirds'; id = lap.nickName; }

            if (!this.toReport[kind][id]) {
              console.log('se creo para el driver: ', lap.driver);
              this.toReport[kind][id] = {};
              this.toReport[kind][id]['movedUnits'] = 0;
              this.toReport[kind][id]['totalLaps'] = 0;
              this.toReport[kind][id]['holidayLaps'] = 0;
              this.toReport[kind][id]['saturdayLaps'] = 0;
              this.toReport[kind][id]['normalDayLaps'] = 0;
              this.toReport[kind][id]['lapsCountByDay'] = {};
              this.toReport[kind][id]['totalDays'] = 0;
            }
            this.toReport[kind][id]['movedUnits'] += lap['load'].length;
            this.toReport[kind][id]['totalLaps'] += 1;

            // Detect day of the week to commission.
            const day = this.getCleanDate(lap.lastLoad, 'ddd');
            if (day === 'Sun') {
              this.toReport[kind][id]['holidayLaps'] += 1;
            } else if (day === 'Sat') {
              this.toReport[kind][id]['saturdayLaps'] += 1;
            } else {
              this.toReport[kind][id]['normalDayLaps'] += 1;
            }


            // Detect differents days to viatics.
            const date = this.getCleanDate(lap.lastLoad, 'DD/MM/YY');
            console.log('buscara el date para el deriver: ', lap.driver);
            console.log('Date: ', date);
            console.log(this.toReport);
            if (!(date in Object.keys(this.toReport[kind][id]['lapsCountByDay']))) {
              this.toReport[kind][id]['lapsCountByDay'][date] = 1;
              this.toReport[kind][id]['totalDays'] += 1;
            } else {
              this.toReport[kind][id]['lapsCountByDay'][date] += 1;
            }

            // Check units moved in this lap
            lap.load.map( unit => {
              const model = this.unitsDiccById[unit['unit']]['model'];
              if (!this.toReportModels[model]) { this.toReportModels[model] = 1;
              } else { this.toReportModels[model] += 1; }
            });

            resolve();
          });
        }
      )).then( () => {
        console.log('este es el dicc to report ºgenerado');
        console.log(this.toReport);
      });
      },
      error => {
        console.log('Error fetching laps: ', error);
      }
    );

  }


  // Loading efect when the bakend is loading.
  async presentLoading() {
    // Prepare a loading controller
    this.loading = await this.loadingController.create({
        message: 'Cargando...'
    });
    // Present the loading controller
  await this.loading.present();
  }

  // Loading efect when the bakend is loading a lap.
  async presentLapLoading() {
    // Prepare a loading controller
    this.lapLoading = await this.loadingController.create({
        message: 'Cargando...'
    });
    // Present the loading controller
  await this.lapLoading.present();
  }


  // Set search drvier var active and delete search vin bar to start with field empty.
  setSearhBarActive() {
    this.searchBarActive = true;
    this.vinToRegister = '';
    this.unitFound = {};
    this.correctSlectedDriver = false;
    this.selectedDriver = null;
    this.selectedDriverObject = null;
  }


  driverTurnSocialSharing() {
    const dateString = this.getCleanDate(new Date(Date.now()), 'DD/MM/YY - HH:mm');
    let stringToShare = '';
    stringToShare += `*Respuesta automatizada:*\n\n`;
    stringToShare += `[ SALIDA DE PUERTO ]\n`;
    stringToShare += `*${this.selectedDriver}*\n`;
    stringToShare += `*·Hora de salida:* ${dateString}\n`;
    stringToShare += `·Vuelta Nº ${this.currentLap.relativeNumber}\n`;
    stringToShare += `·Última carga: ${this.lastLoadText}\n`;
    stringToShare += `·Unidades trasladas: ${this.currentLap.load.length}\n`;
    stringToShare += `·Camión: ${this.currentLap.truck}\n`;
    stringToShare += `·Rampla: ${this.currentLap.ramp}\n\n`;
    stringToShare += `---${this.currentPort['shipName']}---`;
    this.socialSharing.shareViaWhatsApp(stringToShare).then(
      () => { console.log('compartido via whatsapp'); }
    ).catch(e => {
      console.log('error share via whatsapp: ', e);
    });
  }

  portResumeSocialSharing() {
    const dateString = this.getCleanDate(new Date(Date.now()), 'DD/MM/YY - HH:mm');
    let stringToShare = '';
    stringToShare += `*Respuesta automatizada:*\n`;
    stringToShare += `[ RESUMEN PUERTO ]\n`;
    stringToShare += `·Total Unidades: *${this.currentPort.unitsInPacking.totalQuantity}*\n`;
    stringToShare += `·Unidades retiradas: *${this.currentPort.collectedUnits.totalQuantity}*\n`;
    stringToShare += `·Unidades por retirar: *${this.currentPort.unitsInPacking.totalQuantity -
      this.currentPort.collectedUnits.totalQuantity}*\n\n`;
    stringToShare += `---Desglose Tamaños---\n`;
    const unitsPackingDicc = this.currentPort.unitsInPacking;
    const collectedUnits = this.currentPort.collectedUnits;
    if (unitsPackingDicc.smallQuantity) { stringToShare +=
      `·Pequeñas: *${collectedUnits.smallQuantity}* (${unitsPackingDicc.smallQuantity})\n`; }
    if (unitsPackingDicc.mediumQuantity) { stringToShare +=
      `·Medianas: *${collectedUnits.mediumQuantity}* (${unitsPackingDicc.mediumQuantity})\n`; }
    if (unitsPackingDicc.bigQuantity) { stringToShare +=
      `·Grandes: *${collectedUnits.bigQuantity}* (${unitsPackingDicc.bigQuantity})\n`; }
    if (unitsPackingDicc.extraQuantity) { stringToShare +=
      `·Extra Grandes: *${collectedUnits.extraQuantity}* (${unitsPackingDicc.extraQuantity})\n`; }
    stringToShare += `\n`;
    stringToShare += `---Desglose Modelos---\n`;
    const modelCountDicc = this.currentPort.modelsCountDicc;
    for (const model of Object.keys(modelCountDicc.collected)) {
      stringToShare += `·${model}: *${modelCountDicc.collected[model]}* (${modelCountDicc.totalToCollect[model]})\n`;
    }
    stringToShare += `\n`;
    stringToShare += `*·Hora Reporte:* ${dateString}\n`;
    this.socialSharing.shareViaWhatsApp(stringToShare).then(
      () => { console.log('compartido via whatsapp'); }
    ).catch(e => {
      console.log('error share via whatsapp: ', e);
    });
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
    } else {
      // Do nothing in other case (we have a registered unit but we want user press the button manually).
      console.log('se intenta re registrar una undiad. aprieta el botón.');
    }
  }


  // Register unit in lap and update unit object in backend.
  async registerUnit(unit: any) {
    await this.presentLoading();

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
        this.loading.dismiss();
        this.registerUnitAlert();
      },
      error => {
        this.loading.dismiss();
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
        portObject['doneLaps'] = this.currentPort['doneLaps'];
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
  async createNewLap(driver: any, portId: string, isThird: boolean, relativeNumber: number) {
    await this.presentLoading();
    const lapObject = {};
    lapObject['driver'] = driver._id;
    lapObject['port'] = portId;
    lapObject['isThird'] = isThird;
    lapObject['relativeNumber'] = relativeNumber;
    lapObject['load'] = [];
    lapObject['truck'] = driver.truckPlateId;
    // We will register the ramp and unionized attributes only if it corresponds to a company driver.
    if (!isThird) {
      lapObject['unionized'] = driver.unionized;
      lapObject['ramp'] = driver.rampPlateId;
    } else {
      lapObject['nickName'] = driver.nick;
    }

    this.lapsService.createLap(lapObject).subscribe(
      lap => {
        console.log('Vuelta creada!');
        console.log(lap);
        this.currentLap = lap;
        this.currentPort['doneLaps'] += 1;
        this.loading.dismiss();
      },
      error => {
        this.setFailLapCreate();
        console.log('Error creating a lap: ', error);
        this.loading.dismiss();
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
              this.setFailLapCreate();
            }
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.createNewLap(this.selectedDriverObject,
                              this.portId,
                              this.selectedDriverObject.third,
                              numberOfLap);
          }
        }
      ]
    });
    await alert.present();
  }


  // Set null varibles to error failed lap create.
  setFailLapCreate() {
    this.correctSlectedDriver = false;
    this.selectedDriver = null;
    this.selectedDriverObject = null;
    this.lastSelectedDriver = null;
    this.lastSelectedDriverObject = null;
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
        if (this.selectedDriverObject.third) {
          this.getDriverInfoAboutHisLaps(this.selectedDriverObject._id, this.portId, this.selectedDriverObject.nick);
        } else { this.getDriverInfoAboutHisLaps(this.selectedDriverObject._id, this.portId); }
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
            if (this.selectedDriverObject['third']) {
              this.getDriverInfoAboutHisLaps(this.selectedDriverObject._id,
                this.portId, this.selectedDriverObject['nick']);
            } else { this.getDriverInfoAboutHisLaps(this.selectedDriverObject._id, this.portId); }
          }
        }
      ]
    });
    await alert.present();
  }


  // Get the last lap to selected driver or create a new lap if he doesn't have.
  async getDriverInfoAboutHisLaps(driverId: string, portId: string, nickName = null) {
    await this.presentLapLoading();

    this.lapsService.getLapsByDriverAndPortOrderByRelativeNumber(driverId, portId, nickName).subscribe(
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
        this.lapLoading.dismiss();

      },
      error => {
        console.log('Error getting the driver laps: ', error);
        this.lapLoading.dismiss();
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
    const vinArray = this.unitsList.filter(
      movement => movement.vin.toLocaleLowerCase().includes(this.wordSearchedInPacking.toLocaleLowerCase()));
    const modelArray = this.unitsList.filter(
      movement => movement.modelo.toLocaleLowerCase().includes(this.wordSearchedInPacking.toLocaleLowerCase()));
    const driverArray = this.unitsList.filter(
      movement => movement.conductor.toLocaleLowerCase().includes(this.wordSearchedInPacking.toLocaleLowerCase()));
    const sizeArray = this.unitsList.filter(
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
        console.log('se acutalizó current port: ', this.currentPort);
        this.getCurrentPortUnits(currentPort._id);
        this.generateDriversAndThirdsArray(currentPort);
      },
      error => {
        this.loading.dismiss();
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
        this.loading.dismiss();
      },
      error => {
        this.loading.dismiss();
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
    this.activeDriversAndThirdsList = [];
    // We build drivers array
    await Promise.all(currentPort.consideredDrivers.map( async (driver) => {
      return new Promise ( resolve => this.driversService.getDriver(driver.driverId).subscribe(
        backDriver => {
          this.activeDriversAndThirdsList.push({'_id': backDriver._id, 'nick': backDriver.name,
                                                'third': false, 'truckPlateId': driver.truckPlateId,
                                                'rampPlateId': driver.rampPlateId, 'unionized': backDriver.unionized});
          this.namesArray.push(backDriver.name);
          resolve();
        },
        error => {
          console.log('Error getting driver: ', error);
        }
      ));
    }));

    // We build thirds array
    await Promise.all(currentPort.consideredThirds.map( async (third) => {
      return new Promise ( resolve => this.thirdsService.getThird(third.thirdId).subscribe(
        backThird => {
          if (third.nickName) {
            this.activeDriversAndThirdsList.push({'_id': backThird._id,
                                                  'nick': backThird.name + ' - ' + third.nickName,
                                                  'third': true, 'truckPlateId': third.truckPlateId});
            this.namesArray.push(backThird.name + ' - ' + third.nickName);
          } else {
            this.activeDriversAndThirdsList.push({'_id': backThird._id,
                                                  'nick': backThird.name,
                                                  'third': true, 'truckPlateId': third.truckPlateId});
            this.namesArray.push(backThird.name);
          }
          resolve();
        },
        error => {
          console.log('Error getting third: ', error);
        }
      ));
    }));
    // And then, we sort the list by drivers and thords and bay nickName.
    await this.activeDriversAndThirdsList.sort( this.compareIsThirdAndThenName );
  }


  // Navigate to association
  navigateAssociationUrl() {
    this.navController.navigateForward(`/user-menu/ports/new-port/${this.portId}/drivers/trucks-association/modify`);
  }

  // Navigate to drivers selection.
  navigateDriversSelectionUrl() {
    this.navController.navigateRoot(`user-menu/ports/new-port/${this.portId}/drivers/drivers-selection/modify`);
  }


  // Compare function to order drivers lists
  compareIsThirdAndThenName(driver1, driver2) {
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


  // Compare function to order units lists
  compareVIN(unit1, unit2) {
    if (unit1.vin.substring(unit1.vin.length - 6) < unit2.vin.substring(unit1.vin.length - 6)) {
      return -1;
    } else {
      return 1;
    }
  }


  // Modify port commisions alert.
  async changePortComissionsAlert() {
    const alert = await this.alertController.create({
      header: 'Modificar Comisiones',
      subHeader: 'Deseas modificar las comisiones para este puerto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Aceptar',
          handler: () => { this.updatePortCommissions(); }
        }
      ]
    });
    await alert.present();
  }

  // Success commisions alert.
  async successComissionsAlert() {
    const alert = await this.alertController.create({
      header: 'Modificación Exitosa',
      subHeader: 'Se han modificados las comisiones del puerto.',
      buttons: [
         {
          text: 'Ok',
          handler: () => {}
        }
      ]
    });
    await alert.present();
  }


  // Update port commissions
  updatePortCommissions() {
    const portObject = {};
    portObject['portCommissions'] = {};
    portObject['portCommissions']['nonUnionized'] = {};
    portObject['portCommissions']['nonUnionized']['holiday'] = this.currentPort['portCommissions']['nonUnionized']['holiday'];
    portObject['portCommissions']['nonUnionized']['normalDays'] = this.currentPort['portCommissions']['nonUnionized']['normalDays'];
    portObject['portCommissions']['nonUnionized']['saturday'] = this.currentPort['portCommissions']['nonUnionized']['saturday'];
    portObject['portCommissions']['nonUnionized']['viatic'] = this.currentPort['portCommissions']['nonUnionized']['viatic'];
    portObject['portCommissions']['unionized'] = {};
    portObject['portCommissions']['unionized']['holiday'] = this.currentPort['portCommissions']['unionized']['holiday'];
    portObject['portCommissions']['unionized']['normalDays'] = this.currentPort['portCommissions']['unionized']['normalDays'];
    portObject['portCommissions']['unionized']['saturday'] = this.currentPort['portCommissions']['unionized']['saturday'];
    portObject['portCommissions']['unionized']['viatic'] = this.currentPort['portCommissions']['unionized']['viatic'];

    this.portsService.updatePort(this.portId, portObject).subscribe(
      () => {
        console.log('Comisiones actualizadas.');
        this.successComissionsAlert();
        this.editConfigCommissions = false;
        this.commissionsChanged = false;
      },
      error => {
        console.log('Error fetching port: ', error);
      }
    );

  }



}
