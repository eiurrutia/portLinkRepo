import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { PortsService } from './shared/ports.service';

import { Port } from './port.model';

@Component({
  selector: 'app-ports',
  templateUrl: './ports.page.html',
  styleUrls: ['./ports.page.scss'],
})
export class PortsPage implements OnInit {

  public selected_option = '1';
  public text: any;
  activeItemsList = true;
  recentItemsList = false;

  activePortsList: Port[];
  recentPortsList: Port[];

  @Output() sendCount: EventEmitter <boolean> = new EventEmitter<boolean>();

  public sendRecord() {
    this.presentAlertConfirm();
  }

  constructor(public alertController: AlertController,
              private portsService: PortsService) { }

  ngOnInit() {
    this.getActivePorts();
    this.getRecentPorts();

  }

  selectOption(textValue: string) {
    this.selected_option = textValue;
  }

  changeActiveListValue() {
    this.activeItemsList = !this.activeItemsList;
  }

  changeRecentListValue() {
    this.recentItemsList = !this.recentItemsList;
  }

  getActivePorts(): void {
    this.portsService.getActivePorts().subscribe(
      portsList => {
        this.activePortsList = portsList.data;
        console.log(this.activePortsList);
      },
      error => {
        console.log(`Error fetching active ports`);
      }
    );
  }

  getRecentPorts(): void {
    this.portsService.getRecentPorts().subscribe(
      portsList => {
        this.recentPortsList = portsList.data;
        console.log(this.recentPortsList);
      },
      error => {
        console.log(`Error fetching recent ports`);
      }
    );
  }


  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Crear Nuevo Puerto',
      message: 'Quieres crear un nuevo puerto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.sendCount.emit(true);
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }


}
