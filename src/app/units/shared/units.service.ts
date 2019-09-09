import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';

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

  createUnit(unit: Unit): Observable<Unit> {
    const url = `${this.backUrl}/units/`;
    return this.http.post<Unit>(url, unit, this.httpOptions).catch(this.errorHandler);
  }

  errorHandler(error: HttpErrorResponse) {
    return Observable.throwError(error.status  || 'Server Error');
  }

}
