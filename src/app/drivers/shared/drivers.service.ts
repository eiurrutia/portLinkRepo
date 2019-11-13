import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Globals } from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class DriversService {

  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  backUrl = this.globals.url;

  constructor(private http: HttpClient,
              private globals: Globals) { }


  getDrivers(): Observable<any> {
    const url = `${this.backUrl}/drivers/`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  getDriver(id: string): Observable<any> {
    const url = `${this.backUrl}/drivers/${id}/`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  createDriver(driver: any): Observable<any> {
    const url = `${this.backUrl}/drivers/`;
    return this.http.post<any>(url, driver, this.httpOptions).catch(this.errorHandler);
  }

  updateDriver(driverId: string, driverObj: any): Observable<any> {
    const url = `${this.backUrl}/drivers/${driverId}`;
    return this.http.patch<any>(url, driverObj, this.httpOptions).catch(this.errorHandler);
  }

  errorHandler(error: HttpErrorResponse) {
    return Observable.throwError(error || 'Server Error');
  }

}
