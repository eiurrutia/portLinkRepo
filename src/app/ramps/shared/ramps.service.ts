import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Globals } from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class RampsService {

  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  backUrl = this.globals.url;

  constructor(private http: HttpClient,
              private globals: Globals) { }


  getRamps(): Observable<any> {
    const url = `${this.backUrl}/ramps/`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  getRamp(id: string): Observable<any> {
    const url = `${this.backUrl}/ramps/${id}/`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  getRampByPlateNumber(plateNumber: string): Observable<any> {
    const url = `${this.backUrl}/ramps?plateNumber=${plateNumber}`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  createRamp(ramp: any): Observable<any> {
    const url = `${this.backUrl}/ramps/`;
    return this.http.post<any>(url, ramp, this.httpOptions).catch(this.errorHandler);
  }

  errorHandler(error: HttpErrorResponse) {
    return Observable.throwError(error.status  || 'Server Error');
  }
}
