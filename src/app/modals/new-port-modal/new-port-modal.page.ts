import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { PortsService } from '../../ports/shared/ports.service';
import { UnitsService } from '../../units/shared/units.service';

import { Port } from '../../ports/port.model';
import { Unit } from '../../units/unit.model';

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

  constructor(private modalController: ModalController,
              private navController: NavController,
              private portsService: PortsService,
              private unitsService: UnitsService) { }

  ngOnInit() {
    this.generatePreviewObjects();
    this.countPerSize();
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


  // Create unit in backend.
  registerUnit(unit: any) {
    this.unitsService.createUnit(unit).subscribe(
      newUnit => {
        console.log('unit creada');
      },
      error => {
        // console.log(`Error registering ${driver.firstName} ${driver.lastName}: ${error}`);
        this.message = {message: 'Error, la unidad ya existe', status: 400};
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
        // console.log(`Error registering ${driver.firstName} ${driver.lastName}: ${error}`);
        this.message = {message: 'Error, el puerto ya existe', status: 400};
      }
    );
  }

  // We build unit's object to send to backend.
  async registerUnits(units: any, port: any) {
    await Object.keys(units).map((key, index) => {
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

    // And we create the port in backend.
    this.createPort(this.portObject);
  }

}
