import { HomePageComponent } from './pages/home-page/home-page.component';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ImageService } from './services/images/images.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MachineDataService } from './services/machine/machine-data.service';
import { DashboardService } from './services/dashboard/dashboard.service'; 
import { RouteParamsService } from './services/routesParams/routes-params.service';

interface Machine {
  name: string;
  status: any;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'painel-focus';
  logoPath!: string;
  logoPathMobile!: string;
  statusImg!: string;
  machineList: any;
  gridOptions: any;
  idClp: any;
  machine!: Promise<Machine>;
  idClient: any;
  machineName!: string;

  constructor(
    private imageService: ImageService,
    private machineDataService: MachineDataService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private routeParamsService: RouteParamsService,
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.fetchMachineData(); 
        this.statusImg = this.imageService.getImagePath('status') ?? "";
      }
    });
  }
  
  ngOnInit(): void {
    this.logoPath = this.imageService.getImagePath('logo') ?? "";
    this.logoPathMobile = this.imageService.getImagePath('logoMobile') ?? "";
    
    this.statusImg = this.imageService.getImagePath('status') ?? "";
  }
  
  async fetchMachineData() {
    this.routeParamsService.idClient$.subscribe(idClient => {
      this.idClient = idClient;
    });
    this.routeParamsService.idClp$.subscribe(idClp => {
      this.idClp = idClp;
    });

    try {
      this.machineList = await this.machineDataService.getMachine(this.idClient);
      this.machine = this.machineDataService.getMachineById(this.idClient, this.idClp);
      this.machine.then((obj: any) => {
        this.statusImg = this.imageService.getImagePath('status_' + obj[0].status ) ?? "";
        this.machineName = obj[0].name;
      })
      
      this.cdr.detectChanges(); 
    } catch (error) {
      console.error('Failed to fetch machine data:', error);
    }
  }

  formatMachineName(name: string | undefined): string {
    if (name) {
      const match = name.match(/([a-zA-Z]+)(\d+)/);
      if (match) {
        const prefix = match[1];
        const number = match[2];
        return prefix + ' ' + number;
      }
    }
    return '';
  }
  
  redirectToHome(idClient: any, idClp: any) {
    this.router.navigate(['/home', idClient, idClp]);
  }
    
}
