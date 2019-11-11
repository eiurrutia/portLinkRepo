import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

import { DriversService } from './shared/drivers.service';


@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.page.html',
  styleUrls: ['./drivers.page.scss'],
})
export class DriversPage implements OnInit {

  // To know what is the setted option: 'main', 'new', 'edit', 'delelte' or 'list'.
  settedOption = 'main';
  drivers: any;

  diccNewDriverForm = {};

  loading: any;

  constructor(private alertController: AlertController,
              private loadingController: LoadingController,
              private driversService: DriversService) { }

  async ngOnInit() {
    await this.presentLoading();
    this.getDivers();
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
    console.log(this.settedOption);
  }


  // Get drivers from backend.
  getDivers() {
    this.driversService.getDrivers().subscribe(
      driversList => {
        this.drivers = driversList.sort( this.compareLastNames );
        this.loading.dismiss();
      },
      error => {
        this.loading.dismiss();
        console.log('Error fetching drivers from data-management: ', error);
      }
    );
  }


  // To sort by last name
  // Compare function to order drivers lists
  compareLastNames(driver1, driver2) {
    const lastName1 = driver1.name.split(' ')[1];
    const lastName2 = driver2.name.split(' ')[1];
    const secondLastName1 = driver1.name.split(' ')[2];
    const secondLastName2 = driver2.name.split(' ')[2];

    if (lastName1 > lastName2) {
      return 1;
    } else if (lastName1 < lastName2) {
      return -1;
    } else {
      if (secondLastName1 > secondLastName2) {
        return 1;
      } else {
        return -1;
      }
    }
  }


  // Validate Names and Lastnames
  validateNamesAndLastNames(toValidate: string): boolean {
    console.log(this.diccNewDriverForm[toValidate].split(' '));
    if (this.diccNewDriverForm[toValidate].split(' ').length > 1) { return false;
    } else { return true; }
  }


  // Convert Names and Lastnames in correct format.
  convertNames(name: string): string {
    return name.toLocaleLowerCase().replace(name.toLocaleLowerCase()[0], name.toLocaleLowerCase()[0].toUpperCase());
  }


  // Convert all names and Last namespace
  convertNamesAndLastnames() {
    this.diccNewDriverForm['name'] = this.convertNames(this.diccNewDriverForm['name']);
    this.diccNewDriverForm['fatherLastName'] = this.convertNames(this.diccNewDriverForm['fatherLastName']);
    this.diccNewDriverForm['motherLastName'] = this.convertNames(this.diccNewDriverForm['motherLastName']);
  }


  // Check Driver rut
  checkRut(rut: string): any {
    // Remove the dots
    let value = rut.replace(/\./g, '');
    // Remove the hyphen
    value = value.replace(/\-/g, '');

    // Divide by body and check digit.
    const body = value.slice(0, -1);
    const digit = value.slice(-1).toUpperCase();

    // Rut format
    rut = body + '-' + digit;

    // Check min length of body ej. (n.nnn.nnn)
    if (body.length < 7) {
      console.log('RUT invalid by extension.');
      return {'result': false, 'content': 'invalid extension'};
    }

    // Check correct digit.
    let sum = 0;
    let multiple = 2;

    // For each digit of body
    for (let i = 1; i <= body.length; i++) {

        // Get product with the corresponding multiple.
        const index = multiple * parseInt(value[body.length - i], 0);

        // Sum to the general count
        sum = sum + index;

        // Multiple inside the range [2,7]
        if (multiple < 7) { multiple = multiple + 1; } else { multiple = 2; }
    }

    // Calculate the digit with mod 11
    const dvExpected = 11 - (sum % 11);

    // Specials cases (0 y K)
    let readedDigit;
    readedDigit = (digit === 'K') ? 10 : ((digit === '0' ) ? 11 : parseInt(digit, 0));


    // Check if digit is correct
    if (dvExpected !== readedDigit) {
      console.log('RUT invalid by digit.');
      return {'result': false, 'content': 'invalid digit'};
    }

    // Is valid!
    console.log('is valid!');
    return {'result': true, 'content': rut };
  }


