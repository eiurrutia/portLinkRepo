import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

import { RampsService } from './shared/ramps.service';

@Component({
  selector: 'app-ramps',
  templateUrl: './ramps.page.html',
  styleUrls: ['./ramps.page.scss'],
})
export class RampsPage implements OnInit {

  // To know what is the setted option: 'main', 'new', 'edit', 'delelte' or 'list'.
  settedOption = 'main';
  ramps: any;

  diccNewRampForm = {};
  diccModifyRampForm = {};
  rampToModify: any;
  selectRampToModifyDisable = false;
  rampToDelete: any;

  loading: any;

  constructor(private alertController: AlertController,
              private loadingController: LoadingController,
              private rampsService: RampsService) { }

  async ngOnInit() {
    await this.presentLoading();
    this.getRamps();
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


  // Get ramps from backend.
  getRamps() {
    this.rampsService.getRamps().subscribe(
      rampsList => {
        this.ramps = rampsList.sort( this.comparePlatesNumber );
        this.loading.dismiss();
      },
      error => {
        this.loading.dismiss();
        console.log('Error fetching ramps from data-management: ', error);
      }
    );
  }


  // To sort by brand and then by plateNumber
  // Compare function to order truck lists
  comparePlatesNumber(truck1, truck2) {
    const plateNumber1 = truck1.plateNumber;
    const plateNumber2 = truck2.plateNumber;

    if (plateNumber1 > plateNumber2) {
      return 1;
    } else if (plateNumber1 < plateNumber2) {
      return -1;
    } else {
      return 0;
    }
  }


  // Validate plate number.
  validatePlateNumber(): boolean {
    console.log(this.diccNewRampForm['plateNumber'].replace(/\s/g, ''));
    if (this.diccNewRampForm['plateNumber'].replace(/\s/g, '').length !== 6 ) { return false;
    } else { return true; }
  }


  // Validate plate number To Modify
  validatePlateNumberToModify(): boolean {
    console.log(this.diccModifyRampForm['plateNumber'].replace(/\s/g, ''));
    if (this.diccModifyRampForm['plateNumber'].replace(/\s/g, '').length !== 6 ) { return false;
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
      header: 'Nueva Rampla',
      subHeader: `Deseas crear la siguiente rampla?`,
      message: `·Patente: ${this.diccNewRampForm['plateNumber']} <br>
                ·Modelo: ${this.diccNewRampForm['model']} <br>
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
            this.createRamp();
          }
        }
      ]
    });
    await alert.present();
  }


  // Alert miss or error info.
  async missingInfoAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error registrando rampla.',
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
      this.diccNewRampForm['plateNumber'] = this.convertPlateNumber(this.diccNewRampForm['plateNumber']);
      this.diccNewRampForm['model'] = this.convertNames(this.diccNewRampForm['model']);
      this.createNewTruckAlert();
    }

  }


  // Create new ramp in backend.
  createRamp() {
    const rampObject = {};
    rampObject['plateNumber'] = this.diccNewRampForm['plateNumber'];
    rampObject['model'] = this.diccNewRampForm['model'];
    this.rampsService.createRamp(rampObject).subscribe(
      async () => {
        console.log('Rampla creada exitosamente.');
        this.clearForm();
        this.succesfulRegistrationAlert();
        // And we update the list of trucks.
        await this.presentLoading();
        this.getRamps();
      },
      (error: any) => {
        console.log('Error al crear la rampla: ', error);
        if (error['status'] === 409) { this.repeatedRampAlert(); }
        this.failedRegistrationAlert();
      }
    );
  }


  // Repeated ramp alert
  async repeatedRampAlert() {
    const alert = await this.alertController.create({
      header: 'Error registrando la rampla.',
      subHeader: 'Erro al inscribir rampla en la base de datos.',
      message: 'Ya existe una rampla con patente ' + this.diccNewRampForm['plateNumber'] +
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
    this.diccNewRampForm['plateNumber'] = null;
    this.diccNewRampForm['model'] = null;
  }


  // Modify ramp alert.
  async modifyRampAlert(ramp: any) {
    const alert = await this.alertController.create({
      header: 'Modificar Rampla',
      subHeader: `Deseas modificar la siguiente rampla?`,
      message: `Patente: ${ramp['plateNumber']}<br>
               ·Modelo: ${ramp['model']}<br>
                `,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.selectRampToModifyDisable = false;
            this.rampToModify = null;
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.setRampInfoToModifyFields();
            this.selectRampToModifyDisable = true;
          }
        }
      ]
    });
    await alert.present();
  }


  // Set ramp to modify to edit fields.
  setRampInfoToModifyFields() {
    this.diccModifyRampForm['plateNumber'] = this.rampToModify['plateNumber'];
    this.diccModifyRampForm['model'] = this.rampToModify['model'];
  }


  // Check all info format to Modify
  validateAllInfoToModify() {
    let message = '';
    if (!this.validatePlateNumberToModify()) { message += '·Extensión de placa patente incorrecta. <br>'; }
    if (message !== '') { this.missingInfoAlert(message);
    } else {
      this.diccModifyRampForm['plateNumber'] = this.convertPlateNumber(this.diccModifyRampForm['plateNumber']);
      this.diccModifyRampForm['model'] = this.convertNames(this.diccModifyRampForm['model']);
      this.updateRampInfoAlert();
    }
  }


  // Update ramp info alert.
  async updateRampInfoAlert() {
    const alert = await this.alertController.create({
      header: 'Actualizar Rampla',
      subHeader: `Deseas actualizar la información de la siguiente rampla?`,
      message: `Patente: ${this.diccModifyRampForm['plateNumber']}<br>
               ·Modelo: ${this.diccModifyRampForm['model']}<br>
                `,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.clearModifyForm();
            this.rampToModify = null;
            this.selectRampToModifyDisable = false;
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.updateRamp(this.rampToModify['_id']);
            this.selectRampToModifyDisable = false;
          }
        }
      ]
    });
    await alert.present();
  }


  // Clear form.
  clearModifyForm() {
    this.diccModifyRampForm['plateNumber'] = null;
    this.diccModifyRampForm['model'] = null;
  }


  // Update ramp from backend.
  updateRamp(rampId: string) {
    const updateRampObject = {};
    updateRampObject['plateNumber'] = this.diccModifyRampForm['plateNumber'];
    updateRampObject['model'] = this.diccModifyRampForm['model'];
    this.rampsService.updateRamp(rampId, updateRampObject).subscribe(
      async (rampUpdated) => {
        this.clearModifyForm();
        this.selectRampToModifyDisable = false;
        this.rampToModify = null;
        this.succesfulRegistrationAlert();
        console.log('Rampla actualizada: ', rampUpdated);
        // And we update the list of ramps.
        await this.presentLoading();
        this.getRamps();
      },
      error => {
        this.clearModifyForm();
        this.selectRampToModifyDisable = false;
        this.rampToModify = null;
        this.failedRegistrationAlert();
        console.log('Error updating ramp: ', error);
      }
    );
  }


  // Succesful registration alert.
  async succesfulRegistrationAlert() {
    const alert = await this.alertController.create({
      header: 'Rampla Registrada',
      subHeader: 'Rampla registrada exitosamente!',
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
      header: 'Error Registrando Rampla',
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


  // Delete ramp alert.
  async deleteRampAlert() {
    const alert = await this.alertController.create({
      header: 'Eliminar Rampla',
      subHeader: `Deseas eliminar del listado al siguiente rampla:`,
      message: `Patente: ${this.rampToDelete['plateNumber']}<br>
               ·Modelo: ${this.rampToDelete['model']}<br>
                `,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.rampToDelete = null;
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.deleteRamp(this.rampToDelete['_id']);
          }
        }
      ]
    });
    await alert.present();
  }


  // Delete ramp in backend
  deleteRamp(rampId: string) {
    this.rampsService.deleteRamp(rampId).subscribe(
      async () => {
        this.succesfulDeleteAlert();
        this.rampToDelete = null;
        console.log('Rampla eliminada correctamente.');
        // And we update the list of ramps.
        await this.presentLoading();
        this.getRamps();
      },
      error => {
        console.log('Error eliminando rampla: ', error);
      }
    );
  }


  // Succesful registration alert.
  async succesfulDeleteAlert() {
    const alert = await this.alertController.create({
      header: 'Rampla Eliminada',
      subHeader: 'Rampla eliminada exitosamente!',
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
