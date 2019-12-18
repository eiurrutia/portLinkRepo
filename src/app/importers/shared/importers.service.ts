import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Globals } from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class ImportersService {

  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  backUrl = this.globals.url;

  constructor(private http: HttpClient,
              private globals: Globals)  { }


  getImporters(): Observable<any> {
    const url = `${this.backUrl}/importers/`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  getImporter(id: string): Observable<any> {
    const url = `${this.backUrl}/importers/${id}/`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  getImporterByName(name: string): Observable<any> {
    const url = `${this.backUrl}/importers?name=${name}`;
    return this.http.get<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  createImporter(importer: any): Observable<any> {
    const url = `${this.backUrl}/importers/`;
    return this.http.post<any>(url, importer, this.httpOptions).catch(this.errorHandler);
  }

  updateImporter(importerId: string, importerObj: any): Observable<any> {
    const url = `${this.backUrl}/importers/${importerId}`;
    return this.http.patch<any>(url, importerObj, this.httpOptions).catch(this.errorHandler);
  }

  deleteImporter(importerId: string): Observable<any> {
    const url = `${this.backUrl}/importers/${importerId}`;
    return this.http.delete<any>(url, this.httpOptions).catch(this.errorHandler);
  }

  errorHandler(error: HttpErrorResponse) {
        return Observable.throwError(error.status  || 'Server Error');
  }
}
