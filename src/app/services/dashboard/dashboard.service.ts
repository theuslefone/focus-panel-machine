import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:3000/api/dashboard'; 

  constructor() { }

  async saveData(machineId: string, data: any, idClient: string): Promise<any> {
    const url = `${this.apiUrl}/${idClient}/${machineId}`;
    try {
      const response = await axios.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getData(machineId: string, idClient: string): Promise<any> {
    const url = `${this.apiUrl}/${idClient}/${machineId}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  saveFromDashboard(storage:any, key:string, dashboard:any){
    storage.setItem(key, dashboard);
  }

  async getDashboard(machineId:string, idClient:string): Promise<any> {
    try {
      const savedLayout = await this.getData(idClient, machineId);
      return savedLayout;
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      throw error;
    }
  }
}
