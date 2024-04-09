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
  machineId: any;
  machineStatus : any;
  idClient: string = '001';

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
    this.route.params.subscribe(params => {
      this.machineId = params['id'];
    });

    try {
      this.machineList = await this.machineDataService.getMachine(this.idClient);
      this.machineStatus = this.machineDataService.getMachineById(this.machineId);
      console.log(this.machineId);
    } catch (error) {
      console.error('Failed to fetch machine data:', error);
    }
  }

  redirectToHome(machineId: number) {
    this.router.navigate(['/home', machineId]);
  }
}
