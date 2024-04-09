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

  saveFromDashboard(key:string, dashboard:any){
    
  }

  getDashboard(machineId:string): any {
  

    return [
      { cols: 3, rows: 2, y: 0, x: 0, key: 'Começe adicionando um gráfico' },
    ];

    let savedLayout = ''; // storage.getItem(`dashboard_${this.machineDataService.idClient}-${machineId}`);
    if (savedLayout) {
    return JSON.parse(savedLayout);
    } else {
      return [
        { cols: 3, rows: 2, y: 0, x: 0, key: 'Começe adicionando um gráfico' },
      ];
    }
  }

}