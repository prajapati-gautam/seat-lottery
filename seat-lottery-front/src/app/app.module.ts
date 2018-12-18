import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common'
import "hammerjs";
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { ToastaModule } from 'ngx-toasta';
import { ApiService } from './core/common/services/api.service';
import { BaseService } from './core/common/services/base.service';
import { HeaderComponent } from './core/common/header/header.component';
import { CoreModule } from './core/core.module';


import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    Ng4LoadingSpinnerModule.forRoot(),
    ToastaModule.forRoot(),
    CoreModule
  ],
  providers: [
    ApiService,
    BaseService,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
