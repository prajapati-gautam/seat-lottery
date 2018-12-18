import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm, FormControl, AbstractControl } from '@angular/forms'
import { BaseService } from '../common/services/base.service';
import { _CONSTANTS, jsonEqual } from '../common/modal/default';
import { UserBooking } from '../common/modal/seatbooking';
import { CurrentGame } from '../common/modal/game';
import { CustomValidators, ConfirmValidParentMatcher, errorMessages } from '../common/form-validator/customValidater';
import { CreditCardValidator, CreditCard } from 'angular-cc-library';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  currentGame: any;
  private customerId : string;
  defaults: any;
  userBookingFields: any;
  confirmValidParentMatcher: any;
  userBookingStep1: FormGroup;
  userBookingStep2: FormGroup;
  userBookingStep3: FormGroup;
  cardTypeImage: string = "unknown";
  cvvMaxLength: number = 3;
  errors = errorMessages;
  isCompleted: boolean = false;
  userData : any;
  finalReview : false;
  _frequency: string = "";
  sandboxData : object = {
    customer : {},
    options  : {},
    billing_address:{}
  };

  sandboxPaymentToken : object = {
      billing_address:{},
      card :{},
      customer:{},
      customer_id:"",
      service:""
  }

  sandboxPayment : object = {
      billing_address :{},
      customer : {},
      options:{},
  }

  packege: object = {
    paymentFrequency: [],
    entries: null,
    price: null,
    currency:"",
  }

  customer : object = {
		email:"",
		first_name:"",
		last_name:"",
		phone:"",
  }

  constructor(private bs: BaseService, private fb: FormBuilder) {
    this.defaults = new _CONSTANTS();
    this.userBookingFields = new UserBooking();
    this.currentGame = new CurrentGame();
    this.confirmValidParentMatcher = new ConfirmValidParentMatcher();
  }
  
  ngOnInit() {
    this.testGameId();

    this.bs.getGameJson().subscribe(rs => {
      console.log(rs);
      
      this.bs.hideLoader();
      this.currentGame = rs;
      this.userBookingStep1.get('entries').patchValue(1);
      this.userBookingStep1.get('grandTotal').patchValue(this.currentGame['price']);
      this.packege['currency'] = this.currentGame['currency'];
      this.userBookingStep1.get('currency').patchValue(this.currentGame['currency']);
      this.packege['paymentFrequency'] = this.currentGame['payment_frequencies'];
    })

    this.userBookingStep1 = this.fb.group({
      affilliate : [''],
      currency   : [''],
      entries: [this.userBookingFields.entries, Validators.required],
      paymentFrequency: [this.userBookingFields.paymentFrequency, Validators.required],
      grandTotal: [this.userBookingFields.grandTotal, Validators.required],
    });

    this.userBookingStep1.get('grandTotal').disable();
    this.userBookingStep1.get('entries').disable();
    this.userBookingStep1.get('affilliate').patchValue('test-affilliate');
    this.userBookingStep1.get('currency').patchValue(this.defaults['currency']);

    this.userBookingStep2 = this.fb.group({
      firstName: [this.userBookingFields.firstName, Validators.required],
      lastName: [this.userBookingFields.lastName, Validators.required],
      emailGroup: this.fb.group({
        email: [
          this.userBookingFields.email,
          [Validators.required, Validators.email]
        ],
        confirmEmail: [
          this.userBookingFields.confirmEmail,
          [Validators.required]
        ]
      }, { validator: CustomValidators.childrenEqual }),
      postCode: [this.userBookingFields.postCode,
        [Validators.required, Validators.maxLength(6)]
      ],
      country: [this.userBookingFields.country, Validators.required],
      phPrefix:[''],
      phoneNumber: [
        this.userBookingFields.phoneNumber,
        [Validators.required, Validators.maxLength(10), Validators.pattern('[0-9]{10}')]
      ],
      subscribeByEmail: [this.userBookingFields.subscribeByEmail],
      subscribeByPhone: [this.userBookingFields.subscribeByPhone],
      subscribeByPost: [this.userBookingFields.subscribeByPost],
    });
    this.userBookingStep2.get('phPrefix').patchValue('+44');

    this.userBookingStep3 = this.fb.group({
      nameOnCard: [this.userBookingFields.nameOnCard,[Validators.required, Validators.minLength(2)]],
      cardNumber: [this.userBookingFields.cardNumber,[Validators.required, CreditCardValidator.validateCCNumber]],
      cardExpiry: [this.userBookingFields.cardExpiry,[Validators.required, CreditCardValidator.validateExpDate]],
      cvv: [this.userBookingFields.cvv, [Validators.required, Validators.minLength(3), Validators.maxLength(4), Validators.pattern('[0-9]{3,4}')]],
      agreement: ["", Validators.required],
      ageConfirm: ["", Validators.required],
    },{validator: this.checkCheckbox});

    

    this.checkForValueChange();
  }
  ngOnDestroy(){}

  checkCheckbox(c: AbstractControl){
    if(c.get('ageConfirm').value == false && c.get('agreement').value == false){
      return false;
    }else return true;
  } 

  checkForValueChange() {
    const cvv = this.userBookingStep3.get('cvv');
    const conutrycode = this.userBookingStep2.get('phPrefix');
    const postalcode  = this.userBookingStep2.get('postCode');
    this.userBookingStep3.valueChanges.subscribe((mode: string) => {
      this.cardTypeImage = CreditCard.cardType(mode['cardNumber']);
      this.cvvMaxLength = this.cardTypeImage !== "amex" ? 3 : 4;
      cvv.setValidators([Validators.minLength(this.cvvMaxLength)]);
      if (cvv.value !== null) cvv.markAsTouched();
      
    });

    this.userBookingStep2.get('country').valueChanges.subscribe(country=>{
      switch (country) {
          case "UK":
            conutrycode.patchValue('+44');
            postalcode.setValidators([Validators.maxLength(8)]);
          break;
          case "IR":
            conutrycode.patchValue('+972');
            postalcode.setValidators([Validators.maxLength(8)]);
          break;
          case "AU":
            conutrycode.patchValue('+61');
            postalcode.setValidators([Validators.maxLength(4)]);
          break;
          default:null
          break;
        }
    })

    this.userBookingStep1.get('entries').valueChanges
        .pipe(distinctUntilChanged((a,b)=> jsonEqual(a,b)))
        .subscribe((mode: string) => {
          if(mode !== null) this.updatePackege();
        });
    this.userBookingStep1.get('paymentFrequency').valueChanges
        .pipe(distinctUntilChanged((a,b)=> jsonEqual(a,b)))
        .subscribe((mode: string) => {
          if(mode && mode !== null) this.updatePackege();
        });
  }

  updatePackege() {
    let data: object = {
      qty: this.userBookingStep1.get('entries').value,
      frequency: this.userBookingStep1.get('paymentFrequency').value
    }
    this.bs.updatePackege(data).subscribe(r=>{
      this.bs.hideLoader();
      this.userBookingStep1.get('grandTotal').patchValue(r); 
    })
  }

  testGameId(){
    const gameid = this.bs.getFromLocal('__GAMEID') || this.bs.__GAMEID;
    const selected_seat = this.bs.getFromLocal('selected_seat')
    if(gameid === null || selected_seat === null) this.bs.gotoPage('/venues');
  }

  checkIsvalid(form) { 
    return form.valid == null || form.valid == false ? false : true;
   }

  onStep1Next() { 
    const mode = this.userBookingStep1.getRawValue();
    let pf = mode['paymentFrequency'].toLowerCase();
    this.sandboxData['qty']        = Number(mode['entries']);
    this.sandboxData['frequency']  = pf;
    this.sandboxData['amount']     = mode['grandTotal'];    
    this.sandboxData['currency']   = mode['currency'];    
    this.sandboxData['affilliate'] =  mode['affilliate'];
    this.sandboxData['is_recurring'] = pf !== "once" ? true : false;
    this.sandboxData['merchant_id']  = "capensandbox";
    this.sandboxData['service']      = "paysafe";
    this.sandboxData['tickets']      = [this.bs.getFromLocal('selected_seat')];
  }

  onStep2Next() {
    const mode = this.userBookingStep2.getRawValue();
    let customer       = this.sandboxData['customer'];
    let billingAddress = this.sandboxData['billing_address'];
    let options        = this.sandboxData['options'];

    customer['email']       = mode['emailGroup']['email'];
    customer['first_name']  = mode['firstName'];
    customer['last_name']   = mode['lastName'];
    customer['phone']       = mode['phoneNumber'];

    billingAddress['country']       = mode['country'];
    billingAddress['postcode']      = mode['postCode'];

    options['is_subscribed_address'] = mode['subscribeByPost'];
		options['is_subscribed_email']   = mode['subscribeByEmail'];
		options['is_subscribed_phone']   = mode['subscribeByPhone'];    
  }

  onStep3Next(event) {
    this.bs.validatePayment(this.sandboxData).subscribe(r=>{
      this.bs.hideLoader();
      const data = r;
      if(this.sandboxData['is_recurring']){
        this.getPaymentToken(data);
      }else{
        this.getFinalPayment(data);
      }  
    },
    (error)=>{
      this.bs.hideLoader();
      //let _error = (error.json())['_body'];
      console.log(error);
    });
  
}

  getPaymentToken(data?:object){
    const mode = this.userBookingStep3.getRawValue();
    let card = this.sandboxPaymentToken['card'];
    let expiry = mode['cardExpiry'].split('/');

    this.sandboxPaymentToken['merchant_id']     = this.sandboxData['merchant_id'];
    this.sandboxPaymentToken['customer_id']     = this.bs.generateCustomerId();
    this.sandboxPaymentToken['customer']        = this.sandboxData['customer'];
    this.sandboxPaymentToken['billing_address'] = this.sandboxData['billing_address'];
    
    card['number']        = mode['cardNumber'];
    card['cvv']           = mode['cvv'];
    card['name']          = mode['nameOnCard'];
    card['expiry_month']  = (expiry[0]).trim();
    card['expiry_year']   = (expiry[1]).trim();

    this.sandboxPaymentToken['service'] = this.sandboxData['service'];
    let tokendata = this.sandboxPaymentToken;
    
    this.bs.getClientToken(tokendata).subscribe(t=>{
      this.bs.hideLoader();
      this.getFinalPayment(data,t['token']);
    },
    (error)=>{
      this.bs.hideLoader();
      //let _error = (error.json())['_body'];
      console.log(error);
    });
  }

  getFinalPayment(data:object,token?:string){
    let finalPay = data;
    if(token){
      finalPay['token'] = token;
    }else{
      const mode = this.userBookingStep3.getRawValue();
      let expiry = mode['cardExpiry'].split('/');
      finalPay['card'] = {};
      finalPay['card']['number']        = mode['cardNumber'];
      finalPay['card']['cvv']           = mode['cvv'];
      finalPay['card']['name']          = mode['nameOnCard'];
      finalPay['card']['expiry_month']  = (expiry[0]).trim();
      finalPay['card']['expiry_year']   = (expiry[1]).trim();
    }

    this.bs.makeFinalPayment(finalPay).subscribe(r=>{
      this.bs.hideLoader();
      this.bs.saveTransection(r);
      this.bs.gotoPage('/checkout-success',{queryParams:""});
    },
    (error)=>{
      this.bs.hideLoader();
      //let _error = (error.json())['_body'];
      console.log(error);
    }
    );
  }

 
  onComplete(event) {
    
  }

}
