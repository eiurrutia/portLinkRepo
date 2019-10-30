import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PortsService } from '../../ports/shared/ports.service';
import { DriversService } from '../../drivers/shared/drivers.service';
import { ThirdsService } from '../../thirds/shared/thirds.service';
import { TrucksService } from '../../trucks/shared/trucks.service';
import { RampsService } from '../../ramps/shared/ramps.service';
import { DriverTruckRampAssociationsService } from '../../drivers/shared/driver-truck-ramp-associations.service';


@Component({
  selector: 'app-trucks-association',
  templateUrl: './trucks-association.page.html',
  styleUrls: ['./trucks-association.page.scss'],
})
export class TrucksAssociationPage implements OnInit {

  portId: string;
  currentPort: any;
  trucks = {};  // plateNumber: truckObject.
  ramps = {};  // plateNumber: rampObject.

  // Dic with schema like {driverId: driverInfo, truck, ramp}.
  driversAssociatedDicc = {};
  // And consedered drivers and thirds.
  driversDicc = {};
  thirdsDicc = {};

  thirdsPlatesNumbersDicc = {};

  selectableTrucksList = [];


  constructor(private activatedRoute: ActivatedRoute,
              private portsService: PortsService,
              private driversService: DriversService,
              private thirdsService: ThirdsService,
              private trucksService: TrucksService,
              private rampsService: RampsService,
              private associationsService: DriverTruckRampAssociationsService) { }

  ngOnInit() {
    this.getBackInfo();
  }


  // Get Backend Info: Port, Trucks, Ramps, Drivers, Associations.
  async getBackInfo() {
    this.portId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getPort(this.portId);
    this.getAssociationsCache();
  }


  // Get port info.
  getPort(id: string) {
    this.portsService.getPort(id).subscribe(
      port => {
        this.currentPort = port;

        // We get the drivers considered.
        if (this.currentPort['consideredDrivers'].length > 0) {
          this.currentPort['consideredDrivers'].map(driverElement => {
            this.driversService.getDriver(driverElement.driverId).subscribe(
              driver => {
                this.driversDicc[driver._id] = Object.assign({}, driver);
                if (this.driversAssociatedDicc[driver._id] === undefined) {
                  this.driversAssociatedDicc[driver._id] = Object.assign({}, driver);
                  this.driversAssociatedDicc[driver._id]['truck'] = null;
                  this.driversAssociatedDicc[driver._id]['ramp'] = null;
                }
              },
              error => {
                console.log('Error fetching driver: ', error);
              }
            );
          });
        }

        // We get the thirds considered. SEE BECAUSE THE KEY SHOULD BE THE NICKNAME AND CAN BE THE SAME TO DOFFERENTS THIRDS COMPANIES.
        this.thirdsPlatesNumbersDicc = {};
        if (this.currentPort['consideredThirds'].length > 0) {
          this.currentPort['consideredThirds'].map(thirdElement => {
            this.thirdsService.getThird(thirdElement.thirdId).subscribe(
              third => {
                if (thirdElement['nickName']) {
                  const stringKey = third['name'] + ' - ' + thirdElement['nickName'];
                  this.thirdsPlatesNumbersDicc[stringKey] = null;
                } else {
                  this.thirdsPlatesNumbersDicc[third['name']] = null;
                }
                this.thirdsDicc[third._id] = Object.assign({}, third);
                thirdElement['third'] = third;
              },
              error => {
                console.log('Error fetching third: ', error);
              }
            );
          });
        }
        console.log('this.currentPort');
        console.log(this.currentPort);

      },
      error => {
        console.log('Error fetching port: ', error);
      }
    );
  }


  // Get Trucks from Backend.
  getTrucks() {
    this.trucksService.getTrucks().subscribe(
      trucks => {
        trucks.map(truck => {
          this.trucks[truck['plateNumber']] = truck;
        });
        console.log('trucks');
        console.log(this.trucks);
        this.buildSelectableTrucksList();
      },
      error => {
        console.log('Error fetching trucks: ', error);
      }
    );
  }


