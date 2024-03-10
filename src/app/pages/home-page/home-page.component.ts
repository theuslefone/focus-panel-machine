import { NgForOf } from '@angular/common';
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


import {
  CompactType,
  GridsterComponent,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponent,
  GridsterPush,
  GridType
} from 'angular-gridster2';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    NgForOf,

    MatButtonModule,
    MatIconModule,
    GridsterComponent,
    GridsterItemComponent
  ]
})

export class HomePageComponent implements OnInit {
  options!: GridsterConfig;
  dashboard!: GridsterItem[];
  itemToPush!: GridsterItemComponent;
  machineId! : any;
  machineList!: any;
 
  constructor(
    private route: ActivatedRoute,
    private machineDataService: MachineDataService,
    private cdr: ChangeDetectorRef

    ) { 
      
    }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.machineId = params['id'];
      this.loadMachineData(this.machineId);
    });

    this.options = {
      gridType: GridType.Fit,
      compactType: CompactType.None,
      pushItems: true,
      draggable: {
        enabled: true
      },
      resizable: {
        enabled: true
      }
    };

    this.dashboard = [
      { cols: 2, rows: 1, y: 0, x: 0 },
      { cols: 2, rows: 2, y: 0, x: 2 },
      { cols: 1, rows: 1, y: 0, x: 4 },
      { cols: 3, rows: 2, y: 1, x: 4 },
      { cols: 1, rows: 1, y: 4, x: 5 },
      { cols: 1, rows: 1, y: 2, x: 1 },
      { cols: 2, rows: 2, y: 5, x: 5 },
      { cols: 2, rows: 2, y: 3, x: 2 },
      { cols: 2, rows: 1, y: 2, x: 2 },
      { cols: 1, rows: 1, y: 3, x: 4 },
      { cols: 1, rows: 1, y: 0, x: 6 }
    ];

    this.route.params.subscribe(params => {
      this.loadMachineData(params['id']);
    });
  }

  async loadMachineData(machineId: any): Promise<void> {
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

  addItem(id:any): void {
    this.dashboard.push({ x: 0, y: 0, cols: 1, rows: 1 });
    console.log(id);
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
  }

  getItemComponent(): void {
    if (this.options.api && this.options.api.getItemComponent) {
      console.log(this.options.api.getItemComponent(this.dashboard[0]));
    }
  }
}