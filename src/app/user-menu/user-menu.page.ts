import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.page.html',
  styleUrls: ['./user-menu.page.scss'],
})
export class UserMenuPage implements OnInit {
  menu_title = 'Perfil';
  profile_active = true;
  ports_active = false;
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

  activateProfile() {
    this.ports_active = false;
    this.menu_title = 'Perfil';
    this.profile_active = true;
    this.close();
  }

  activatePorts() {
    this.profile_active = false;
    this.menu_title = 'Puertos';
    this.ports_active = true;
    this.close();
  }



  ngOnInit() {
  }

}
