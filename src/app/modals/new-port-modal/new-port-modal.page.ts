import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-port-modal',
  templateUrl: './new-port-modal.page.html',
  styleUrls: ['./new-port-modal.page.scss'],
})
export class NewPortModalPage implements OnInit {

  finalPacking = null;
  previewObjects = [];
  headers: any;

  constructor(private navParams: NavParams,
              private modalController: ModalController) { }

  ngOnInit() {
    this.finalPacking = this.navParams.get('custom_packing');
    this.generatePreviewObjects();
  }

  generatePreviewObjects() {
    this.previewObjects = [];
    this.previewObjects.push(this.finalPacking[Object.keys(this.finalPacking)[0]]);
    this.previewObjects.push(this.finalPacking[Object.keys(this.finalPacking)[1]]);
    this.previewObjects.push(this.finalPacking[Object.keys(this.finalPacking)[2]]);
    console.log('previewObjects');
    console.log(this.previewObjects);
    this.headers = ['vin', 'modelo', 'color', 'tamaño'];
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
