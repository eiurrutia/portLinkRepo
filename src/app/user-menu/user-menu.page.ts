import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.page.html',
  styleUrls: ['./user-menu.page.scss'],
})
export class UserMenuPage implements OnInit {
  caca: true;
  constructor(private menu: MenuController) { }


  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }

  close() {
    this.menu.close();
  }

  setCaca(){
    this.caca = !this.caca;
  }

  ngOnInit() {
  }

}
