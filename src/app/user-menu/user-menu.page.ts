import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';

import { PortsService } from '../ports/shared/ports.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.page.html',
  styleUrls: ['./user-menu.page.scss'],
})
export class UserMenuPage implements OnInit {
  menu_title = 'Perfil';
  selectedPath = '';

  constructor(private portsService: PortsService,
              private menu: MenuController,
              private router: Router) {
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
    } else if (url.includes('action')) { this.getAndSetPortName(url);
      } else {this.menu_title = 'Puertos'; }
    } else if (url.includes('drivers')) {
      this.menu_title = 'Conductores';
    } else if (url.includes('profile')) {
      this.menu_title = 'Perfil';
    }
  }

  getAndSetPortName(url: string) {
    // Get port id from url. Always is the element after the word 'action'.
    const portId = url.split('/')[url.split('/').indexOf('action') +  1];
    this.portsService.getPort(portId).subscribe(
      port => {
        this.menu_title = port.shipName;
      },
      error => {
        console.log('Error getting the port: ', error);
        this.menu_title = 'Registro de Vins';
      }
    );
  }


  ngOnInit() {

  }

}
