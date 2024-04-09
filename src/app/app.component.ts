import { Component, OnInit } from '@angular/core';
import { ImageService } from './services/images/images.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MachineDataService } from './services/machine/machine-data.service';
import { DashboardService } from './services/dashboard/dashboard.service'; 


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'painel-focus';
  logoPath!: string;
  machineList: any;
  gridOptions: any;
  idClp: any;
  machineStatus : any;
  idClient: any;

  constructor(
    private imageService: ImageService,
    private machineDataService: MachineDataService,
    private router: Router,
    private route: ActivatedRoute,
    private dashboardService : DashboardService,
  ) {}
  

  ngOnInit(): void {
    this.logoPath = this.imageService.getImagePath('logo') ?? "";
    this.fetchMachineData();
  }
  

  async fetchMachineData() {
    this.route.paramMap.subscribe(async params => {
      this.idClient = params.get('idClient') || '1'; 
      this.idClp = params.get('idClp') || '2'; 
      
      try {
        this.machineList = await this.machineDataService.getMachine(this.idClient);
        this.machineStatus = this.machineDataService.getMachineById(this.idClp);
      } catch (error) {
        console.error('Failed to fetch machine data:', error);
      }
    });
  }

  redirectToHome(idClient: any, idClp: any) {
    this.router.navigate(['/home', idClient, idClp]);
  }
    
}
