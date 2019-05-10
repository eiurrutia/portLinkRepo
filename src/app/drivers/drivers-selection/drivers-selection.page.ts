import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-drivers-selection',
  templateUrl: './drivers-selection.page.html',
  styleUrls: ['./drivers-selection.page.scss'],
})
export class DriversSelectionPage implements OnInit {

   @ViewChild(IonSlides) slides: IonSlides;

  slideOpts = {
    initialSlide: 0,
    speed: 100
  };
  activeDriversDicc = {'Manuel Sáez': true,
                       'Juan Marchant': false,
                       'Robin Pinilla': true,
                       'Jorge Contreras': false,
                       'Gastón Cataldo': false,
                       'Victor Moreno': true,
                       'Jorge Osorio': true,
                       'Luis González': true,
                       'Cristian Espinoza': false,
                       'Moises Sepulveda': false,
                       'Miguel Vargas': false,
                       'Francisco Bravo': true,
                       'Miguel Bravo': false};

  activeDriversDiccKeys: any;
  segment = 'drivers';
  firstMove = true;

  activeDriversCount = 0;
  activeThirdsCount = 5;

  constructor() { }

  ngOnInit() {
    this.countActiveDrivers();
    this.activeDriversDiccKeys = Object.keys(this.activeDriversDicc);

  }

  segmentChanged(ev: any) {
    if (this.firstMove) {
      this.firstMove = false;
      if (ev.detail.value === 'thirds') {
        this.slides.slideNext();
      } else {this.slides.slidePrev(); }
    } else {this.firstMove = true; }

  }

  slideChanged(ev: any) {
    if (this.firstMove) {
      this.firstMove = false;
      this.changeSegment();
    } else {this.firstMove = true; }
  }

  changeSegment() {
    if (this.segment === 'drivers') {
      this.segment = 'thirds';
    } else { this.segment = 'drivers'; }
  }

  countActiveDrivers() {
    this.activeDriversCount = 0;
    for (const value of Object.values(this.activeDriversDicc)) {
      if (value) {this.activeDriversCount += 1; }
    }
  }

}
