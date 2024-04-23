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
            body: data.dashboard
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response;
    } catch (error) {
        throw error;
    }
} 
  async saveData(idClient: string, idClp: string, data: any): Promise<any> {
    const url = `${this.apiUrl}/${idClient}/${idClp}`;
    const { dashboard } = data;
  
    const requestData = {
      dashboard: JSON.stringify(dashboard)
    };
  
    return await this.request('PUT', url, requestData);
  }
  
  

  private async getRequest(url: string): Promise<any> {
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getData(idClient: string, idClp: string): Promise<any> {
    const url = `${this.apiUrl}/${idClient}/${idClp}`;
    return await this.getRequest(url);
  }

  async saveDashboard(idClient: string, idClp: string, dashboard: any): Promise<any> {
    return await this.saveData(idClient, idClp, { dashboard });
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
