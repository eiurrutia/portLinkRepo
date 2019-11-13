import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

import { TrucksService } from './shared/trucks.service';

@Component({
  selector: 'app-trucks',
  templateUrl: './trucks.page.html',
  styleUrls: ['./trucks.page.scss'],
})
export class TrucksPage implements OnInit {

  // To know what is the setted option: 'main', 'new', 'edit', 'delelte' or 'list'.
  settedOption = 'main';
  trucks: any;

  diccNewTruckForm = {};
  diccModifyTruckForm = {};
  truckToModify: any;
  selectTruckToModifyDisable = false;
  truckToDelete: any;

  loading: any;

  constructor(private alertController: AlertController,
              private loadingController: LoadingController,
              private trucksService: TrucksService) { }

  async ngOnInit() {
    await this.presentLoading();
    this.getTrucks();
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


  // To set value to view control variable.
  changeViewOption(option: string) {
    this.settedOption = option;
  }


  // Get trucks from backend.
  getTrucks() {
    this.trucksService.getTrucks().subscribe(
      trucksList => {
        this.trucks = trucksList.sort( this.comparePlatesNumberAndBrand );
        this.loading.dismiss();
      },
      error => {
        this.loading.dismiss();
        console.log('Error fetching trucks from data-management: ', error);
      }
    );
  }


  // To sort by brand and then by plateNumber
  // Compare function to order truck lists
  comparePlatesNumberAndBrand(truck1, truck2) {
    const brand1 = truck1.brand;
    const brand2 = truck2.brand;
    const plateNumber1 = truck1.plateNumber;
    const plateNumber2 = truck2.plateNumber;

    if (brand1 > brand2) {
      return 1;
    } else if (brand1 < brand2) {
      return -1;
    } else {
      if (plateNumber1 > plateNumber2) {
        return 1;
      } else {
        return -1;
      }
    }
  }


  // Validate plate number.
  validatePlateNumber(): boolean {
    console.log(this.diccNewTruckForm['plateNumber'].replace(/\s/g, ''));
    if (this.diccNewTruckForm['plateNumber'].replace(/\s/g, '').length !== 6 ) { return false;
    } else { return true; }
  }


  // Validate plate number To Modify
  validatePlateNumberToModify(): boolean {
    console.log(this.diccModifyTruckForm['plateNumber'].replace(/\s/g, ''));
    if (this.diccModifyTruckForm['plateNumber'].replace(/\s/g, '').length !== 6 ) { return false;
    } else { return true; }
  }


  // Convert plate number in correct format.
  convertPlateNumber(plateNumber: string): string {
    return plateNumber.replace(/\s/g, '').toUpperCase();
  }


  // Convert brand or model in correct format.
  convertNames(name: string): string {
    let list = name.split(' ');
    list = list.map( word => {
        return word.toLocaleLowerCase().replace(word.toLocaleLowerCase()[0], word.toLocaleLowerCase()[0].toUpperCase());
      });
    return list.join(' ');
  }


  // Alert to create a new truck.
  async createNewTruckAlert() {
    const alert = await this.alertController.create({
      header: 'Nuevo Camión',
      subHeader: `Deseas crear el siguiente camión?`,
      message: `·Patente: ${this.diccNewTruckForm['plateNumber']} <br>
                ·Marca: ${this.diccNewTruckForm['brand']} <br>
                ·Modelo: ${this.diccNewTruckForm['model']} <br>
                `,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Aceptar',
          handler: () => {
            this.createTruck();
          }
        }
      ]
    });
    await alert.present();
  }


  // Alert miss or error info.
  async missingInfoAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error registrando camión.',
      subHeader: 'Hay información en formato erróneo.',
      message: message,
      buttons: [
        {
          text: 'Ok',
          handler: () => {}
        }
      ]
    });
    await alert.present();
  }


  // Check all info format
  validateAllInfo() {
    let message = '';
    if (!this.validatePlateNumber()) { message += '·Extensión de placa patente incorrecta. <br>'; }
    if (message !== '') { this.missingInfoAlert(message);
    } else {
      this.diccNewTruckForm['plateNumber'] = this.convertPlateNumber(this.diccNewTruckForm['plateNumber']);
      this.diccNewTruckForm['brand'] = this.convertNames(this.diccNewTruckForm['brand']);
      this.diccNewTruckForm['model'] = this.convertNames(this.diccNewTruckForm['model']);
      this.createNewTruckAlert();
    }

  }


  // Create new driver in backend.
  createTruck() {
    const truckObject = {};
    truckObject['plateNumber'] = this.diccNewTruckForm['plateNumber'];
    truckObject['brand'] = this.diccNewTruckForm['brand'];
    truckObject['model'] = this.diccNewTruckForm['model'];
    this.trucksService.createTruck(truckObject).subscribe(
      async () => {
        console.log('Camión creado exitosamente');
        this.clearForm();
        this.succesfulRegistrationAlert();
        // And we update the list of trucks.
        await this.presentLoading();
        this.getTrucks();
      },
      (error: any) => {
        console.log('Error al crear el camión: ', error);
        if (error['status'] === 409) { this.repeatedTruckAlert(); }
        this.failedRegistrationAlert();
      }
    );
  }


  // Repeated truck alert
  async repeatedTruckAlert() {
    const alert = await this.alertController.create({
      header: 'Error registrando unidad.',
      subHeader: 'Erro al inscribir camión en la base de datos.',
      message: 'Ya existe un camión con patente ' + this.diccNewTruckForm['plateNumber'] +
                ' en la base de datos.',
      buttons: [
        {
          text: 'Ok',
          handler: () => {}
        }
      ]
    });
    await alert.present();
  }


  // Clear form.
  clearForm() {
    this.diccNewTruckForm['plateNumber'] = null;
    this.diccNewTruckForm['brand'] = null;
    this.diccNewTruckForm['model'] = null;
  }


  // Modify truck alert.
  async modifyTruckAlert(truck: any) {
    const alert = await this.alertController.create({
      header: 'Modificar Camión',
      subHeader: `Deseas modificar el siguiente camión:`,
      message: `Patente: ${truck['plateNumber']}<br>
               ·Marca: ${truck['brand']}<br>
               ·Modelo: ${truck['model']}<br>
                `,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.selectTruckToModifyDisable = false;
            this.truckToModify = null;
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.setTruckInfoToModifyFields();
            this.selectTruckToModifyDisable = true;
          }
        }
      ]
    });
    await alert.present();
  }


  // Set truck to modify to edit fields.
  setTruckInfoToModifyFields() {
    this.diccModifyTruckForm['plateNumber'] = this.truckToModify['plateNumber'];
    this.diccModifyTruckForm['brand'] = this.truckToModify['brand'];
    this.diccModifyTruckForm['model'] = this.truckToModify['model'];
  }


  // Check all info format to Modify
  validateAllInfoToModify() {
    let message = '';
    if (!this.validatePlateNumberToModify()) { message += '·Extensión de placa patente incorrecta. <br>'; }
    if (message !== '') { this.missingInfoAlert(message);
    } else {
      this.diccModifyTruckForm['plateNumber'] = this.convertPlateNumber(this.diccModifyTruckForm['plateNumber']);
      this.diccModifyTruckForm['brand'] = this.convertNames(this.diccModifyTruckForm['brand']);
      this.diccModifyTruckForm['model'] = this.convertNames(this.diccModifyTruckForm['model']);
      this.updateTruckInfoAlert();
    }
  }


  // Update truck info alert.
  async updateTruckInfoAlert() {
    const alert = await this.alertController.create({
      header: 'Actualizar Camión',
      subHeader: `Deseas actualizar la información del siguiente camión:`,
      message: `Patente: ${this.diccModifyTruckForm['plateNumber']}<br>
               ·Marca: ${this.diccModifyTruckForm['brand']}<br>
               ·Modelo: ${this.diccModifyTruckForm['model']}<br>
                `,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.clearModifyForm();
            this.truckToModify = null;
            this.selectTruckToModifyDisable = false;
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.updateTruck(this.truckToModify['_id']);
            this.selectTruckToModifyDisable = false;
          }
        }
      ]
    });
    await alert.present();
  }


  // Clear form.
  clearModifyForm() {
    this.diccModifyTruckForm['plateNumber'] = null;
    this.diccModifyTruckForm['brand'] = null;
    this.diccModifyTruckForm['model'] = null;
  }


  // Update truck from backend.
  updateTruck(truckId: string) {
    const updateTruckObject = {};
    updateTruckObject['plateNumber'] = this.diccModifyTruckForm['plateNumber'];
    updateTruckObject['brand'] = this.diccModifyTruckForm['brand'];
    updateTruckObject['model'] = this.diccModifyTruckForm['model'];
    this.trucksService.updateTruck(truckId, updateTruckObject).subscribe(
      async (truckUpdated) => {
        this.clearModifyForm();
        this.selectTruckToModifyDisable = false;
        this.truckToModify = null;
        this.succesfulRegistrationAlert();
        console.log('Conductor actualizado: ', truckUpdated);
        // And we update the list of trucks.
        await this.presentLoading();
        this.getTrucks();
      },
      error => {
        this.clearModifyForm();
        this.selectTruckToModifyDisable = false;
        this.truckToModify = null;
        this.failedRegistrationAlert();
        console.log('Error updating truck: ', error);
      }
    );
  }


  // Succesful registration alert.
  async succesfulRegistrationAlert() {
    const alert = await this.alertController.create({
      header: 'Camión Registrado',
      subHeader: 'Camión registrado exitosamente!',
      buttons: [
        {
          text: 'Ok',
          handler: () => {}
        }
      ]
    });
    await alert.present();
  }


  // Failed registration alert.
  async failedRegistrationAlert() {
    const alert = await this.alertController.create({
      header: 'Error Registrando Camión',
      subHeader: 'Ha ocurrido un error en el registro. Inténtelo nuevamente.',
      buttons: [
        {
          text: 'Ok',
          handler: () => {}
        }
      ]
    });
    await alert.present();
  }


  // Delete truck alert.
  async deleteTruckAlert() {
    const alert = await this.alertController.create({
      header: 'Eliminar Camión',
      subHeader: `Deseas eliminar del listado al siguiente camión:`,
      message: `Patente: ${this.truckToDelete['plateNumber']}<br>
               ·Marca: ${this.truckToDelete['brand']}<br>
               ·Modelo: ${this.truckToDelete['model']}<br>
                `,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.truckToDelete = null;
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.deleteTruck(this.truckToDelete['_id']);
          }
        }
      ]
    });
    await alert.present();
  }


  // Delete truck in backend
  deleteTruck(truckId: string) {
    this.trucksService.deleteTruck(truckId).subscribe(
      async () => {
        this.succesfulDeleteAlert();
        this.truckToDelete = null;
        console.log('Camión eliminado correctamente.');
        // And we update the list of drivers.
        await this.presentLoading();
        this.getTrucks();
      },
      error => {
        console.log('Error eliminando camión: ', error);
      }
    );
  }


  // Succesful registration alert.
  async succesfulDeleteAlert() {
    const alert = await this.alertController.create({
      header: 'Camión Eliminado',
      subHeader: 'Camión eliminado exitosamente!',
      buttons: [
        {
          text: 'Ok',
          handler: () => {}
        }
      ]
    });
    await alert.present();
  }


}
