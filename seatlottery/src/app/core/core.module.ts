import { NgModule } from '@angular/core';
import {ToastaModule} from 'ngx-toasta';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule  } from '@angular/http';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../auth/auth.service';
import { CoreRoutingModule } from './routing.module';
import { NotfoundComponent } from './common/notfound/notfound.component';
import { LoginComponent } from '../auth/login/login.component';
import { VenueListComponent } from '../core/views/venue-list/venue-list.component';
import { EditVenueComponent } from '../core/views/venue-list/edit-venue/edit-venue.component';
import { BlockListComponent } from '../core/views/block-list/block-list.component';
import { EditBlockComponent } from '../core/views/block-list/edit-block/edit-block.component';
import { ViewHeaderComponent } from './common/view-header/view-header.component';
import { SvgMapComponent } from './views/svg-map/svg-map.component';

import { DomChangeDirective } from './services/dom.directive';

import { baseService } from '../core/services/base.service';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    CoreRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    ToastaModule.forRoot()
  ],
  exports:[
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ToastaModule
  ],
  declarations: [
    NotfoundComponent,
    LoginComponent,
    ViewHeaderComponent,
    VenueListComponent,
    EditVenueComponent,
    BlockListComponent,
    EditBlockComponent,
    SvgMapComponent,
    DomChangeDirective
  ],
  entryComponents:[
    EditBlockComponent
  ],
  providers:[
    AuthService,
    ApiService,
    baseService
  ]
})
export class CoreModule { }
