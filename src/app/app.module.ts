import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { ChartModule } from 'angular2-chartjs';
// import {GridsterComponent, GridsterItemComponent} from 'angular-gridster2';

// Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


// ANGULAR MATERIAL
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenav } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDatepickerModule} from '@angular/material/datepicker';

// Others
import { GridsterModule ,GridsterComponent, GridsterItemComponent} from 'angular-gridster2';
import { LocalStorageService } from './services/localstorage/localstorage.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSidenavModule,
    MatSidenav,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    GridsterComponent,
    GridsterItemComponent,
    GridsterModule 
    ],
  providers: [
    LocalStorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
