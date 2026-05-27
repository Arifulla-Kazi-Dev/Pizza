import { NgModule } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser'; // Import bootstrapApplication
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';

@NgModule({
  imports: [BrowserModule, FormsModule, CommonModule, AppComponent, IndexComponent], // Import components here
  providers: [],
})
export class AppModule {}