  // Get Ramps from Backend.
  getRamps() {
    this.rampsService.getRamps().subscribe(
      ramps => {
        ramps.map(ramp => {
          this.ramps[ramp['plateNumber']] = ramp;
        });
        console.log('ramps');
        console.log(this.ramps);
      },
      error => {
        console.log('Error fetching ramps: ', error);
      }
    );
  }


  // To know if dicc is empty.
  isEmpty(obj: any): boolean {
    if (Object.keys(obj).length) { return false; }
    return true;
  }


  // Set selected truck to driver.
  truckSelectChange(driver: any, truck: any) {
    this.checkIfTruckIsAssignedToOther(driver, truck);
    this.driversAssociatedDicc[driver._id]['truck'] = truck;
    console.log(this.driversAssociatedDicc);
  }


  // Check if truck is selected to another driver.
  checkIfTruckIsAssignedToOther(driver: any, truck: any) {
    Object.keys(this.driversAssociatedDicc).map( associate => {
      if (this.driversAssociatedDicc[associate]['truck'] !== null) {
        if (this.driversAssociatedDicc[associate]['truck'] === truck) {
          if (associate !== driver._id) {
            // The truck was assigned to other driver. We have to set null in that driver.
            this.driversAssociatedDicc[associate]['truck'] = null;
          }
        }
      }
    });
  }


  // Set selected ramp to driver.
  rampSelectChange(driver: any, ramp: any) {
    this.checkIfRampIsAssignedToOther(driver, ramp);
    this.driversAssociatedDicc[driver._id]['ramp'] = ramp;
    console.log(this.driversAssociatedDicc);
  }


  // Check if ramp is selected to another driver.
  checkIfRampIsAssignedToOther(driver: any, ramp: any) {
    Object.keys(this.driversAssociatedDicc).map( associate => {
      if (this.driversAssociatedDicc[associate]['ramp'] !== null) {
        if (this.driversAssociatedDicc[associate]['ramp'] === ramp) {
          if (associate !== driver._id) {
            // The truck was assigned to other driver. We have to set null in that driver.
            this.driversAssociatedDicc[associate]['ramp'] = null;
          }
        }
      }
    });
  }


  // Build selectable list for trucks.
  buildSelectableTrucksList() {
    this.selectableTrucksList = [];
    const trucksList = Object.keys(this.trucks);
    const associatedTruckList = [];
    for (const driverId of Object.keys(this.driversAssociatedDicc)) {
      if (this.driversAssociatedDicc[driverId]['truck'] !== null ) {
        associatedTruckList.push(this.driversAssociatedDicc[driverId]['truck']);
      }
    }
    console.log('associatedTruckList');
    console.log(associatedTruckList);
    trucksList.map(truck => {
      if (!associatedTruckList.includes(truck)) { this.selectableTrucksList.push(truck); }
    });
    console.log('this.selectableTrucksList');
    console.log(this.selectableTrucksList);
  }


  // Get Association Cache from Backend.
  getAssociationsCache() {
    this.associationsService.getAssociations().subscribe(
      associations => {
        Promise.all(associations.map( async (association) => {
          return  new Promise( resolve => { this.driversService.getDriver(association.driverId).subscribe(
            driver => {
              this.driversAssociatedDicc[association.driverId] = Object.assign({}, driver);
              this.trucksService.getTruck(association.truckId).subscribe(
                truck => {
                  this.driversAssociatedDicc[association.driverId]['truck'] = truck.plateNumber;
                  this.rampsService.getRamp(association.rampId).subscribe(
                    ramp => {
                      this.driversAssociatedDicc[association.driverId]['ramp'] = ramp.plateNumber;
                      console.log('this.driversAssociatedDicc');
                      console.log(this.driversAssociatedDicc);
                      resolve(ramp);
                    },
                    error => {
                      console.log('Error fetching ramp to association: ', error);
                    }
                  );
                },
                error => {
                  console.log('Error fetching truck to association: ', error);
                }
              );
            },
            error => {
              console.log('Error fetching driver to association: ', error);
            }
          ); });
        }
      )).then(() => {
        // We wait that associations info is complete and then we get the other info/
        // that check what trucks and ramps are available.
        this.getTrucks();
        this.getRamps();
      });

      },
      error => {
        console.log('Error fetching associations: ', error);
      }
    );
  }


