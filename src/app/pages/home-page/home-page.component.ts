import { NgForOf, CommonModule  } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MachineDataService } from '../../services/machine/machine-data.service';
import {MatMenuModule} from '@angular/material/menu';

import {
  CompactType,
  GridsterComponent,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponent,
  GridsterPush,
  GridType,
  DisplayGrid
} from 'angular-gridster2';
import { DashboardService } from '../../services/dashboard/dashboard.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    NgForOf,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    GridsterComponent,
    GridsterItemComponent,
  ]
})

export class HomePageComponent implements OnInit {
  options!: GridsterConfig;
  dashboard!: GridsterItem[];
  itemToPush!: GridsterItemComponent;
  idClp! : any;
  machineList: any;
  unsavedChanges : boolean = false;
  idClient : string = ''; 
 
  constructor(
    private route: ActivatedRoute,
    private machineDataService: MachineDataService,
    private cdr: ChangeDetectorRef,
    private dashboardService : DashboardService
    ) { 
      
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idClient = params['idClient']
      this.idClp = params['id'];
      this.options = {};
      this.dashboard = [];
      this.unsavedChanges = false;

      this.loadMachineData(this.idClp);
    });

 
  }

  async loadMachineData(idClp: any): Promise<void> {
    try {
      let dashboardArray =  await this.dashboardService.getDashboard(this.idClient, this.idClp);

      const dashboardOptions = JSON.parse(await dashboardArray[0].options);
      if(dashboardOptions){
        for (const key in this.options) {
          if (dashboardOptions.hasOwnProperty(key)) {
            this.options[key] = dashboardOptions[key];
          }
        }
      } else{
        this.options = {
          gridType: GridType.Fixed,
          displayGrid: DisplayGrid.None,
          fixedColWidth: 250,
          fixedRowHeight: 250,
          keepFixedHeightInMobile: true,
          keepFixedWidthInMobile: true,
          useBodyForBreakpoint: false,
          mobileBreakpoint: 500,
          pushItems: true,
          rowHeightRatio: 1,
          setGridSize: false,
          draggable: {
            enabled: true
          },
          resizable: {
            enabled: true
          }
        };
      }

      const dashboardLayout = JSON.parse(await dashboardArray[0].dashboard);
      if(dashboardLayout){
        this.dashboard.push({
          x: dashboardLayout.x,
          y: dashboardLayout.y,
          key: dashboardLayout.key,
          cols: dashboardLayout.cols,
          rows: dashboardLayout.rows
        });
      } else {
        const defaultDashboardLayout = { x: 0, y: 0, key: 'Começe adicionando um gráfico', cols: 3, rows: 2 };
        this.dashboard.push(defaultDashboardLayout);
      }
      
      const machineListResponse = await this.machineDataService.getMachineById(idClp);
      if (machineListResponse && machineListResponse.data) {
        this.machineList = await this.machineDataService.getMachineById(idClp);
        this.machineList = this.machineList.data;
      }
      this.cdr.detectChanges(); 

    } catch (error) {
      console.error('Failed to load machine data:', error);
    }
  }

  async loadAllMachineData(idClp: any): Promise<void> {
    try {
      this.machineList = await this.machineDataService.getMachineById(idClp);
      this.cdr.detectChanges(); 
    } catch (error) {
      console.error('Failed to load machine data:', error);
    }
  }

  async changeMachine(){
    this.loadMachineData(this.idClp);
  }

  unsaveChanges(): void {
    this.unsavedChanges = true;
  }

  changedOptions(): void {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  removeItem($event: MouseEvent | TouchEvent, item: GridsterItem): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem(key:any): void {
    this.dashboard.push(
      { x: 0,
        y: 0,
        cols: 2,
        rows: 2,
        id: this.generateUniqueId(key),
        idClp: this.idClp, 
        key: key,
       });
    this.unsaveChanges();
  }

  generateUniqueId(key: any): string {
    return key + '_' + Math.random().toString(36).substr(2, 9);
  }

  initItem(item: GridsterItem, itemComponent: GridsterItemComponent): void {
    this.itemToPush = itemComponent;
  }

  pushItem(): void {
    const push = new GridsterPush(this.itemToPush); 
    this.itemToPush.$item.rows += 4; 
    if (push.pushItems(push.fromNorth)) {
      push.checkPushBack(); 
      push.setPushedItems(); 
      this.itemToPush.setSize();
      this.itemToPush.checkItemChanges(
        this.itemToPush.$item,
        this.itemToPush.item
      );
    } else {
      this.itemToPush.$item.rows -= 4;
      push.restoreItems(); 
    }
    push.destroy(); 
    this.unsaveChanges();
  }

  getItemComponent(): void {
    if (this.options.api && this.options.api.getItemComponent) {
    }
  }

  async saveDashboardLayout(): Promise<void> {
    try {
      await this.dashboardService.saveDashboard(this.idClient, this.idClp, this.dashboard);
      console.log('Layout do dashboard salvo com sucesso.');
      this.unsavedChanges = false;
    } catch (error) {
      console.error('Erro ao tentar salvar o layout do dashboard:', error);
    }
  }
}