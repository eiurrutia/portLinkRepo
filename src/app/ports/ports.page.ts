import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Port } from './port.model';

@Component({
  selector: 'app-ports',
  templateUrl: './ports.page.html',
  styleUrls: ['./ports.page.scss'],
})
export class PortsPage implements OnInit {

  public selected_option = '1';
  public text: any;
  activeItemsList: boolean;
  recentItemsList: boolean;
  // 1 --> "Puertos Actuales"
  // 2 --> "Nuevo Puerto"
  // 3 --> "Historial"
  // 4 --> "Estadísticas"

  // to try
  pleiadesDetail: boolean;
  portsArray: Port[];
  constructor() { }

  ngOnInit() {
    this.activeItemsList = true;
    this.recentItemsList = false;

    this.pleiadesDetail = false;

    this.portsArray = [];
    this.portsArray.push(new Port());
    this.portsArray[0].shipName = 'Morning Peace';
    this.portsArray[0].unitsToCollect = 285;
    this.portsArray[0].collectedUnits = 20;
    this.portsArray[0].modelsQuantityInPacking = 305;
    this.portsArray[0].turnsEstimated = 25;
    this.portsArray[0].turnsMade = 10;
    this.portsArray[0].extraBigUnitsQuantity = 20;
    this.portsArray[0].bigUnitsQuantity = 15;
    this.portsArray[0].mediumUnitsQuantity = 20;
    this.portsArray[0].littleUnitsQuantity = 5;
    this.portsArray[0].collectedExtraBigUnits = 2;
    this.portsArray[0].collectedBigUnits = 10;
    this.portsArray[0].collectedMediumUnits = 9;
    this.portsArray[0].collectedLittleUnits = 3;
    this.portsArray[0].toCollectExtraBigUnits = 18;
    this.portsArray[0].toCollectBigUnits = 5;
    this.portsArray[0].toCollectMediumUnits = 11;
    this.portsArray[0].toCollectLittleUnits = 2;
    this.portsArray[0].damages = 5;
    this.portsArray[0].advancedPercentage = this.portsArray[0].collectedUnits / this.portsArray[0].modelsQuantityInPacking;

    this.portsArray.push(new Port());
    this.portsArray[1].shipName = 'Cecilie';
    this.portsArray[1].unitsToCollect = 85;
    this.portsArray[1].collectedUnits = 30;
    this.portsArray[1].modelsQuantityInPacking = 115;
    this.portsArray[1].turnsEstimated = 25;
    this.portsArray[1].turnsMade = 10;
    this.portsArray[1].extraBigUnitsQuantity = 0;
    this.portsArray[1].bigUnitsQuantity = 0;
    this.portsArray[1].mediumUnitsQuantity = 20;
    this.portsArray[1].littleUnitsQuantity = 5;
    this.portsArray[1].collectedExtraBigUnits = 2;
    this.portsArray[1].collectedBigUnits = 10;
    this.portsArray[1].collectedMediumUnits = 9;
    this.portsArray[1].collectedLittleUnits = 3;
    this.portsArray[1].toCollectExtraBigUnits = 18;
    this.portsArray[1].toCollectBigUnits = 5;
    this.portsArray[1].toCollectMediumUnits = 11;
    this.portsArray[1].toCollectLittleUnits = 2;
    this.portsArray[1].damages = 2;
    this.portsArray[1].advancedPercentage = this.portsArray[1].collectedUnits / this.portsArray[1].modelsQuantityInPacking;

    this.portsArray.push(new Port());
    this.portsArray[2].shipName = 'Pleaiades Leader';
    this.portsArray[2].unitsToCollect = 20;
    this.portsArray[2].collectedUnits = 100;
    this.portsArray[2].modelsQuantityInPacking = 120;
    this.portsArray[2].turnsEstimated = 16;
    this.portsArray[2].turnsMade = 3;
    this.portsArray[2].extraBigUnitsQuantity = 0;
    this.portsArray[2].bigUnitsQuantity = 0;
    this.portsArray[2].mediumUnitsQuantity = 20;
    this.portsArray[2].littleUnitsQuantity = 0;
    this.portsArray[2].collectedExtraBigUnits = 2;
    this.portsArray[2].collectedBigUnits = 10;
    this.portsArray[2].collectedMediumUnits = 9;
    this.portsArray[2].collectedLittleUnits = 3;
    this.portsArray[2].toCollectExtraBigUnits = 18;
    this.portsArray[2].toCollectBigUnits = 5;
    this.portsArray[2].toCollectMediumUnits = 11;
    this.portsArray[2].toCollectLittleUnits = 2;
    this.portsArray[2].damages = 3;
    this.portsArray[2].advancedPercentage = this.portsArray[2].collectedUnits / this.portsArray[2].modelsQuantityInPacking;

    console.log(this.portsArray);

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

  changePleiadesDetail() {
    this.pleiadesDetail = !this.pleiadesDetail;
  }

  @Output() sendCount : EventEmitter <boolean> = new EventEmitter<boolean>();
  public sendRecord() {
    this.sendCount.emit(true);
  }


}
