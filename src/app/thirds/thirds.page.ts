import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

import { ThirdsService } from './shared/thirds.service';

@Component({
  selector: 'app-thirds',
  templateUrl: './thirds.page.html',
  styleUrls: ['./thirds.page.scss'],
})
export class ThirdsPage implements OnInit {

  // To know what is the setted option: 'main', 'new', 'edit', 'delelte' or 'list'.
  settedOption = 'main';
  thirds: any;

  diccNewThirdName: string;
  diccModifyThirdName: string;
  thirdToModify: any;
  selectThirdToModifyDisable = false;
  thirdToDelete: any;

  loading: any;

  constructor(private alertController: AlertController,
              private loadingController: LoadingController,
              private thirdsService: ThirdsService) { }

  async ngOnInit() {
    await this.presentLoading();
    this.getThirds();
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


  // Get thirds from backend.
  getThirds() {
    this.thirdsService.getThirds().subscribe(
      thirdsList => {
        this.thirds = thirdsList;
        this.loading.dismiss();
      },
      error => {
        this.loading.dismiss();
        console.log('Error fetching thirds from data-management: ', error);
      }
    );
  }

  // Convert name in correct format.
  convertNames(name: string): string {
    let list = name.split(' ');
    list = list.map( word => {
        return word.toLocaleLowerCase().replace(word.toLocaleLowerCase()[0], word.toLocaleLowerCase()[0].toUpperCase());
      });
    return list.join(' ');
  }


  // Check all info format
  validateAllInfo() {
    this.diccNewThirdName = this.convertNames(this.diccNewThirdName);
    this.createNewThirdAlert();
  }

  // Alert to create a new third.
  async createNewThirdAlert() {
    const alert = await this.alertController.create({
      header: 'Nuevo Tercero',
      subHeader: `Deseas crear el siguiente tercero?`,
      message: `·Nombre: ${this.diccNewThirdName} <br>
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
            this.createThird();
          }
        }
      ]
    });
    await alert.present();
  }


  // Create new third in backend.
  createThird() {
    const thirdObject = {};
    thirdObject['name'] = this.diccNewThirdName;
    this.thirdsService.createThird(thirdObject).subscribe(
      async () => {
        console.log('Tercero creado exitosamente.');
        this.clearForm();
        this.succesfulRegistrationAlert();
        // And we update the list of trucks.
        await this.presentLoading();
        this.getThirds();
      },
      (error: any) => {
        console.log('Error al crear el tercero: ', error);
        if (error['status'] === 409) { this.repeatedThirdAlert(); }
        this.failedRegistrationAlert();
      }
    );
  }


  // Repeated third alert
  async repeatedThirdAlert() {
    const alert = await this.alertController.create({
      header: 'Error registrando el tercero.',
      subHeader: 'Erro al inscribir el tercero en la base de datos.',
      message: 'Ya existe un tercero con nombre ' + this.diccNewThirdName +
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
    this.diccNewThirdName = null;
  }


  // Modify third alert.
  async modifyThirdAlert(third: any) {
    const alert = await this.alertController.create({
      header: 'Modificar Tercero',
      subHeader: `Deseas modificar el siguiente tercero?`,
      message: `Nombre: ${third['name']}<br>
                `,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.selectThirdToModifyDisable = false;
            this.thirdToModify = null;
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.setThirdInfoToModifyFields();
            this.selectThirdToModifyDisable = true;
          }
        }
      ]
    });
    await alert.present();
  }


  // Set third to modify to edit fields.
  setThirdInfoToModifyFields() {
    this.diccModifyThirdName = this.thirdToModify['name'];
  }


  // Check all info format to Modify
  validateAllInfoToModify() {
    this.diccModifyThirdName = this.convertNames(this.diccModifyThirdName);
    this.updateThirdInfoAlert();
  }


  // Update third info alert.
  async updateThirdInfoAlert() {
    const alert = await this.alertController.create({
      header: 'Actualizar Tercero',
      subHeader: `Deseas actualizar la información del siguiente tercero?`,
      message: `Nombre: ${this.diccModifyThirdName}<br>
                `,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.diccModifyThirdName = null;
            this.thirdToModify = null;
            this.selectThirdToModifyDisable = false;
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.updateThird(this.thirdToModify['_id']);
            this.selectThirdToModifyDisable = false;
          }
        }
      ]
    });
    await alert.present();
  }


  // Update third from backend.
  updateThird(thirdId: string) {
    const updateThirdObject = {};
    updateThirdObject['name'] = this.diccModifyThirdName;
    this.thirdsService.updateThird(thirdId, updateThirdObject).subscribe(
      async (thirdUpdated) => {
        this.diccModifyThirdName = null;
        this.selectThirdToModifyDisable = false;
        this.thirdToModify = null;
        this.succesfulRegistrationAlert();
        console.log('Third actualizado: ', thirdUpdated);
        // And we update the list of thirds.
        await this.presentLoading();
        this.getThirds();
      },
      error => {
        this.diccModifyThirdName = null;
        this.selectThirdToModifyDisable = false;
        this.thirdToModify = null;
        this.failedRegistrationAlert();
        console.log('Error updating third: ', error);
      }
    );
  }


  // Succesful registration alert.
  async succesfulRegistrationAlert() {
    const alert = await this.alertController.create({
      header: 'Tercero Registrado',
      subHeader: 'Tercero registrado exitosamente!',
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
      header: 'Error Registrando Tercero',
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


  // Delete third alert.
  async deleteThirdAlert() {
    const alert = await this.alertController.create({
      header: 'Eliminar Tercero',
      subHeader: `Deseas eliminar del listado al siguiente tercero?`,
      message: `Nombre: ${this.thirdToDelete['name']}<br>
                `,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.thirdToDelete = null;
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.deleteThird(this.thirdToDelete['_id']);
          }
        }
      ]
    });
    await alert.present();
  }


  // Delete third in backend
  deleteThird(thirdId: string) {
    this.thirdsService.deleteThird(thirdId).subscribe(
      async () => {
        this.succesfulDeleteAlert();
        this.thirdToDelete = null;
        console.log('Tercero eliminado correctamente.');
        // And we update the list of thirds.
        await this.presentLoading();
        this.getThirds();
      },
      error => {
        console.log('Error eliminando tercero: ', error);
      }
    );
  }


  // Succesful registration alert.
  async succesfulDeleteAlert() {
    const alert = await this.alertController.create({
      header: 'Tercero Eliminado',
      subHeader: 'Tercero eliminado exitosamente!',
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
