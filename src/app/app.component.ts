import { Component, OnInit } from '@angular/core';
import { ImageService } from './services/images/images.service';
import { MachineDataService } from './services/machine/machine-data.service';
import { Router } from '@angular/router';

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

  constructor(
    private imageService: ImageService,
    private machineDataService: MachineDataService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.logoPath = this.imageService.getImagePath('logo') ?? "";
    this.fetchMachineData();
  }

  async fetchMachineData() {
    try {
      this.machineList = await this.machineDataService.getMachine();
    } catch (error) {
      console.error('Failed to fetch machine data:', error);
    }
  }

  redirectToHome(machineId: number) {
    this.router.navigate(['/home', machineId]);
  }
}
