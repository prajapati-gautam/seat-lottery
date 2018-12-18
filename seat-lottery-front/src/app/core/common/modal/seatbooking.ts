export class UserBooking {
  entries : number = null;
  paymentFrequency : string = "";
  grandTotal : number = 0;
  first_name  : string = "";
  last_name   : string = "";
  email       : string = "";
  confirmEmail : string = "";
  postCode     : string = "";
  country      : string = "";
  phoneNumber  : string = "";
  subscribeByEmail : boolean = false;
  subscribeByPhone : boolean = false;
  subscribeByPost  : boolean = false;
  nameOnCard : string = "";
  cardNumber : string = "";
  cardExpiry: string = "";
  cvv        : number = null;
  agreement  : boolean = false;
  ageConfirm : boolean = false; 
}