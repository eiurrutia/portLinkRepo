import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Unit } from '../unit.model';
import { Globals } from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class UnitsService {

  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  backUrl = this.globals.url;

  constructor(private http: HttpClient,
              private globals: Globals)  { }


  getUnits(): Observable<any> {
    const url = `${this.backUrl}/units/`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  getUnitsByPort(portId: string): Observable<any> {
    const url = `${this.backUrl}/units?$limit=10000&port=${portId}`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  getUnitsByPortAndSize(portId: string, size: string): Observable<any> {
    const url = `${this.backUrl}/units?$port=${portId}&size=${size}`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  getLoadedUnitsByPort(portId: string): Observable<any> {
    const url = `${this.backUrl}/units?port=${portId}&loaded=true`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  getLoadedUnitsByPortAndSize(portId: string, size: string): Observable<any> {
    const url = `${this.backUrl}/units?port=${portId}&loaded=true&size=${size}`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  getUnitById(unitId: string): Observable<any> {
    const url = `${this.backUrl}/units/${unitId}`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  updateUnitByVin(unitVin: string, unitObj: any): Observable<any> {
    const url = `${this.backUrl}/units?vin=${unitVin}`;
    return this.http.patch<any>(url, unitObj, this.httpOptions).catch(this.errorHandler);
  }

  updateUnit(unitId: string, unitObj: any): Observable<any> {
    const url = `${this.backUrl}/units/${unitId}`;
    return this.http.patch<any>(url, unitObj, this.httpOptions).catch(this.errorHandler);
  }

  createUnit(unit: Unit): Observable<Unit> {
    const url = `${this.backUrl}/units/`;
    return this.http.post<Unit>(url, unit, this.httpOptions).catch(this.errorHandler);
  }

  deleteUnit(unitId: string): Observable<any> {
    const url = `${this.backUrl}/units/${unitId}`;
    return this.http.delete<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  errorHandler(error: HttpErrorResponse) {
    return Observable.throwError(error.status  || 'Server Error');
  }

}
