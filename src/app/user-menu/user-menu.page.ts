import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { PortsNewPage } from '../ports/ports-new/ports-new.page';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.page.html',
  styleUrls: ['./user-menu.page.scss'],
})
export class UserMenuPage implements OnInit {
  menu_title = 'Perfil';
  selectedPath = '';

  constructor(private menu: MenuController,
              private activatedRoute: ActivatedRoute,
              private navController: NavController) {}


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

  closeMenu() {
    this.menu.close();
  }

  activateProfile() {
    this.menu_title = 'Perfil';
    this.closeMenu();
  }

  activatePorts() {
    this.menu_title = 'Puertos';
    this.closeMenu();
  }

  activateStats() {
    this.menu_title = 'Estadísticas';
    this.closeMenu();
  }

  activateDamages() {
    this.menu_title = 'Daños';
    this.closeMenu();
  }

  activateNotes() {
    this.menu_title = 'Notas';
    this.closeMenu();
  }

  activateNew() {
    this.menu_title = 'Nuevo Puerto';
    this.closeMenu();
  }

  // customFunc(data) {
    // if (data) {this.activateNew(); }
  //  console.log('se llamo a data y se imprime', data);
  //  if (data === 'perro') {
  //    this.activatePorts();
  //    console.log('cacac');
  //  }
  // }


  ngOnInit() {
    // console.log(this.activatedRoute.snapshot.pathFromRoot);
    // console.log(this.navController.router.routerState.snapshot.url);
  }

}
