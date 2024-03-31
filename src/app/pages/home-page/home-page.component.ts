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
import { LocalStorageService } from '../../services/localstorage/localstorage.service';

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
  machineId! : any;
  machineList: any;
  unsavedChanges : boolean = false;
 
  constructor(
    private route: ActivatedRoute,
    private machineDataService: MachineDataService,
    private cdr: ChangeDetectorRef,
    private localStorageService: LocalStorageService
    ) { 
      
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.machineId = params['id'];
      this.loadMachineData(this.machineId);
      this.unsavedChanges = false;
    });

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

  async loadMachineData(machineId: any): Promise<void> {
    try {
      this.machineList = await this.machineDataService.getMachineById(machineId);
      this.machineList = this.machineList.data;
      this.getDashboard()
      this.cdr.detectChanges(); 
    } catch (error) {
      console.error('Failed to load machine data:', error);
    }
  }

  async loadAllMachineData(machineId: any): Promise<void> {
    try {
      this.machineList = await this.machineDataService.getMachineById(machineId);
      this.cdr.detectChanges(); 
    } catch (error) {
      console.error('Failed to load machine data:', error);
    }
  }

  async changeMachine(){
    this.loadMachineData(this.machineId);
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
        rows: 1,
        id: this.generateUniqueId(key),
        machineId: this.machineId, 
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
      console.log(this.options.api.getItemComponent(this.dashboard[0]));
    }
  }

  saveDashboardLayout(): void {
    try {
      this.localStorageService.saveFromDashboard(localStorage ,`dashboard_${this.machineDataService.idClient}-${this.machineId}`, JSON.stringify(this.dashboard));
      console.log('Layout do dashboard salvo com sucesso.');
      this.unsavedChanges = false;
    } catch (error) {
      console.error('Erro ao tentar salvar o layout do dashboard:', error);
    }
  }

  getDashboard(): void {
      this.dashboard =  this.localStorageService.getDashboard(localStorage, this.machineId);
  }
  
}