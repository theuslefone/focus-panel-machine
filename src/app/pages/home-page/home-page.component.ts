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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';


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
import { ChartConfiguration, ChartEvent, ChartType, ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';


// Services 
import { MachineDataService } from '../../services/machine/machine-data.service';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { ErrorService } from '../../services/error/error.service';
import { LoadingService } from '../../services/loading/loading.service';
import { RouteParamsService } from '../../services/routesParams/routes-params.service';
import { parse } from 'path';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ImageService } from '../../services/images/images.service';




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
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule 
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
  coordChart: any;
  timestampMachine: any;
  unsavedChanges: boolean = false;
  isLoadingChart: boolean = false;
  isFirstLoad: boolean = true;
  Object: any;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | any;
  lineChartType = 'line' as const;
  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };
  lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{
      data: [],
      label: ''
    }
    ],
  }
  lineChartdataArray: any[] = [];
  errorGetData: boolean = false;
  showDialog: boolean = true;
  loadChartImage: any;
  defaultDashboardLayout = [{ x: 0, y: 0, key: 'Começe adicionando um gráfico', cols: 3, rows: 2 }];


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
    private imageService: ImageService
  ) {

    this.route.paramMap.subscribe(params => {
      this.idClient = params.get('idClient') || '';
      this.idClp = params.get('idClp') || '';
      this.routeParamsService.setIdClient(this.idClient);
      this.routeParamsService.setIdClp(this.idClp);
    });

    this.loadDashboard(this.idClient, this.idClp);
    this.loadMachineData(this.idClient, this.idClp, true);
  }

  ngOnInit(): void {
    this.dashboard = [];
    this.loadChartImage = this.imageService.getImagePath('loadChart') ?? "";
    this.unsavedChanges = false;
    this.options = {
      gridType: GridType.Fixed,
      displayGrid: DisplayGrid.None,
      useBodyForBreakpoint: false,
      mobileBreakpoint: 500,
      pushItems: true,
      rowHeightRatio: 1,
      rowWidthRatio: 2,
      setGridSize: false,
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: true,
      enableEmptyCellDrag: true,
      enableOccupiedCellDrop: true,
      emptyCellClickCallback: this.emptyCellClick.bind(this),
      emptyCellContextMenuCallback: this.emptyCellClick.bind(this),
      emptyCellDropCallback: this.emptyCellClick.bind(this),
      emptyCellDragCallback: this.emptyCellClick.bind(this),
      emptyCellDragMaxCols: 50,
      emptyCellDragMaxRows: 50,
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

  // SERVICES
  // - Dashboard

  async loadDashboard(idClient: any, idClp: any): Promise<void> {
    this.isLoadingChart = true;
    try {
      let dashboardArray = await this.dashboardService.getDashboard(idClient, idClp);
      if(JSON.parse(dashboardArray[0].dashboard) != 'null' && JSON.parse(dashboardArray[0].dashboard) != null &&  JSON.parse(dashboardArray[0].dashboard).length > 0){
        this.dashboard = JSON.parse(dashboardArray[0].dashboard);
      }else{
        this.dashboard = this.defaultDashboardLayout;
      }
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
    }
  }

  async saveDashboardLayout(): Promise<void> {
    try {
      this.unsavedChanges = false;
      await this.dashboardService.saveDashboard(this.idClient, this.idClp, this.dashboard);
      alert('Layout do dashboard salvo com sucesso.');
    } catch (error) {
      this.unsavedChanges = true;
      alert(this.errorService.getErrorMessage('saveDashboard'));
      console.error('Erro ao tentar salvar o layout do dashboard:', error);
    }
  }

  // - Machines

  async loadMachineData(idClient: any, idClp: any, realTime: boolean): Promise<void> {
    this.loadingService.show();
    try {
      let dataMachine = await this.machineDataService.getDataById(idClient, idClp);
      if (dataMachine.length > 0) {
        let parsedData = JSON.parse(dataMachine[0].data);
        this.machineList = Object.keys(parsedData).map(key => ({ name: key, value: parsedData[key] }));
        if (realTime) {
          this.isLoadingChart = false;
          this.loadMachineDataRealTime();
        }
      } else {
        console.error('No data found in dataMachine array');
      }
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Failed to load machine data:', error);
      this.errorGetData = true;
    } finally {
      this.loadingService.hide();
    }
  }

  async loadMachineDataRealTime(): Promise<void> {
    this.isLoadingChart = true;
    try {
      setInterval(async () => {
        try {
          let dataMachine = await this.machineDataService.getDataById(this.idClient, this.idClp);
          this.dashboard.forEach(async (item: any) => {
            if (!this.chartData[item.key]) {
              this.chartData[item.key] = [];
            } else if (this.chartData[item.key].length >= 5) {
              this.chartData[item.key].shift();
            }
            
            if (!this.lineChartdataArray[item.key]) {
              this.lineChartdataArray[item.key] = this.lineChartData;
            } else {
              if (await dataMachine) {
                let data = JSON.parse(await dataMachine[0]?.data);
                this.timestampMachine = new Date(await dataMachine[0]?.date_time).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                
                if (data) {
                  if (this.lineChartdataArray[item.key]?.datasets[0].data.length >= 10) {
                    this.lineChartdataArray[item.key]?.datasets[0].data.shift();
                    this.lineChartdataArray[item.key]?.labels.shift();
                  }
                  
                  this.lineChartdataArray[item.key]?.datasets[0].data.push(data[item.key]);
                  this.lineChartdataArray[item.key].datasets[0].label = item.key;
                  this.lineChartdataArray[item.key]?.labels?.push(this.timestampMachine);
                
                  this.isLoadingChart = false;
                  this.cdr.detectChanges();
                  this.chart.update();
           
                }
              }
            }
          });
          this.cdr.detectChanges();
        } catch (error) {
          console.error('Failed to load machine data:', error);
        }
      }, 5000);
    } catch (error) {
      console.error('Failed to start real-time data fetching:', error);
    }
  }

  async addTagOnChart(key: any): Promise<any>{
    key = 'SP_VelocVacuum';

    const newDataset = {
      data: [1.2, 0.5, 0.8, 2,4, 2, 1, 3, 4, 8 ,2 ],
      label: 'Tensão secadora',
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)' 
    };
    this.lineChartdataArray[key].datasets.push(newDataset);  
    this.chart.update();
  }

  // GRIDSTER

  emptyCellClick(event: MouseEvent, item: GridsterItem): void {
    this.coordChart = [{ x: item.x, y: item.y }];
  }

  dragStartHandler(ev: DragEvent): void {
    if (ev.dataTransfer) {
      ev.dataTransfer.setData('text/plain', 'Drag Me Button');
      ev.dataTransfer.dropEffect = 'copy';
    }
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
    let uniqueId = this.generateUniqueId(key);
    this.dashboard.push({
      x: this.coordChart[0].x,
      y: this.coordChart[0].y,
      cols: 2,
      rows: 1,
      id: uniqueId,
      idClp: this.idClp,
      key: key,
    });
    this.unsaveChanges();
  }


  initItem(item: GridsterItem, itemComponent: GridsterItemComponent): void {
    alert('initItem');
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
    alert('getItem')
    if (this.options.api && this.options.api.getItemComponent) {
    }
  }

  // DASHBOARD

  unsaveChanges(): void {
    this.unsavedChanges = true;
  }

  // UTILS

  generateUniqueId(key: any): string {
    return key + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateChartId(key: string): string {
    return 'chart_' + key;
  }

  returnDate(key: any) {
    if (this.lineChartdataArray[key]) {
      return this.lineChartdataArray[key];
    } else {
      this.lineChartdataArray[key] = this.lineChartData;
      // console.log(this.lineChartdataArray[key]);
      return this.lineChartdataArray[key];
    }
  }

  addTags(item: any){
    this.addTagOnChart(item);
  }

}