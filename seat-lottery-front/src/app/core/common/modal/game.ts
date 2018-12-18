export class CurrentGame {
  is_closed : boolean = false;
  is_free_entry : boolean = false;
  is_paid_entry : boolean = true;
  price : number = 1;
  allow_recurring : boolean = true;
  payment_frequencies : Array<string> = [];
  allow_direct_debit_payments : boolean = false;
  direct_debit_frequencies    : Array<any> = [];
  direct_debit_collection_day : number = 0;
  direct_debit_next_collection_date : string = "";
  draw_frequency : string = "";
  next_draw_date : string = "";
  allow_player_tickets : boolean = false;
  limit : number = 0;
  age_limit : number = 0;
  display_mode : string = "";
  legal : object = { 
    terms_url : "",
    privacy_url : ""
  }
  merchant : object = {
    name : "",
    newsletter_list : 0
  }
  reference : string = "";
  name : string = name;
  description : string = "";
  currency : string = "";
  bundles : Array<number> = [];
  is_live : boolean = true;
  start_at : string = "";
  end_at : string   = "";
  analytics : Array<object> = [{
    service : "",
    tracking_code : ""
  }];
}
