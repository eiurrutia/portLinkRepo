import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Globals } from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class ThirdsService {

  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  backUrl = this.globals.url;

  constructor(private http: HttpClient,
              private globals: Globals) { }


  getThirds(): Observable<any> {
    const url = `${this.backUrl}/third-parties/`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  getThird(id: string): Observable<any> {
    const url = `${this.backUrl}/third-parties/${id}/`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  createThirds(third: any): Observable<any> {
    const url = `${this.backUrl}/third-parties/`;
    return this.http.post<any>(url, third, this.httpOptions).catch(this.errorHandler);
  }

  updateThird(thirdId: string, thirdObj: any): Observable<any> {
    const url = `${this.backUrl}/ramps/${thirdId}`;
    return this.http.patch<any>(url, thirdObj, this.httpOptions).catch(this.errorHandler);
  }

  deleteThird(thirdId: string): Observable<any> {
    const url = `${this.backUrl}/ramps/${thirdId}`;
    return this.http.delete<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  errorHandler(error: HttpErrorResponse) {
    return Observable.throwError(error.status  || 'Server Error');
  }

}
