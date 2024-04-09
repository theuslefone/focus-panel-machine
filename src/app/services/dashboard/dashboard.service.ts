import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:3000/api/dashboard'; 

  constructor() { }

  async saveData(idClient: string, idClp: string, data: any): Promise<any> {
    const url = `${this.apiUrl}/${idClient}/${idClp}`;
    try {
      const response = await axios.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getData(idClient: string, idClp: string): Promise<any> {
    const url = `${this.apiUrl}/${idClient}/${idClp}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async saveDashboard(idClient: string, idClp: string, dashboard: any ): Promise<any> {
    try {
      return await this.saveData(idClient, idClp, dashboard);
    } catch (error) {
      throw error;
    }
  }

  async getDashboard(idClp:string, idClient:string): Promise<any> {
    try {
      const savedLayout = await this.getData(idClient, idClp);
      return savedLayout;
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      throw error;
    }
  }
}
