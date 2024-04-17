import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { GridsterModule } from 'angular-gridster2';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';

@NgModule({
  declarations: [
    AppComponent,
    LoadingOverlayComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    GridsterModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
