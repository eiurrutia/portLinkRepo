import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, NavController } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-new-port-modal',
  templateUrl: './new-port-modal.page.html',
  styleUrls: ['./new-port-modal.page.scss'],
})
export class NewPortModalPage implements OnInit {

  finalPacking = null;
  modelsCount = null;
  modelsSize = null;
  previewObjects = [];
  headers: any;
  shipName: string;

  totalCount: number;
  countPerSizeDicc = {};
  headerSizeDicc: any;

  constructor(private navParams: NavParams,
              private modalController: ModalController,
              private navController: NavController) { }

  ngOnInit() {
    this.shipName = this.navParams.get('custom_portName');
    this.finalPacking = this.navParams.get('custom_packing');
    this.modelsCount = this.navParams.get('custom_modelsCount');
    this.modelsSize = this.navParams.get('custom_modelsSize');
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

  closeModal() {
    this.modalController.dismiss();
    this.navController.navigateRoot('user-menu/drivers/drivers-selection');
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
