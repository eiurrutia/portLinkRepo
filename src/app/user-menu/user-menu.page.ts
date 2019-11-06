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


  // #### Menu component functions ####
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
  // #### Menu component functions ####


  // To process url and set menu title.
  setTitle(url: string) {
    const urlArray = url.split('/');
    // We check the last word in url.
    if (urlArray[urlArray.length - 1].includes('ports')) {
      this.menu_title = 'Puertos';
    } else if (urlArray[urlArray.length - 2].includes('action')) {
      this.getAndSetPortName(url);
    } else if (urlArray[urlArray.length - 2].includes('new-port')) {
      this.menu_title = 'Nuevo Puerto';
    } else if (urlArray[urlArray.length - 1].includes('association') ||
              urlArray[urlArray.length - 1].includes('selection')) {
      this.menu_title = 'Nuevo Puerto';
    } else if (urlArray[urlArray.length - 1].includes('modify')) {
      this.getAndSetPortName(url);
    } else if (urlArray[urlArray.length - 1].includes('profile')) {
      this.menu_title = 'Perfil';
    }
  }



  // Get port from backend and set shipName as menu title.
  getAndSetPortName(url: string) {
    let portId = "";
    if (url.split('/').includes('action')) {
      portId = url.split('/')[url.split('/').indexOf('action') +  1];
    } else { // We are in newPort children.
      portId = url.split('/')[url.split('/').indexOf('new-port') +  1];
    }
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
