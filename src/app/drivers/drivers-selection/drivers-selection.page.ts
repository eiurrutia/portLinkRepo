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
    speed: 100,
    width: 375
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

  thirdsDicc = {'Ocare': 0,
                'Patricio Lizama': 0,
                'Sergio Soto': 0};

  activeDriversDiccKeys: any;
  thirdsDiccKeys: any;

  nameThirdsDicc = {'Ocare': {1: ''},
                    'Patricio Lizama': {1: ''},
                    'Sergio Soto': {1: ''}
                     };

  segment = 'drivers';
  firstMove = true;

  activeDriversCount = 0;
  activeThirdsCount = 0;

  constructor() { }

  ngOnInit() {
    this.countActiveDrivers();
    this.countActiveThirds();
    this.activeDriversDiccKeys = Object.keys(this.activeDriversDicc);
    this.thirdsDiccKeys = Object.keys(this.thirdsDicc);

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

  countActiveThirds() {
    this.activeThirdsCount = 0;
    for (const value of Object.values(this.thirdsDicc)) {
      this.activeThirdsCount += value;
    }
  }

  changeNumber(third: string, num: number) {
    if (this.thirdsDicc[third] + num >= 0) {
      this.thirdsDicc[third] += num;
      this.nameThirdsDicc[third][this.thirdsDicc[third]] = '';
    }
    this.countActiveThirds();
  }

  createArray(n: number): any[] {
    return Array(n);
  }

}
