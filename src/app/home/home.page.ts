import { Component } from '@angular/core';

import { AppRoutingPreloaderService } from '../app-routing-preloader.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  userText = 'user';
  passwordText = 'password';

  constructor(private routingService: AppRoutingPreloaderService) {}

  async ionViewDidEnter() {
    await this.routingService.preloadRoute('user-menu');
  }

}