  // Check if all drivers and thirds have trucks assocaited.
  checkAllDriversAndThirdWithInfo() {
    let missing = false;
    // Check if there are drivers selected.
    if (this.currentPort.consideredDrivers.length) {
      for (const driver of this.currentPort.consideredDrivers) {
        if (!this.driversAssociatedDicc[driver.driverId]['truck'] || !this.driversAssociatedDicc[driver.driverId]['ramp']) {
          missing = true;
        }
      }
    }

    // Check if there are thirds selected.
    if (this.currentPort.consideredThirds.length) {
      for (const third of Object.keys(this.thirdsPlatesNumbersDicc)) {
        if (!this.thirdsPlatesNumbersDicc[third]) {
          missing = true;
        }
      }
    }

    console.log(this.driversAssociatedDicc);
    console.log(this.thirdsPlatesNumbersDicc);

    if (missing) {
      console.log('Falta información por completar');
    } else {
      console.log('Toda la info lista');
      this.sendInfoToBackAndFinishPortCreation();
    }
  }


  // Send Associations to Back and update port lists.
  sendInfoToBackAndFinishPortCreation() {
    // First, we delete all the associations in backend and we replace
    // with driversAssociatedDicc that contains all associations from back and
    // updates (not only consideredDrivers to this port).
    this.associationsService.deleteAllAssociations().subscribe(
      () => {
        console.log('All associations deleted. Ready to replace.');
        Object.keys(this.driversAssociatedDicc).map( driver => {
          const associationObject = {};
          // Set the driver Id.
          associationObject['driverId'] = driver;

          // Set the truck Id.
          const truck = this.driversAssociatedDicc[driver]['truck'];
          if (truck) {
            associationObject['truckId'] = this.trucks[truck]['_id'];
          } else {
            associationObject['truckId'] = null;
          }

          // Set the ramp Id.
          const ramp = this.driversAssociatedDicc[driver]['ramp'];
          if (ramp) {
            associationObject['rampId'] = this.ramps[ramp]['_id'];
          } else {
            associationObject['rampId'] = null;
          }

          this.associationsService.createAssociation(associationObject).subscribe(
            association => {
              console.log('Association created successfully.');
              console.log(association);
            },
            error => {
              console.log(`Error creating association to ${driver}: ${error}.`);
            }
          );
        });
      },
      error => {
        console.log('Error deleting all the associations: ', error);
      }
    );


    // And then we update the port info.

    // We update drivers list with platesNumbers
    let consideredDriversObj = [];
    consideredDriversObj = Object.assign([], this.currentPort.consideredDrivers);
    consideredDriversObj.map(driver => {
      driver['truckPlateId'] = this.driversAssociatedDicc[driver.driverId]['truck'];
      driver['rampPlateId'] = this.driversAssociatedDicc[driver.driverId]['ramp'];
    });
    console.log('consideredDriversObj');
    console.log(consideredDriversObj);


    // We update thirds list with platesNumbers
    let consideredThirdsObj = [];
    consideredThirdsObj = Object.assign([], this.currentPort.consideredThirds);
    consideredThirdsObj.map(third => {
      if (third['nickName']) {
        third['truckPlateId'] = this.thirdsPlatesNumbersDicc[third.third.name + ' - ' + third.nickName];
      } else {
        third['truckPlateId'] = this.thirdsPlatesNumbersDicc[third.third.name];
      }
    });
    console.log('consideredThirdsObj');
    console.log(consideredThirdsObj);

    // And we update the port in backend;
    const portObj = {};
    portObj['consideredDrivers'] = consideredDriversObj;
    portObj['consideredThirds'] = consideredThirdsObj;
    this.portsService.updatePort(this.portId, portObj).subscribe(
      portUpdated => {
        console.log('Puerto actualizado en backend correctamente.');
        console.log(portUpdated);
      },
      error => {
        console.log('Error updating list of drivers whit their plate numbers: ', error);
      }
    );

  }
}
