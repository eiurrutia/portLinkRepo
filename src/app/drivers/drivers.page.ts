import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.page.html',
  styleUrls: ['./drivers.page.scss'],
})
export class DriversPage implements OnInit {

  // To know what is the setted option: 'main', 'new', 'edit', 'delelte' or 'list'.
  settedOption = 'main';

  constructor() { }

  ngOnInit() {
  
  }


  changeViewOption(option: string) {
    this.settedOption = option;
    console.log(this.settedOption);
  }

}
