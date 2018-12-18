import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VenuesComponent } from './venues/venues.component';
import { StadiumComponent } from './stadium/stadium.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PaymentSuccessComponent } from './checkout/payment-success/payment-success.component';
import { NotfoundComponent } from './notfound/notfound.component';

@NgModule({
  imports: [RouterModule.forRoot(
    [{ path: '', redirectTo: 'venues', pathMatch: 'full' },
     { path: 'venues', component:VenuesComponent, data:{ title:"Availabel Venues" }},
     { path: 'stadium/:id', component:StadiumComponent, data:{ title:"Stadium" }},
     { path: 'checkout', component:CheckoutComponent, data:{ title:"Checkout" }},
     { path: 'checkout-success', component:PaymentSuccessComponent, data:{ title:"Checkout Success" }},
     { path: 'notfound', component:NotfoundComponent, data:{ title:"Page not found" }},
    { path: '**', redirectTo: 'notfound'},
  ])],
  exports: [RouterModule],
  providers:[]
})
export class CoreRoutingModule {}




