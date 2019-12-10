import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Globals } from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class CommissionsService {

  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  backUrl = this.globals.url;

  constructor(private http: HttpClient,
              private globals: Globals)  { }


  getComissions(): Observable<any> {
    const url = `${this.backUrl}/commissions/`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  getComissionByKind(kind: string): Observable<any> {
    const url = `${this.backUrl}/commissions?kind=${kind}`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  getComission(id: string): Observable<any> {
    const url = `${this.backUrl}/commissions/${id}/`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  createComission(commission: any): Observable<any> {
    const url = `${this.backUrl}/commissions/`;
    return this.http.post<any>(url, commission, this.httpOptions).catch(this.errorHandler);
  }

  updateCommission(commissionId: string, commission: any): Observable<any> {
    const url = `${this.backUrl}/commissions/${commissionId}/`;
    return this.http.patch<any>(url, commission, this.httpOptions).catch(this.errorHandler);
  }

  deleteComission(commissionId: string): Observable<any> {
    const url = `${this.backUrl}/commissions/${commissionId}`;
    return this.http.delete<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  errorHandler(error: HttpErrorResponse) {
    return Observable.throwError(error.status  || 'Server Error');
  }
}
