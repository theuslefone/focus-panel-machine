import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:3331/'; // URL base da sua API Node.js

  constructor(private http: HttpClient) { }

  saveData(machineId: string, data: any, idClient: string): Observable<any> {
    const url = `${this.apiUrl}/${machineId}?idClient=${idClient}`;
    return this.http.post(url, data);
  }

  getData(machineId: string, idClient: string): Observable<any> {
    const url = `${this.apiUrl}/${machineId}?idClient=${idClient}`;
    return this.http.get(url);
  }

  getMachineData(machineId: string, idClient: string): Observable<any> {
    const url = `${this.apiUrl}/machine/${machineId}?idClient=${idClient}`;
    return this.http.get(url);
  }

  getMachineDataByKey(machineId: string, key: string, idClient: string): Observable<any> {
    const url = `${this.apiUrl}/machine/${machineId}/${key}?idClient=${idClient}`;
    return this.http.get(url);
  }
}