  // Set format to correct rut.
  setFormatToCorrectRut(rut: string): string {
    const body = rut.split('-')[0];
    let newString = body;
    const dotsNumber = Math.floor(body.length / 3);
    for (let i = 1; i <= dotsNumber; i++) {
      newString = newString.slice(0, body.length - i * 3) + '.' + newString.slice(body.length - i * 3);
    }
    newString = newString + '-' + rut.split('-')[1];
    return newString;
  }


  // Alert to create a new driver.
  async createNewDriverAlert() {
    const alert = await this.alertController.create({
      header: 'Nuevo Conductor',
      subHeader: `Deseas crear el siguiente conductor:`,
      message: `·Nombre: ${this.diccNewDriverForm['name']}
                           ${this.diccNewDriverForm['fatherLastName']}
                           ${this.diccNewDriverForm['motherLastName']} <br>
               ·Rut: ${this.diccNewDriverForm['rut']} <br>
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
            this.createDriver();
          }
        }
      ]
    });
    await alert.present();
  }


  // Alert miss or error info.
  async missingInfoAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error registrando unidad.',
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
    if (!this.validateNamesAndLastNames('name')) { message += '·Se debe registrar un solo nombre. <br>'; }
    if (!this.validateNamesAndLastNames('fatherLastName')) { message += '·Se debe registrar un solo apellido paterno.<br>'; }
    if (!this.validateNamesAndLastNames('motherLastName')) { message += '·Se debe registrar un solo apellido materno.<br>'; }
    const rutResponse = this.checkRut(this.diccNewDriverForm['rut']);
    if (!rutResponse['result']) {
      if (rutResponse['content'] === 'invalid digit') { message += '·Dígito verificador de rut erróneo.<br>';
      } else { message += '·Extensión del rut errónea.<br>'; }
    }
    if (!this.diccNewDriverForm['unionized']) { message += '·Falta condición de sindicato del conductor.<br>'; }
    if (message !== '') { this.missingInfoAlert(message);
    } else {
      this.diccNewDriverForm['name'] = this.convertNames(this.diccNewDriverForm['name']);
      this.diccNewDriverForm['fatherLastName'] = this.convertNames(this.diccNewDriverForm['fatherLastName']);
      this.diccNewDriverForm['motherLastName'] = this.convertNames(this.diccNewDriverForm['motherLastName']);
      this.diccNewDriverForm['rut'] = this.setFormatToCorrectRut(this.checkRut(this.diccNewDriverForm['rut'])['content']);
      this.createNewDriverAlert();
    }

  }


  // Create new driver in backend.
  createDriver() {
    const driverObject = {};
    driverObject['name'] = this.diccNewDriverForm['name'] + ' ' +
                            this.diccNewDriverForm['fatherLastName'] + ' ' +
                            this.diccNewDriverForm['motherLastName'];
    driverObject['rut'] = this.diccNewDriverForm['rut'];
    driverObject['unionized'] = this.diccNewDriverForm['unionized'] === 'No' ? false : true;
    this.driversService.createDriver(driverObject).subscribe(
      () => {
        console.log('Conductor creado exitosamente');
        this.clearForm();
      },
      (error: any) => {
        console.log('Error al crear el conductor: ', error);
        if (error['status'] === 409) { this.repeatedDriverAlert(); }
      }
    );
  }


  // Repeated driver alert
  async repeatedDriverAlert() {
    const alert = await this.alertController.create({
      header: 'Error registrando unidad.',
      subHeader: 'Erro al inscribir conductor en la base de datos.',
      message: 'Ya existe un conductor con rut ' + this.diccNewDriverForm['rut'] +
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
    this.diccNewDriverForm['name'] = null;
    this.diccNewDriverForm['fatherLastName'] = null;
    this.diccNewDriverForm['motherLastName'] = null;
    this.diccNewDriverForm['rut'] = null;
    this.diccNewDriverForm['unionized'] = null;
  }





}
