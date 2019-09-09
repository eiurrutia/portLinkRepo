import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { UnitsService } from '../../units/shared/units.service';

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
  shipName;
  previewObjects = [];
  headers: any;


  totalCount: number;
  countPerSizeDicc = {};
  headerSizeDicc: any;

  message: any;

  constructor(private modalController: ModalController,
              private navController: NavController,
              private unitsService: UnitsService) { }

  ngOnInit() {
    console.log('sigue funcionando');
    console.log(this.finalPacking);
    console.log(this.modelsCount);
    console.log(this.modelsSize);
    console.log(this.shipName);
    this.generatePreviewObjects();
    this.countPerSize();
  }

  generatePreviewObjects() {
    this.previewObjects = [];
    this.previewObjects.push(this.finalPacking[Object.keys(this.finalPacking)[0]]);
    this.previewObjects.push(this.finalPacking[Object.keys(this.finalPacking)[1]]);
    this.previewObjects.push(this.finalPacking[Object.keys(this.finalPacking)[2]]);
    this.headers = ['vin', 'modelo', 'color', 'tamaño'];
  }

  async closeModal() {
    const modal = await this.modalController.getTop();
    modal.dismiss();
  }

  async confirmModal() {
    const modal = await this.modalController.getTop();
    this.registerUnits(this.finalPacking);
    modal.dismiss();
    this.navController.navigateRoot('user-menu/drivers/drivers-selection');
  }


  registerUnit(unit: any) {
    this.unitsService.createUnit(unit).subscribe(
      newUnit => {
        console.log('unit creada');
      },
      error => {
        // console.log(`Error registering ${driver.firstName} ${driver.lastName}: ${error}`);
        this.message = {message: 'Error, el chofer ya existe', status: 400};
      }
    );
  }

  registerUnits(units: any) {
    Object.keys(units).map((key, index) => {
      const backUnitModel = {
        'model': units[key]['modelo'],
        'size': units[key]['tamaño'],
        'color': units[key]['color'],
        'vin': units[key]['vin'],
      };
      this.registerUnit(backUnitModel);
    });
    console.log('Todas las unidades creadas');
  }

  countPerSize() {
    this.totalCount = 0;
    if (Object.values(this.modelsSize).includes('pequeno')) {
      this.countPerSizeDicc['pequeno'] = 0;
    }
    if (Object.values(this.modelsSize).includes('mediano')) {
      this.countPerSizeDicc['mediano'] = 0;
    }
    if (Object.values(this.modelsSize).includes('grande')) {
          this.countPerSizeDicc['grande'] = 0;
    }
    if (Object.values(this.modelsSize).includes('extraGrande')) {
      this.countPerSizeDicc['extraGrande'] = 0;
    }
    for (const model of Object.keys(this.modelsCount)) {
      this.countPerSizeDicc[this.modelsSize[model]] += this.modelsCount[model];
      this.totalCount += this.modelsCount[model];
    }
    console.log(this.countPerSizeDicc);
    this.headerSizeDicc = Object.keys(this.countPerSizeDicc);
  }

}
