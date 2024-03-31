import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LocalStorageService { 

  
  constructor(
  )
  { 
    
  }

  saveFromDashboard(storage:any, key:string, dashboard:any){
    storage.setItem(key, dashboard);
  }

  getDashboard(storage:any, machineId:string): any {
    let savedLayout = storage.getItem(`dashboard_${machineId}`);
    if (savedLayout) {
     return JSON.parse(savedLayout);
    } else {
      return [
        { cols: 3, rows: 2, y: 2, x: 3, key: 'Começe adicionando um gráfico' },
      ];
    }
  }

}