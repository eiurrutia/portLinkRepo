import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import { PortsService } from './shared/ports.service';
import { LapsService } from '../laps/shared/laps.service';
import { UnitsService } from '../units/shared/units.service';

import { Port } from './port.model';

import * as moment from 'moment-timezone';

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

  message: any;

  @Output() sendCount: EventEmitter <boolean> = new EventEmitter<boolean>();

  public sendRecord() {
    this.presentAlertConfirm();
  }

  constructor(public alertController: AlertController,
              public router: Router,
              private portsService: PortsService,
              private lapsService: LapsService,
              private unitsService: UnitsService) { }

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
        console.log(`Error fetching active ports: ${error}`);
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
        console.log(`Error fetching recent ports: ${error}`);
      }
    );
  }


  // Get Date format to display in front.
  getCleanDate(date: Date, format: string): string {
    return moment.tz(date, 'America/Santiago').format(format);
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
            console.log('Confirm Cancel:', blah);
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.sendCount.emit(true);
            this.router.navigateByUrl('/user-menu/ports/new-port');
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlertDelete(port: any) {
    const alert = await this.alertController.create({
      header: 'Eliminar Puerto',
      message: `Quieres eliminar el puerto ${port.shipName} ?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel:', blah);
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.deletePort(port);
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }

  deletePort(port: any) {
    // First we delete the units associated to this port.
    this.unitsService.getUnitsByPort(port._id).subscribe(
      unitsList => {
        console.log(unitsList);
        unitsList.data.map( unit => { this.unitsService.deleteUnit(unit._id).subscribe(
          unitDeleted => {
            this.message = 'Unit deleted successfully: ' + unitDeleted._id;
          },
          error => {
            this.message = 'Error deleting a unit: ' + error;
          }
        ); });
        console.log('All port units deleted');

        // Then we delete all the laps associated to this port.
        this.lapsService.getLapsByPort(port._id).subscribe(
          lapsList => {
            console.log(lapsList);
            lapsList.data.map( lap => { this.lapsService.deleteLap(lap._id).subscribe(
              lapDeleted => {
                this.message = 'Lap deleted successfully: ' + lapDeleted._id;
              },
              error => {
                this.message = 'Error deleting a lap: ' + error;
              }
            ); });
            console.log('All port laps deleted');
          },
          error => {
            console.log('Error getting laps to delete by port: ', error);
          }
        );

        // And then we delete the port.
        this.portsService.deletePort(port._id).subscribe(
          deletedPort => {
            console.log('Port deleted successfully: ', deletedPort._id);
            // And then we update the active ports list.
            this.getActivePorts();
          },
          error => {
            console.log('Error deleting port: ', error);
          }
        );
      },
      error => {
        console.log('Error getting units to delete by port: ', error);
      }
    );
  }
}
