// globals.ts
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class Globals {
  // this is the one that is in use
  // url = 'https://developer-api.muevebox.com';
  // url = 'https://developer-api.muevebox.com';
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};
  // we are saving the one below for future uses
  url = 'http://localhost:3030';
  // https://staging-api.muevebox.com // sttaging
  // 'https://developer-api.muevebox.com';        developer with https
  // 'http://192.168.1.174:8000'
  // https://api.muevebox.com/    this one is for production mode
  // http://muevebox-staging.us-west-2.elasticbeanstalk.com  this one is for staging

  scrollUp() {
    const scrollToTop = window.setInterval(() => {
        const pos = window.pageYOffset;
        if (pos > 0) {
            window.scrollTo(0, pos - 20); // how far to scroll on each step
        } else {
            window.clearInterval(scrollToTop);
        }
    }, 16);
}
}
