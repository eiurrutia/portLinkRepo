import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

import { ImportersService } from './shared/importers.service';

@Component({
  selector: 'app-importers',
  templateUrl: './importers.page.html',
  styleUrls: ['./importers.page.scss'],
})
export class ImportersPage implements OnInit {

  // To know what is the setted option: 'main', 'new', 'edit', 'delelte' or 'list'.
  settedOption = 'main';
  importers: any;

  diccNewImporterForm = {};
  diccModifyImporterForm = {};
  importerToModify: any;
  selectImporterToModifyDisable = false;
  importerToDelete: any;

  loading: any;

  constructor(private alertController: AlertController,
              private loadingController: LoadingController,
              private importersService: ImportersService ) { }

  async ngOnInit() {
    await this.presentLoading();
    this.getImporters();
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


  // Get importes from backend.
  getImporters() {
    this.importersService.getImporters().subscribe(
      importersList => {
        this.importers = importersList.data.sort( this.compareNames );
        this.loading.dismiss();
      },
      error => {
        this.loading.dismiss();
        console.log('Error fetching importers from data-management: ', error);
      }
    );
  }


  // To sort by importer name
  // Compare function to order importers lists
  compareNames(importer1, importer2) {
    if (importer1.name > importer2.name) {
      return 1;
    } else if (importer1.name < importer2.name) {
      return -1;
    } else {
      return 0;
    }
  }


  // Convert name in correct format.
  convertNames(name: string): string {
    let list = name.split(' ');
    list = list.map( word => {
        return word.toLocaleLowerCase().replace(word.toLocaleLowerCase()[0], word.toLocaleLowerCase()[0].toUpperCase());
      });
    return list.join(' ');
  }


  // Alert to create a new importer.
  async createNewImporterAlert() {
    const alert = await this.alertController.create({
      header: 'Nuevo Importador',
      subHeader: `Deseas crear al siguiente importador/cliente?`,
      message: `·Nombre: ${this.diccNewImporterForm['name']} <br>
                 Tarifas:<br>
                ·Pequeño: ${this.diccNewImporterForm['small']} <br>
                ·Mediano: ${this.diccNewImporterForm['medium']} <br>
                ·Grande: ${this.diccNewImporterForm['big']} <br>
                ·Extra Grande: ${this.diccNewImporterForm['extra']} <br>
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
            this.createImporter();
          }
        }
      ]
    });
    await alert.present();
  }


  // Alert miss or error info.
  async missingInfoAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error registrando importador.',
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


  // Create new importer in backend.
  createImporter() {
    const importerObject = {};
    importerObject['name'] = this.diccNewImporterForm['name'];
    importerObject['rates'] = {};
    importerObject['rates']['small'] = this.diccNewImporterForm['small'];
    importerObject['rates']['medium'] = this.diccNewImporterForm['medium'];
    importerObject['rates']['big'] = this.diccNewImporterForm['big'];
    importerObject['rates']['extra'] = this.diccNewImporterForm['extra'];
    this.importersService.createImporter(importerObject).subscribe(
      async () => {
        console.log('Importador/cliente creado exitosamente.');
        this.clearForm();
        this.succesfulRegistrationAlert();
        // And we update the list of trucks.
        await this.presentLoading();
        this.getImporters();
      },
      (error: any) => {
        console.log('Error al crear el importador: ', error);
        if (error['status'] === 409) { this.repeatedImporterAlert(); }
        this.failedRegistrationAlert();
      }
    );
  }


  // Repeated importador alert
  async repeatedImporterAlert() {
    const alert = await this.alertController.create({
      header: 'Error registrando importador.',
      subHeader: 'Error al inscribir importador en la base de datos.',
      message: 'Ya existe un importador con nombre ' + this.diccNewImporterForm['name'] +
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
    this.diccNewImporterForm['name'] = null;
    this.diccNewImporterForm['small'] = null;
    this.diccNewImporterForm['medium'] = null;
    this.diccNewImporterForm['big'] = null;
    this.diccNewImporterForm['extra'] = null;
  }


  // Modify importer alert.
  async modifyImporterAlert(importer: any) {
    const alert = await this.alertController.create({
      header: 'Modificar Importador',
      subHeader: `Deseas modificar el siguiente importador?`,
      message: `Nombre: ${importer['name']}<br>
                Tarifas:<br>
               ·Pequeño: ${importer['rates']['small']}<br>
               ·Mediano: ${importer['rates']['medium']}<br>
               ·Grande: ${importer['rates']['big']}<br>
               ·Extra Grande: ${importer['rates']['extra']}<br>
                `,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.selectImporterToModifyDisable = false;
            this.importerToModify = null;
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.setImporterInfoToModifyFields();
            this.selectImporterToModifyDisable = true;
          }
        }
      ]
    });
    await alert.present();
  }


  // Set importer to modify to edit fields.
  setImporterInfoToModifyFields() {
    this.diccModifyImporterForm['name'] = this.importerToModify['name'];
    this.diccModifyImporterForm['small'] = this.importerToModify['rates']['small'];
    this.diccModifyImporterForm['medium'] = this.importerToModify['rates']['medium'];
    this.diccModifyImporterForm['big'] = this.importerToModify['rates']['big'];
    this.diccModifyImporterForm['extra'] = this.importerToModify['rates']['extra'];
  }


  // Check all info format to Modify
  validateAllInfoToModify() {
    this.diccModifyImporterForm['name'] = this.convertNames(this.diccModifyImporterForm['name']);
    this.updateImporterInfoAlert();
  }


  // Update importer info alert.
  async updateImporterInfoAlert() {
    const alert = await this.alertController.create({
      header: 'Actualizar Importador',
      subHeader: `Deseas actualizar la información del siguiente importador?`,
      message: `Patente: ${this.diccModifyImporterForm['name']}<br>
                Tarifas:<br>
               ·Pequeño: ${this.diccModifyImporterForm['small']}<br>
               ·Mediano: ${this.diccModifyImporterForm['medium']}<br>
               ·Grande: ${this.diccModifyImporterForm['big']}<br>
               ·Extra Grande: ${this.diccModifyImporterForm['extra']}<br>
                `,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.clearModifyForm();
            this.importerToModify = null;
            this.selectImporterToModifyDisable = false;
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.updateImporter(this.importerToModify['_id']);
            this.selectImporterToModifyDisable = false;
          }
        }
      ]
    });
    await alert.present();
  }


  // Clear form.
  clearModifyForm() {
    this.diccModifyImporterForm['name'] = null;
    this.diccModifyImporterForm['small'] = null;
    this.diccModifyImporterForm['medium'] = null;
    this.diccModifyImporterForm['big'] = null;
    this.diccModifyImporterForm['extra'] = null;
  }


  // Update importer from backend.
  updateImporter(importerId: string) {
    const updateImporterObject = {};
    updateImporterObject['name'] = this.diccModifyImporterForm['name'];
    updateImporterObject['rates'] = {};
    updateImporterObject['rates']['small'] = this.diccModifyImporterForm['small'];
    updateImporterObject['rates']['medium'] = this.diccModifyImporterForm['medium'];
    updateImporterObject['rates']['big'] = this.diccModifyImporterForm['big'];
    updateImporterObject['rates']['extra'] = this.diccModifyImporterForm['extra'];

    this.importersService.updateImporter(importerId, updateImporterObject).subscribe(
      async (importerUpdated) => {
        this.clearModifyForm();
        this.selectImporterToModifyDisable = false;
        this.importerToModify = null;
        this.succesfulRegistrationAlert();
        console.log('Importador actualizado: ', importerUpdated);
        // And we update the list of importes.
        await this.presentLoading();
        this.getImporters();
      },
      error => {
        this.clearModifyForm();
        this.selectImporterToModifyDisable = false;
        this.importerToModify = null;
        this.failedRegistrationAlert();
        console.log('Error updating importer: ', error);
      }
    );
  }


  // Succesful registration alert.
  async succesfulRegistrationAlert() {
    const alert = await this.alertController.create({
      header: 'Importador Registrado',
      subHeader: 'Importador registrado exitosamente!',
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
      header: 'Error Registrando Importador',
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


  // Delete importer alert.
  async deleteImporterAlert() {
    const alert = await this.alertController.create({
      header: 'Eliminar Importador',
      subHeader: `Deseas eliminar del listado al siguiente importador:`,
      message: `Nombre: ${this.importerToDelete['name']}<br>
                `,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.importerToDelete = null;
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.deleteImporter(this.importerToDelete['_id']);
          }
        }
      ]
    });
    await alert.present();
  }


  // Delete importer in backend
  deleteImporter(importerId: string) {
    this.importersService.deleteImporter(importerId).subscribe(
      async () => {
        this.succesfulDeleteAlert();
        this.importerToDelete = null;
        console.log('Importador eliminado correctamente.');
        // And we update the list of importers.
        await this.presentLoading();
        this.getImporters();
      },
      error => {
        console.log('Error eliminando importador: ', error);
      }
    );
  }


  // Succesful registration alert.
  async succesfulDeleteAlert() {
    const alert = await this.alertController.create({
      header: 'Importador Eliminado',
      subHeader: 'Importador eliminado exitosamente!',
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
