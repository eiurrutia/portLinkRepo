import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ports',
  templateUrl: './ports.page.html',
  styleUrls: ['./ports.page.scss'],
})
export class PortsPage implements OnInit {
  public selected_option = '1';
  public text: any;
  // 1 --> "Puertos Actuales"
  // 2 --> "Nuevo Puerto"
  // 3 --> "Historial"
  // 4 --> "Estadísticas"
  constructor() { }

  ngOnInit() {
  }

  selectOption() {
    console.log('click on: ');
  }


}
