import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import axios from 'axios';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})

export class MachineDataService {

  private apiUrl = 'http://localhost:3333/machineData/';
  idClient: string = '';
  constructor() { }

  getMachine(idClient:string): Promise<any> {
    this.idClient = idClient;
    return axios.get(`${this.apiUrl}?idClient=${idClient}`, {
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
      let machines = await this.getMachine(this.idClient);
      let machine;
      for (let i = 0; i < machines.length; i++) {
        if (machines[i].id == id) {
            machine = machines[i];
            break;
        }
      }

      return machine || null;
    } catch (error) {
      console.error('Failed to get machine by ID:', error);
      throw error;
    }
  }

}
