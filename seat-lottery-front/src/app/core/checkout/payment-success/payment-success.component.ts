import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../common/services/base.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {

  public paymentData : any = "";
  public ticket : any = "";
  constructor(private bs : BaseService) { }

  ngOnInit() {
    localStorage.removeItem('selected_seat');
    this.paymentData = this.bs.getTransection();
    this.getTicket();
  }

  getTicket(){

    if(typeof this.paymentData === "undefined"){
      this.bs.gotoPage('/checkout');
    }else{
      let time = setInterval(() => {
        this.bs.getEntrieTickit(`${this.paymentData['transaction_id']}/${this.paymentData['reference']}`)
      .subscribe(
        (r)=>{ this.ticket = r[0]; 
          clearInterval(time);
        },
        (error)=>{}
      )
      }, 1000);
    } 
  }
  

}
