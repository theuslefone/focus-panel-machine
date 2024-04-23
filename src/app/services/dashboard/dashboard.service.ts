import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://webcaseiot.com.br:3000/api/dashboard';

  constructor() { }

  private async request(method: string, url: string, data?: any): Promise<any> {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async saveData(idClient: string, idClp: string, data: any): Promise<any> {
    const url = `${this.apiUrl}/${idClient}/${idClp}`;
    return await this.request('PUT', url, data);
  }

  async getData(idClient: string, idClp: string): Promise<any> {
    const url = `${this.apiUrl}/${idClient}/${idClp}`;
    return await this.request('GET', url);
  }

  async saveDashboard(idClient: string, idClp: string, dashboard: any): Promise<any> {
    return await this.saveData(idClient, idClp, { "dashboard": dashboard });
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
