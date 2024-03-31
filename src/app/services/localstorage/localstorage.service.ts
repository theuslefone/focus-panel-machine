import { Injectable } from '@angular/core';
import { MachineDataService } from '../machine/machine-data.service';

@Injectable({
  providedIn: 'root'
})

export class LocalStorageService { 

  
  constructor(   
    private machineDataService: MachineDataService,
  )
  { 
    
  }

  saveFromDashboard(storage:any, key:string, dashboard:any){
    storage.setItem(key, dashboard);
  }

  getDashboard(storage:any, machineId:string): any {
    let savedLayout = storage.getItem(`dashboard_${this.machineDataService.idClient}-${machineId}`);
    if (savedLayout) {
     return JSON.parse(savedLayout);
    } else {
      return [
        { cols: 3, rows: 2, y: 0, x: 0, key: 'Começe adicionando um gráfico' },
      ];
    }
  }

}