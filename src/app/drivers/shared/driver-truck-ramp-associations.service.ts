import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Globals } from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class DriverTruckRampAssociationsService {

  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  backUrl = this.globals.url;

  constructor(private http: HttpClient,
              private globals: Globals) { }


  getAssociations(): Observable<any> {
    const url = `${this.backUrl}/associations/`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  getAssociation(id: string): Observable<any> {
    const url = `${this.backUrl}/associations/${id}/`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  getAssociationByDriverId(driverId: string): Observable<any> {
    const url = `${this.backUrl}/associations?driverId=${driverId}`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  getAssociationByTruckId(truckId: string): Observable<any> {
    const url = `${this.backUrl}/associations?truckId=${truckId}`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  getAssociationByRampId(rampId: string): Observable<any> {
    const url = `${this.backUrl}/associations?rampId=${rampId}`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  createAssociation(association: any): Observable<any> {
    const url = `${this.backUrl}/associations/`;
    return this.http.post<any>(url, association, this.httpOptions).catch(this.errorHandler);
  }

  deleteAssociation(associationId: string): Observable<any> {
    const url = `${this.backUrl}/associations/${associationId}`;
    return this.http.delete<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  deleteAllAssociations(): Observable<any> {
    const url = `${this.backUrl}/associations`;
    return this.http.delete<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  errorHandler(error: HttpErrorResponse) {
    return Observable.throwError(error.status  || 'Server Error');
  }
}
