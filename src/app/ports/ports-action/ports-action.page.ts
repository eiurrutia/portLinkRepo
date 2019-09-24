import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { PortsService } from '../shared/ports.service';
import { UnitsService } from '../../units/shared/units.service';

import { Port } from '../port.model';
import { Unit } from '../../units/unit.model';

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

  correctSlectedDriver = false;
  lastSelectedDriver: string;

  selectedDriver: string;
  searchBarActive = false;

  activeDriversDicc = ['Manuel Sáez',
                       'Juan Marchant',
                       'Robin Pinilla',
                       'Jorge Contreras',
                       'Gastón Cataldo',
                       'Victor Moreno',
                       'Jorge Osorio',
                       'Luis González',
                       'Cristian Espinoza',
                       'Moises Sepulveda',
                       'Miguel Vargas',
                       'Francisco Bravo',
                       'Miguel Bravo'];
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
              private portsService: PortsService,
              private unitsService: UnitsService) { }

  ngOnInit() {
    this.driversFiltered = this.activeDriversDicc;
    this.portId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getPort(this.portId);


  }

  buildPackingListHeaders() {
    this.packingListHeaders = Object.keys(this.unitsList[0]);
    const index = this.packingListHeaders.indexOf('vin', 0);
    if (index > -1) {
      this.packingListHeaders.splice(index, 1);
    }
    console.log(this.packingListHeaders);
  }

  selectItem(driver: string) {
    this.selectedDriver = driver;
    this.searchBarActive = false;
  }

  filterWithSearch(toSearch: string) {
    if (toSearch === '') {this.driversFiltered = this.activeDriversDicc;
    } else { this.driversFiltered = this.activeDriversDicc.filter((driver) => {
      return driver.toLocaleLowerCase().includes(toSearch.toLocaleLowerCase());
      });
    }
    if (this.activeDriversDicc.includes(this.selectedDriver)) {
      this.correctSlectedDriver = true;
      if (this.lastSelectedDriver !== this.selectedDriver) {
        this.changeDriver();
      }
    } else { this.correctSlectedDriver = false; }
  }

  async changeDriver() {
    const alert = await this.alertController.create({
      header: 'Cambiar Conductor',
      subHeader: 'Deseas cambiar al conductor a registrar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => { this.selectedDriver = this.lastSelectedDriver; }
        }, {
          text: 'Aceptar',
          handler: () => { this.lastSelectedDriver = this.selectedDriver; }
        }
      ]
    });
    await alert.present();
  }

  changeTabButton(nameButton: string) {
    for (const button of Object.keys(this.buttonTabActiveDicc)) {
      this.buttonTabActiveDicc[button] = false;
    }
    this.buttonTabActiveDicc[nameButton] = true;
  }

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


  getPort(portId: string): void {
    this.portsService.getPort(portId).subscribe(
      currentPort => {
        this.currentPort = currentPort;
        console.log('este es el current port');
        console.log(currentPort);
        this.getCurrentPortUnits(currentPort._id);
      },
      error => {
        console.log(`Error fetching port`);
      }
    );
  }

  getCurrentPortUnits(portId: string): void {
    this.unitsService.getUnitsByPort(portId).subscribe(
      unitsList => {
        this.unitsList = unitsList.data;
        this.buildPackingListHeaders();
        console.log('este es el units list');
        console.log(this.unitsList);
      },
      error => {
        console.log(`Error fetching units by port`);
      }
    );
  }



}
