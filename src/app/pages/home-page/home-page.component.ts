import { NgForOf, CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

// Gridster +  Charts
import {
  GridsterComponent,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponent,
  GridsterPush,
  GridType,
  DisplayGrid
} from 'angular-gridster2';
import { ChartConfiguration, ChartEvent, ChartType, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';


// Services 
import { MachineDataService } from '../../services/machine/machine-data.service';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { ErrorService } from '../../services/error/error.service';
import { LoadingService } from '../../services/loading/loading.service';
import { RouteParamsService } from '../../services/routesParams/routes-params.service';
import { parse } from 'path';



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
    BaseChartDirective,

  ]
})

export class HomePageComponent implements OnInit {
  idClp!: any;
  idClient: string = '';
  options!: GridsterConfig;
  dashboard!: GridsterItem[];
  itemToPush!: GridsterItemComponent;
  machineList: any;
  machineDataChart: any;
  chartData: { [key: string]: any } = {};

  unsavedChanges: boolean = false;
  isLoadingChart: boolean = false;
  isFirstLoad: boolean = true; 
  Object: any;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | any;

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
      }
    },
  };

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'second',
        },
      },
      y: {
        min: 0,
      },
    },
    plugins: {
      legend: {
        display: true,
      }
    },
  };

  public temperatureChartOptions: ChartConfiguration<'line'>['options'] = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'second',
        },
      },
      y: {
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: {
        display: true,
      }
    },
  };

  public barChartType = 'bar' as const;
  public lineChartType = 'line' as const;
  public temperatureChartType = 'line' as const;

  public barChartData_nivel: ChartData<'bar'> = {
    labels: ['Data'],
    datasets: [],
  };

 public lineChartData_pressao: ChartData<'line'>  = {
    labels: ['Data'],
    datasets: [],
 }

  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
  }

  constructor(
    private route: ActivatedRoute,
    private machineDataService: MachineDataService,
    private cdr: ChangeDetectorRef,
    private dashboardService: DashboardService,
    private errorService: ErrorService,
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
      this.loadDashboard(this.idClient, this.idClp);
    });
  }

  async loadDashboard(idClient: any, idClp: any): Promise<void> {
    this.isLoadingChart = true;
    let defaultDashboardLayout = { x: 0, y: 0, key: 'Começe adicionando um gráfico', cols: 3, rows: 2 };

    try {
      let dashboardArray = await this.dashboardService.getDashboard(idClient, idClp);
      if (await dashboardArray) {
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
    } finally{
      this.isLoadingChart = false;
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
      if (dataMachine.length > 0) {
        let parsedData = JSON.parse(dataMachine[0].data).data;
        this.machineList = Object.keys(parsedData).map(key => ({ name: key, value: parsedData[key] }));
      } else {
        console.error('No data found in dataMachine array');
      }
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Failed to load machine data:', error);
    }
    this.loadingService.hide();
  }

  async loadMachineDataRealTime2(key: any, idClient: any, idClp: any): Promise<void> {
    try {
      let dataMachine = await this.machineDataService.getDataById(idClient, idClp);
      let parsedData = JSON.parse(dataMachine[0].data).data;

      if (!this.chartData[key]) {
        this.chartData[key] = [];
      } else if (this.chartData[key].length >= 2) {
        this.chartData[key].shift();
      }

      this.chartData[key].push([parsedData[key], dataMachine[0].date_time]);
      this.cdr.detectChanges();

    } catch (error) {
      console.error('Failed to load machine data:', error);
    }
  }

  async loadMachineDataRealTime(key: any, idClient: any, idClp: any): Promise<void> {
    if(this.isFirstLoad){
      this.isLoadingChart = true;
    }
    try {
      let dataMachine = await this.machineDataService.getDataById(idClient, idClp);
      let parsedData = JSON.parse(dataMachine[0].data).data;

      if (!this.chartData[key]) {
        this.chartData[key] = [];
      } else if (this.chartData[key].length >= 100) {
        this.chartData[key].shift();
      }

      this.chartData[key].push([parsedData[key], new Date(dataMachine[0].date_time).toISOString()]);

      console.log(this.chartData);

      if (this.chartData[key]) {
        const data: (number | [number, number] | null)[] = [];
        this.chartData[key].forEach(([value, timestamp]: [number, string]) => {
          const dateValue = new Date(timestamp).getTime();
          data.push([dateValue, value]);
        });

        switch(key){
          case 'nivel':
            this.barChartData_nivel.datasets.push({
              label: this.chartData[key][0][0],
              data :  this.chartData[key][0][1]
            });
    
            if (this.barChartData_nivel.datasets.length >= 5) {
              this.barChartData_nivel.datasets.shift();
            }
            break;
          case 'pressao':
            this.lineChartData_pressao.datasets.push({
              label: this.chartData[key][0][0],
              data :  this.chartData[key][0][1]
            });
    
            if (this.lineChartData_pressao.datasets.length >= 5) {
              this.lineChartData_pressao.datasets.shift();
            }
            break;
          case 'temperatura':
            this.lineChartData_pressao.datasets.push({
              label: this.chartData[key][0][0],
              data :  this.chartData[key][0][1]
            });
    
            if (this.lineChartData_pressao.datasets.length >= 5) {
              this.lineChartData_pressao.datasets.shift();
            }
            break;
        }
        
        this.chart?.update();
      }

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Failed to load machine data:', error);
    } finally {
      if(this.isFirstLoad){
        this.isLoadingChart = false;
        this.isFirstLoad = false;
      }    
    }
  }

  async changeMachine() {
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

  addItem(key: any): void {
    this.loadMachineDataRealTime(key, this.idClient, this.idClp);

    setInterval(() => {
      this.loadMachineDataRealTime(key, this.idClient, this.idClp);
    }, 5000);

    let uniqueId = this.generateUniqueId(key);

    this.dashboard.push({
      x: 0,
      y: 0,
      cols: 2,
      rows: 2,
      id: uniqueId,
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

  generateChartId(key: string): string {
    return 'chart_' + key;
  }
}