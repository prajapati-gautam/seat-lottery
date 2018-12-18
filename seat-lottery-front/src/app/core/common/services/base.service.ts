import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ApiService } from './api.service';
import { environment } from '../../../../environments/environment';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Injectable()
export class BaseService {
  private __token : string = null;
  public _blockuuid: string = '';
  public _stadiumuuid: string = '';
  __GAMEID : string = null;
  base_url : string = null;
  _format  : string = null;
  _hal_format: string =null;

  _transectionSave : any;
  _selectedSeatSave:any;

  constructor(
    private http: HttpClient,
    private route: Router,
    private activeRoute: ActivatedRoute,
    private as: ApiService,
    private spinnerService: Ng4LoadingSpinnerService
  ) {
    this.base_url = environment.BASEURL;
    this._format  = environment._FORMAT;
    this._hal_format  = environment._HAL_FORMAT; 
  }

  baseurl() {  return this.base_url;  }
  
  getActiveParamFromUrl(param, callback) {
    this.activeRoute.params.subscribe((routeParams) => {
      let prm = routeParams[param];
      callback(prm);
    });
  }

  getBlockByID(id, blocks, callback): void {
    blocks.map((block) => {
      block.nid === id ? callback(block) : '';
    });
  }

  gotoPage(url,data?:{}) {
    let navigationExtras : NavigationExtras = data;
    this.route.navigate([url], navigationExtras);
  }

  public setToLocal(key: string,value:string) {
    localStorage.setItem(key, value)
  }

  public saveTransection(data: Object){
    this._transectionSave = data;
  }
  public getTransection(){
    return this._transectionSave;
  }

  //Set User Secure Token
  public getFromLocal(key:string) {
    return localStorage.getItem(key);
  }

  public generateCustomerId() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  public hideLoader(){
    this.spinnerService.hide();
  }

  /* API REQUESTS */

  getToken(){
    let response = this.as.getFromBackend('/session/token','');
        response.subscribe(rs=>{
          this.as.setSecureToken(rs['_body']);
        })
    return response;
  }

  getAllStadiums(){
    this.spinnerService.show();
    let response = this.as.get('available-stadiums',this._format);
    return response;
  }

  getStadiumById(id?:number){
    this.spinnerService.show();
    let response = this.as.get('stadium/'+id,this._format);
    return response;
  }

  getSeatById(id?:number){
    this.spinnerService.show();
    let response = this.as.get('seats-list/'+id,this._format);
    return response;
  }

  getGameJson(){
    this.spinnerService.show();
    let gameid = this.getFromLocal('__GAMEID'); //'zaffo-lotto-demo';
    let response = this.as.getSandBox(gameid);
    return response; 
  }

  updatePackege(data){
    this.spinnerService.show();
    let response = this.as.postSandBox('sales/total/',data);
    return response;
  }

  updateSeatBooking(seat_nid:number){
    let body : Object = {"_links": {"type": {"href": "https://yocat.net/backend/rest/type/node/seat" } },  
    "nid": { "": { "value": seat_nid } },
    "type": { "target_id": "seat" }, "field_status": { "value": "1" } } 

    let response = this.as.patch('node/' + seat_nid + this._hal_format ,body,true);
    return response; 
  }

  validatePayment(data:any){
    this.spinnerService.show();
    let response = this.as.postSandBox('sales/validate/',data);
    return response;
  }

  getClientToken(data:any){
    this.spinnerService.show();
    let response = this.as.postSandBox('',data,'token');
    return response;
  }

  makeFinalPayment(data){
    this.spinnerService.show();
    let response = this.as.postSandBox('payment/',data,'charge');
    return response;
  }

  getEntrieTickit(id){
    return this.as.getSandBoxticket(id);
  }


}
