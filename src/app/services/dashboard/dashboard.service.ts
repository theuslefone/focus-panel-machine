import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:3331/'; // URL base da sua API Node.js

  constructor(private http: HttpClient) { }

  saveData(machineId: string, data: any): Observable<any> {
    const url = `${this.apiUrl}/${machineId}`;
    return this.http.post(url, data);
  }

  getData(machineId: string): Observable<any> {
    const url = `${this.apiUrl}/${machineId}`;
    return this.http.get(url);
  }

  getMachineData(machineId: string): Observable<any> {
    const url = `${this.apiUrl}/machine/${machineId}`;
    return this.http.get(url);
  }

  getMachineDataByKey(machineId: string, key: string): Observable<any> {
    const url = `${this.apiUrl}/machine/${machineId}/${key}`;
    return this.http.get(url);
  }
}
