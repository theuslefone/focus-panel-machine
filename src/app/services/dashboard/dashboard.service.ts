import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://webcaseiot.com.br:3000/api';

  constructor() { }

  private async request(method: string, url: string, data?: any): Promise<any> {
    try {
      const response: AxiosResponse = await axios({ method, url, data });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async saveData(idClient: string, idClp: string, data: any): Promise<any> {
    console.log(data);
    const url = `${this.apiUrl}/${idClient}/${idClp}`;
    return await this.request('put', url, data);
  }

  async getData(idClient: string, idClp: string): Promise<any> {
    const url = `${this.apiUrl}/${idClient}/${idClp}`;
    return await this.request('get', url);
  }

  async saveDashboard(idClient: string, idClp: string, dashboard: any): Promise<any> {
    return await this.saveData(idClient, idClp, {"dashboard": dashboard});
  }

  async getDashboard(idClient: string, idClp: string): Promise<any> {
    try {
      return await this.getData(idClient, idClp);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      throw error;
    }
  }
}
