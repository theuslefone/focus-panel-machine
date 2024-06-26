import { Injectable } from '@angular/core';
import { ImagePaths } from '../../models/type';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  public imagePaths : ImagePaths  = {
    logo: 'assets/images/logo.png',
    user_template: 'assets/images/template-user.png',
    status_1: 'assets/images/status_on.png',
    status: 'assets/images/status.png',
    status_0: 'assets/images/status_off.png',
    logoMobile: 'assets/images/logo_focus.png',
    loadChart: 'assets/images/loading-chart.gif'
  };

  constructor() { }

  getImagePath(key: string): string | null {
    return this.imagePaths[key] || null;
  }
}
