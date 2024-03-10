import { Injectable } from '@angular/core';
import { ImagePaths } from '../../models/type';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  public imagePaths : ImagePaths  = {
    logo: 'assets/images/logo.png',
    user_template: 'assets/images/template-user.png',
  };

  constructor() { }

  getImagePath(key: string): string | null {
    return this.imagePaths[key] || null;
  }
}
