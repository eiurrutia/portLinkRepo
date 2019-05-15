import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { PortsNewPage } from '../ports/ports-new/ports-new.page';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

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
              private router: Router,
              private navController: NavController) {
                router.events.subscribe((val) => {
                  // see also
                  if (val instanceof NavigationEnd) {
                    this.setTitle(val.url); }
                });
              }


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

  setTitle(url: string) {
    if (url.includes('ports')) {
      if (url.includes('new')) { this.menu_title = 'Nuevo Puerto';
      } else {this.menu_title = 'Puertos'; }
    } else if (url.includes('drivers')) {
      this.menu_title = 'Conductores';
    } else if (url.includes('profile')) {
      this.menu_title = 'Perfil';
    }
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
