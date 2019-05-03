import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { PortsNewPage } from '../ports/ports-new/ports-new.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.page.html',
  styleUrls: ['./user-menu.page.scss'],
})
export class UserMenuPage implements OnInit {
  menu_title = 'Perfil';
  profile_active = true;
  ports_active = false;
  stats_active = false;
  damages_active = false;
  notes_active = false;
  edit_active = false;

  selectedPath = '';

  constructor(private menu: MenuController) {}


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
    this.stats_active = false;
    this.damages_active = false;
    this.notes_active = false;
    this.edit_active = false;
    this.menu_title = 'Perfil';
    this.profile_active = true;
    this.close();
  }

  activatePorts() {
    this.profile_active = false;
    this.stats_active = false;
    this.damages_active = false;
    this.notes_active = false;
    this.edit_active = false;
    this.menu_title = 'Puertos';
    this.ports_active = true;
    this.close();
  }

  activateStats() {
    this.profile_active = false;
    this.ports_active = false;
    this.damages_active = false;
    this.notes_active = false;
    this.edit_active = false;
    this.menu_title = 'Estadísticas';
    this.stats_active = true;
    this.close();
  }

  activateDamages() {
    this.profile_active = false;
    this.ports_active = false;
    this.stats_active = false;
    this.notes_active = false;
    this.edit_active = false;
    this.menu_title = 'Daños';
    this.damages_active = true;
    this.close();
  }

  activateNotes() {
    this.profile_active = false;
    this.ports_active = false;
    this.stats_active = false;
    this.damages_active = false;
    this.edit_active = false;
    this.menu_title = 'Notas';
    this.notes_active = true;
    this.close();
  }

  activateNew() {
    this.notes_active = false;
    this.profile_active = false;
    this.ports_active = false;
    this.stats_active = false;
    this.damages_active = false;
    this.menu_title = 'Nuevo Puerto';
    this.edit_active = true;
    this.close();
  }

  customFunc(data) {
    if (data) {this.activateNew(); }
  }

  ngOnInit() {
  }

}
