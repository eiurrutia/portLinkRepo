import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Globals } from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class LapsService {

  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  backUrl = this.globals.url;

  constructor(private http: HttpClient,
              private globals: Globals)  { }


  getLaps(): Observable<any> {
    const url = `${this.backUrl}/laps/`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  getLapsByPort(portId: string): Observable<any> {
    const url = `${this.backUrl}/laps?port=${portId}`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  getLap(id: string): Observable<any> {
    const url = `${this.backUrl}/laps/${id}/`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  createLap(lap: any): Observable<any> {
    const url = `${this.backUrl}/laps/`;
    return this.http.post<any>(url, lap, this.httpOptions).catch(this.errorHandler);
  }

  getLapsByDriverAndPort(driverId: string, portId: string): Observable<any> {
    const url = `${this.backUrl}/laps?driver=${driverId}&port=${portId}/`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  getLapsByDriverAndPortOrderByRelativeNumber(driverId: string, portId: string): Observable<any> {
    const url = `${this.backUrl}/laps?driver=${driverId}&port=${portId}&$sort[relativeNumber]=-1/`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  updateLapLoad(lapId: string, lap: any): Observable<any> {
    const url = `${this.backUrl}/laps/${lapId}/`;
    return this.http.patch<any>(url, lap, this.httpOptions).catch(this.errorHandler);
  }

  deleteLap(portId: string): Observable<any> {
    const url = `${this.backUrl}/laps/${portId}`;
    return this.http.delete<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  errorHandler(error: HttpErrorResponse) {
    return Observable.throwError(error.status  || 'Server Error');
  }


}
