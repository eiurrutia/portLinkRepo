import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, LoadingController } from '@ionic/angular';

import { PortsService } from '../../ports/shared/ports.service';
import { UnitsService } from '../../units/shared/units.service';
import { CommissionsService } from '../../commissions/shared/commissions.service';



@Component({
  selector: 'app-new-port-modal',
  templateUrl: './new-port-modal.page.html',
  styleUrls: ['./new-port-modal.page.scss'],
})
export class NewPortModalPage implements OnInit {

  finalPacking;
  modelsCount;
  modelsSize;
  estimatedLoadString;
  digitsToConsider;
  importer;
  shipName;
  previewObjects = [];
  previewVins = [];
  // Drivers list
  headers: any;


  totalCount: number;
  estimatedLoad: number;
  estimatedLaps: number;
  countPerSizeDicc = {};
  headerSizeDicc: any;

  message: any;
  portObject = {};
  commissions = {};
  loading: any;

  constructor(private modalController: ModalController,
              private navController: NavController,
              private loadingController: LoadingController,
              private portsService: PortsService,
              private unitsService: UnitsService,
              private commissionsService: CommissionsService) { }

  ngOnInit() {
    this.generatePreviewObjects();
    this.countPerSize();
    this.getComissions();
    this.estimatedLoad = Number(this.estimatedLoadString);
    this.estimatedLaps = parseFloat((this.totalCount / this.estimatedLoad).toFixed(1));
  }

