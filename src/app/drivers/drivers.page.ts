import { Component, OnInit } from '@angular/core';

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

  constructor(private driversService: DriversService) { }

  ngOnInit() {
    this.getDivers();
    this.checkRut('18.855833-k');
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
      },
      error => {
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
    return name.toLocaleLowerCase().replace(name[0], name[0].toUpperCase());
  }


  // Convert all names and Last namespace
  convertNamesAndLastnames() {
    this.diccNewDriverForm['name'] = this.convertNames(this.diccNewDriverForm['name']);
    this.diccNewDriverForm['fatherLastName'] = this.convertNames(this.diccNewDriverForm['fatherLastName']);
    this.diccNewDriverForm['motherLastName'] = this.convertNames(this.diccNewDriverForm['motherLastName']);
  }


  // Check Driver rut
  checkRut(rut: string): boolean {
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
    if (body.length < 7) { console.log('RUT Incompleto por extensión'); return false; }

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
    if (dvExpected !== readedDigit) { console.log('RUT Inválido por dígito'); return false; }

    // Is valid!
    console.log('is valid!');
    return true;
}




}
