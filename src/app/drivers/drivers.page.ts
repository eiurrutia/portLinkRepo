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

  constructor(private driversService: DriversService) { }

  ngOnInit() {
    this.getDivers();
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




}
