import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Globals } from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class TrucksService {

  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  backUrl = this.globals.url;

  constructor(private http: HttpClient,
              private globals: Globals) { }


  getTrucks(): Observable<any> {
    const url = `${this.backUrl}/trucks/`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  getTruck(id: string): Observable<any> {
    const url = `${this.backUrl}/trucks/${id}/`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  getTruckByPlateNumber(plateNumber: string): Observable<any> {
    const url = `${this.backUrl}/trucks?plateNumber=${plateNumber}`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  createTruck(truck: any): Observable<any> {
    const url = `${this.backUrl}/trucks/`;
    return this.http.post<any>(url, truck, this.httpOptions).catch(this.errorHandler);
  }

  updateTruck(truckId: string, truckObj: any): Observable<any> {
    const url = `${this.backUrl}/trucks/${truckId}`;
    return this.http.patch<any>(url, truckObj, this.httpOptions).catch(this.errorHandler);
  }

  deleteTruck(truckId: string): Observable<any> {
    const url = `${this.backUrl}/trucks/${truckId}`;
    return this.http.delete<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  errorHandler(error: HttpErrorResponse) {
    return Observable.throwError(error.status  || 'Server Error');
  }
}
