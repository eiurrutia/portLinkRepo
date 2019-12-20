import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Globals } from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  backUrl = this.globals.url;

  constructor(private http: HttpClient,
              private globals: Globals) { }


  getReports(): Observable<any> {
    const url = `${this.backUrl}/reports/`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  getReport(id: string): Observable<any> {
    const url = `${this.backUrl}/reports/${id}/`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  getReportByPort(portId: string): Observable<any> {
    const url = `${this.backUrl}/reports?port=${portId}`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  createReport(report: any): Observable<any> {
    const url = `${this.backUrl}/reports/`;
    return this.http.post<any>(url, report, this.httpOptions).catch(this.errorHandler);
  }

  updateReport(reportId: string, reportObj: any): Observable<any> {
    const url = `${this.backUrl}/reports/${reportId}`;
    return this.http.patch<any>(url, reportObj, this.httpOptions).catch(this.errorHandler);
  }

  deleteReport(reportId: string): Observable<any> {
    const url = `${this.backUrl}/reports/${reportId}`;
    return this.http.delete<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  errorHandler(error: HttpErrorResponse) {
    return Observable.throwError(error.status  || 'Server Error');
  }
}
