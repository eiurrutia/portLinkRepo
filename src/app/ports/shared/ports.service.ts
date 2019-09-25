import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Port } from '../port.model';
import { Globals } from '../../globals';


@Injectable({
  providedIn: 'root'
})
export class PortsService {

  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  backUrl = this.globals.url;

  constructor(private http: HttpClient,
              private globals: Globals)  { }


  getPorts(): Observable<any> {
    const url = `${this.backUrl}/ports/`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  getPort(id: string): Observable<any> {
    const url = `${this.backUrl}/ports/${id}/`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  createPort(port: any): Observable<any> {
    const url = `${this.backUrl}/ports/`;
    return this.http.post<any>(url, port, this.httpOptions).catch(this.errorHandler);
  }

  associateDriversToPort(id: string, port: any): Observable<any> {
    const url = `${this.backUrl}/ports/${id}/`;
    return this.http.patch<any>(url, port, this.httpOptions).catch(this.errorHandler);
  }

  errorHandler(error: HttpErrorResponse) {
    return Observable.throwError(error.status  || 'Server Error');
  }

}
