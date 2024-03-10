import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import axios from 'axios';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class MachineDataService {

  private apiUrl = 'http://localhost:3333/machineData/';

  constructor() { }

  getMachine(): Promise<any> {
    return axios.get(this.apiUrl, {
      headers: {
        'Accept': 'application/json'
      }
    }).then(res => res.data)
      .catch(err => {
        console.error(err);
        throw err;
      });
  }

  async getMachineById(id: any): Promise<any> {
    try {
      const machines = await this.getMachine();
      const machine = machines.find((m: any) => m.id === id);
      return machine || null;
    } catch (error) {
      console.error('Failed to get machine by ID:', error);
      throw error;
    }
  }

}
