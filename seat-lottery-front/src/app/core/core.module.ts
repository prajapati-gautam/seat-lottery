import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule  } from '@angular/http';
import { FormWizardModule } from 'angular2-wizard';
import { CoreRoutingModule } from './routing.module';
import { CreditCardDirectivesModule } from 'angular-cc-library';

/**page component */
import { VenuesComponent } from './venues/venues.component';
import { StadiumComponent } from './stadium/stadium.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { SeatSelectionComponent } from './stadium/seat-selection/seat-selection.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PaymentSuccessComponent } from './checkout/payment-success/payment-success.component'



@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    CoreRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    FormWizardModule,
    CreditCardDirectivesModule
  ],
  exports:[
    RouterModule,
    MaterialModule,
    CoreRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    FormWizardModule,
    CreditCardDirectivesModule
  ],
  declarations: [
    VenuesComponent,
    StadiumComponent,
    SeatSelectionComponent,
    NotfoundComponent,
    CheckoutComponent,
    PaymentSuccessComponent
  ],
  entryComponents:[SeatSelectionComponent],
  providers:[]
})
export class CoreModule { }
