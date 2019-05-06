import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-port-modal',
  templateUrl: './new-port-modal.page.html',
  styleUrls: ['./new-port-modal.page.scss'],
})
export class NewPortModalPage implements OnInit {

  passedId = null;

  constructor(private navParams: NavParams,
              private modalController: ModalController) { }

  ngOnInit() {
    this.passedId = this.navParams.get('custom_id');
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