  // Generate array with three elements to preview table.
  generatePreviewObjects() {
    this.previewObjects = [];
    this.previewVins = [];
    this.previewObjects.push(this.finalPacking[Object.keys(this.finalPacking)[0]]);
    this.previewVins.push(Object.keys(this.finalPacking)[0]);
    this.previewObjects.push(this.finalPacking[Object.keys(this.finalPacking)[1]]);
    this.previewVins.push(Object.keys(this.finalPacking)[1]);
    this.previewObjects.push(this.finalPacking[Object.keys(this.finalPacking)[2]]);
    this.previewVins.push(Object.keys(this.finalPacking)[2]);
    this.headers = ['vin', 'modelo', 'color', 'tamaño'];
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

  // Close modal.
  async closeModal() {
    const modal = await this.modalController.getTop();
    modal.dismiss();
  }

  // Confirm new port and close modal.
  async confirmModal() {
    const modal = await this.modalController.getTop();
    this.generatePortObjectToBackend();
    modal.dismiss();
    // this.navController.navigateRoot('user-menu/ports/drivers/drivers-selection');
  }


  // Get commissions
  getComissions() {
    this.presentLoading();
    this.commissionsService.getComissions().subscribe(
      commissions => {
        commissions.data.map( commission => {
          this.commissions[commission.kind] = commission;
        });
        this.loading.dismiss();
      },
      error => {
        console.log('Error getting commission: ', error);
        this.loading.dismiss();
      }
    );
  }


  // Create unit in backend.
  registerUnit(unit: any) {
    this.unitsService.createUnit(unit).subscribe(
      newUnit => {
        this.message = 'Unit creada: ' + newUnit._id;
      },
      error => {
        this.message = {message: 'Error, la unidad ya existe', status: 400};
        // Error when unit already exist in other port. So we are going to try to patch the newPort id to that unit;
        if (error === 409) {
          console.log('Existen unidades de este packing asignadas a otro puerto.');
          this.updatePortToUnit(unit.port, unit.vin);
        }
      }
    );
  }


  // To update unit port if the unit is already created.
  updatePortToUnit(portId: string, unitVin: string) {
    const unitObj = {'port': portId};
    this.unitsService.updateUnitByVin(unitVin, unitObj).subscribe(
      unitUpdated => {
        this.message = 'Se ha actualizado correctamente el puerto de la unidad: ' + unitUpdated._id;
      },
      error => {
        console.log('Error actualizando el puerto de la unidad: ', error);
      }
    );
  }


  // Create port in backend.
  createPort(port: any) {
    this.portsService.createPort(port).subscribe(
      newPort => {
        console.log('Port creado on éxito');
        console.log(newPort);
        this.registerUnits(this.finalPacking, newPort);
        this.navController.navigateRoot(`user-menu/ports/new-port/${newPort._id}/drivers/drivers-selection`);
      },
      error => {
        console.log(`Error registering port: ${error}`);
      }
    );
  }

  // We build unit's object to send to backend.
  async registerUnits(units: any, port: any) {
    await Object.keys(units).map( key => {
      const backUnitModel = {
        'model': units[key]['modelo'],
        'size': units[key]['tamaño'],
        'color': units[key]['color'],
        'vin': units[key]['vin'],
        'port': port['_id']
      };
      this.registerUnit(backUnitModel);
    });
  }

  // Build count array by size.
  countPerSize() {
    this.totalCount = 0;
    this.countPerSizeDicc['pequeno'] = 0;
    this.countPerSizeDicc['mediano'] = 0;
    this.countPerSizeDicc['grande'] = 0;
    this.countPerSizeDicc['extraGrande'] = 0;

    for (const model of Object.keys(this.modelsCount)) {
      this.countPerSizeDicc[this.modelsSize[model]] += this.modelsCount[model];
      this.totalCount += this.modelsCount[model];
    }
    this.headerSizeDicc = Object.keys(this.countPerSizeDicc);
  }

  // We build object to create port in backend.
  generatePortObjectToBackend() {
    this.portObject['shipName'] = this.shipName;
    this.portObject['arrivalDate'] = Date.now(); // For now
    this.portObject['importer'] = this.importer._id;
    this.portObject['estimatedLoad'] = Number(this.estimatedLoad);
    this.portObject['estimatedLaps'] = Number(this.estimatedLaps);
    this.portObject['digitsToConsider'] = this.digitsToConsider;
    this.portObject['unitsInPacking'] = {};
    this.portObject['unitsInPacking']['totalQuantity'] = this.totalCount;
    this.portObject['unitsInPacking']['smallQuantity'] = this.countPerSizeDicc['pequeno'];
    this.portObject['unitsInPacking']['mediumQuantity'] = this.countPerSizeDicc['mediano'];
    this.portObject['unitsInPacking']['bigQuantity'] = this.countPerSizeDicc['grande'];
    this.portObject['unitsInPacking']['extraQuantity'] = this.countPerSizeDicc['extraGrande'];
    // Collected units attribute should be created auto.

    // Dicc with collected and uncollected units by models
    this.portObject['modelsCountDicc'] = {};
    this.portObject['modelsCountDicc']['totalToCollect'] = {};
    this.portObject['modelsCountDicc']['collected'] = {};
    for (const key of Object.keys(this.modelsCount)) {
      this.portObject['modelsCountDicc']['totalToCollect'][key] = this.modelsCount[key];
      this.portObject['modelsCountDicc']['collected'][key] = 0;
    }

    // Importer Rates according to that time.
    this.portObject['portRates'] = {};
    this.portObject['portRates']['small'] = this.importer['rates']['small'];
    this.portObject['portRates']['medium'] = this.importer['rates']['medium'];
    this.portObject['portRates']['big'] = this.importer['rates']['big'];
    this.portObject['portRates']['extra'] = this.importer['rates']['extra'];

    // Drivers Commissions
    this.portObject['portCommissions'] = {};
    this.portObject['portCommissions']['unionized'] = {};
    this.portObject['portCommissions']['unionized']['normalDays'] = this.commissions['unionized']['normalCommission'];
    this.portObject['portCommissions']['unionized']['saturday'] = this.commissions['unionized']['saturdayCommission'];
    this.portObject['portCommissions']['unionized']['holiday'] = this.commissions['unionized']['holidayCommission'];
    this.portObject['portCommissions']['unionized']['viatic'] = this.commissions['unionized']['viatic'];
    this.portObject['portCommissions']['nonUnionized'] = {};
    this.portObject['portCommissions']['nonUnionized']['normalDays'] = this.commissions['nonUnionized']['normalCommission'];
    this.portObject['portCommissions']['nonUnionized']['saturday'] = this.commissions['nonUnionized']['saturdayCommission'];
    this.portObject['portCommissions']['nonUnionized']['holiday'] = this.commissions['nonUnionized']['holidayCommission'];
    this.portObject['portCommissions']['nonUnionized']['viatic'] = this.commissions['nonUnionized']['viatic'];

    // And we create the port in backend.
    this.createPort(this.portObject);
  }

}
