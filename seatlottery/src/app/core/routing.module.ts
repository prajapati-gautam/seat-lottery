import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard.service';
import { LoginComponent } from '../auth/login/login.component';
import { NotfoundComponent } from './common/notfound/notfound.component';
import { VenueListComponent } from '../core/views/venue-list/venue-list.component';
import { BlockListComponent } from '../core/views/block-list/block-list.component';
import { EditVenueComponent } from '../core/views/venue-list/edit-venue/edit-venue.component';


@NgModule({
  imports: [RouterModule.forRoot(
    [{ path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, data: { title: 'Login' } },
    { path: 'venues', canActivate:[AuthGuard], component: VenueListComponent, data: { title: 'Venues' } },
    { path: 'venues/:id', canActivate:[AuthGuard], component: EditVenueComponent, data: { title: 'Edit Venues' } },
    { path: 'blocks/:id', canActivate:[AuthGuard], component: BlockListComponent, data: { title: 'Block' } },
    { path: 'notfound', component: NotfoundComponent, data: { title: '404' } },
    { path: '**', redirectTo: 'notfound'},
    
  ])],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class CoreRoutingModule {}




