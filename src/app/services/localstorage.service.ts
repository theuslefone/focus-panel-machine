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
        { cols: 2, rows: 1, y: 1, x: 1 },
        { cols: 2, rows: 2, y: 0, x: 2 },
        { cols: 1, rows: 1, y: 0, x: 4 },
        { cols: 3, rows: 2, y: 1, x: 4 },
        { cols: 1, rows: 1, y: 4, x: 5 },
        { cols: 1, rows: 1, y: 2, x: 1 },
        { cols: 2, rows: 2, y: 5, x: 5 },
        { cols: 2, rows: 2, y: 3, x: 2 },
        { cols: 2, rows: 1, y: 2, x: 2 },
        { cols: 1, rows: 1, y: 3, x: 4 },
        { cols: 1, rows: 1, y: 0, x: 6 },
        { cols: 4, rows: 1, y: 0, x: 6 }
      ];
    }
  }

}