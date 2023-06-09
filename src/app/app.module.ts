import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { D3PieComponent } from './d3-pie/d3-pie.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
@NgModule({
  imports: [BrowserModule, FormsModule, MatIconModule, MatCardModule],
  declarations: [AppComponent, HelloComponent, D3PieComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
