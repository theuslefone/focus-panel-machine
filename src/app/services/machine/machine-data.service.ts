import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MachineDataService {

  private apiUrl = 'http://localhost:3000/api';
  idClient: string = '';

  constructor() { }

  async getMachine(idClient: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/clp_data/${idClient}`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get machine:', error);
      throw error;
    }
  }

  async getMachineById(idClient: any, id: any): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/clp_data/${idClient}/${id}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Failed to get machine by ID:', error);
      throw error;
    }
  }

  async getDataById(idClient: string, id: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/clp_history/${idClient}/${id}`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get data by ID:', error);
      throw error;
    }
  }

  async getDataByDateRangeById(idClient: string, id: string, startDate: string, endDate: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/clp_history/${idClient}/${id}/${startDate}/${endDate}`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get data by date range:', error);
      throw error;
    }
  }
}
