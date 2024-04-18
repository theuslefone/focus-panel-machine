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
import { MachineDataService } from '../../services/machine/machine-data.service';
import {MatMenuModule} from '@angular/material/menu';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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
import { ErrorService } from '../../services/error/error.service';
import { LoadingService } from '../../services/loading/loading.service';
import { RouteParamsService } from '../../services/routesParams/routes-params.service';

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
  unsavedChanges : boolean = false;
  idClp! : any;
  idClient : string = ''; 
  Object: any;
  machineList: any;
  machineDataChart: any;
  chartData: { [key: string]: any } = {};
  chartLabels: any;
  chartType: any = 'line';
  chart: any = [];


  constructor(
    private route: ActivatedRoute,
    private machineDataService: MachineDataService,
    private cdr: ChangeDetectorRef,
    private dashboardService : DashboardService,
    private errorService : ErrorService,
    private loadingService: LoadingService,
    private routeParamsService: RouteParamsService, 
    ) { 

      this.route.paramMap.subscribe(params => {
        this.idClient = params.get('idClient') || ''; 
        this.idClp = params.get('idClp') || ''; 
        this.routeParamsService.setIdClient(this.idClient);
        this.routeParamsService.setIdClp(this.idClp);
      });
      
      this.loadMachineData(this.idClient, this.idClp);
      this.loadDashboard(this.idClient, this.idClp);
  }

  ngOnInit(): void {
    this.options = {};
    this.dashboard = [];
    this.unsavedChanges = false;
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
    this.route.paramMap.subscribe(params => {
      this.idClient = params.get('idClient') || ''; 
      this.idClp = params.get('idClp') || '';
    });
  }  
  
  async loadDashboard(idClient: any, idClp: any): Promise<void> {
    let defaultDashboardLayout = { x: 0, y: 0, key: 'Começe adicionando um gráfico', cols: 3, rows: 2 };
  
    try {   
      let dashboardArray = await this.dashboardService.getDashboard(idClient, idClp);
      if(await dashboardArray){
        this.dashboard = JSON.parse(dashboardArray[0].dashboard); 
      } else {
        this.dashboard = [defaultDashboardLayout];
      }

      this.dashboard.forEach((item: any) => {
        this.loadMachineDataRealTime(item.key, this.idClient, this.idClp);
      });
      
      this.cdr.detectChanges(); 
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    }
  }

  async saveDashboardLayout(): Promise<void> {
    try {
      this.unsavedChanges = false;
      await this.dashboardService.saveDashboard(this.idClient, this.idClp, this.dashboard);
      console.log('Layout do dashboard salvo com sucesso.');
    } catch (error) {
      this.unsavedChanges = true;
      alert(this.errorService.getErrorMessage('saveDashboard'));
      console.error('Erro ao tentar salvar o layout do dashboard:', error);
    }
  }
  
  async loadMachineData(idClient: any, idClp: any): Promise<void> {
    this.loadingService.show();
    try {
      let dataMachine = await this.machineDataService.getDataById(idClient, idClp);
      let parsedData = JSON.parse(dataMachine[0].data).data;
      this.machineList = Object.keys(parsedData).map(key => ({ name: key, value: parsedData[key] }));
      console.log(this.machineList);
      this.cdr.detectChanges(); 
    } catch (error) {
      console.error('Failed to load machine data:', error);
    }
    this.loadingService.hide();
  }

  async loadMachineDataRealTime(key:any, idClient: any, idClp: any): Promise<void>{
    try {
      let dataMachine = await this.machineDataService.getDataById(idClient, idClp);
      this.machineDataChart = await JSON.parse(dataMachine[0].data).data;
      
      if (!this.chartData[key]) {
        this.chartData[key] = [];
      } else if (this.chartData[key].length >= 5) {
          this.chartData[key].shift();
      }

      this.chartData[key].push([this.machineDataChart[key], dataMachine[0].date_time ]);

    } catch (error) {
      console.error('Failed to load machine data:', error);
    }
  }

  async changeMachine(){
    this.loadMachineData(this.idClient, this.idClp);
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
    this.loadMachineDataRealTime(key, this.idClient, this.idClp);

    setInterval(() => {
      this.loadMachineDataRealTime(key, this.idClient, this.idClp);
    }, 5000);

    this.dashboard.push({ 
      x: 0,
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
    alert('initItem');
    this.itemToPush = itemComponent;
  }

  pushItem(): void {
    alert('Push');

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
    alert('getItem')
    if (this.options.api && this.options.api.getItemComponent) {
    }
  }
}