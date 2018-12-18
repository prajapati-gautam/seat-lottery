import { Injectable, Inject,  } from '@angular/core';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs-compat';
import { map } from 'rxjs-compat/operators/map';
import { environment } from '../../../../environments/environment';


@Injectable()
export class ApiService {

  protected API_URL: string;
  private BASE_URL: string;
  protected API_URL_BACKEND : string;
  protected sandbox_token : string; 
  protected sandbox_api   : string;
  private game_id : string; 
  private headers: Headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });


  constructor( protected http : Http) {
    this.API_URL         = environment.APIURL;
    this.BASE_URL        = environment.BASEURL;
    this.API_URL_BACKEND = environment.APIURLBACKEND;
    this.sandbox_token   = environment.SANDBOX_TOKEN;
    this.sandbox_api     = environment.SANDBOX_API;
  }

  public setSecureToken(secure_token: string) {
    localStorage.setItem("__token", secure_token)
  }
  
  public getSecureToken() {
    return localStorage.getItem("__token")
  }

  public get(path: string,format?:any): Observable<any> {
    this.getHeaders();
    const Response = this.http.get(`${this.API_URL}${path}${format}`, {headers: this.headers })
          .map((res)=> res.json())
          .catch(this.handleError);
    return Response;
  }

  public getFromBackend(path: string,format?:any): Observable<any> {
    this.getHeaders();
    const Response = this.http.get(`${this.BASE_URL +'/backend'}${path}${format}`, {headers: this.headers })
          .map((res)=>res)
          .catch(this.handleError);
    return Response;
  }

  public getSandBox(gameid:string): Observable<any> {
    this.getSandboxHeaders();
    const response = this.http
                         .get(`${this.sandbox_api}game/${gameid}.json`, {headers: this.headers })
                         .map((res)=> res.json())
                         .catch(this.handleError);
    return response;
  }
  public getSandBoxticket(transaction:string): Observable<any> {
    this.getSandboxHeaders();
    this.setHeaders({ 'Authorization':  this.sandbox_token});
    const Response = this.http.get(`${this.sandbox_api}tickets/${transaction}.json`, {headers: this.headers }).map(res=>res.json()).catch(this.handleError);
    return Response;
  }

  public postSandBox(path: string, data: any,  optional?:any): Observable<any> {
    this.game_id         = localStorage.getItem("__GAMEID");
    let body = JSON.stringify(data);
    let pointTo = "";
    let url = ""
    this.getSandboxHeaders();
    optional ? pointTo = optional : pointTo = this.game_id;
    optional ? url =  'https://secure-sandbox.gateway.zone/api/1.0/client/' : url = this.sandbox_api;
    if(optional){this.setHeaders({ 'Authorization':  'Token f01zV65Xt55pF7Y9o0X287fI409LgrzI'});}

    const response = this.http
                    .post(`${url}${path}${pointTo}.json`, body, { headers: this.headers })
                    .map((res)=> res.json())
                    .catch(this.handleError);
    return response;
  }

  public post(path: string,format:any, data: any, with_auth = true): Observable<any> {
    let body = JSON.stringify(data);
    if (with_auth) {
      this.authHeaders();
    }
    return this.http.post(`${this.API_URL_BACKEND}${path}${format}`, body, { headers: this.headers })
    .map((res)=> res.json())
    .catch(this.handleError);;
  }

  public patch(path: string, data: any, with_auth: boolean = true): Observable<any> {
    let body = JSON.stringify(data);
    if (with_auth) {
      this.authHeaders();
    }
    return  this.http.patch(`${this.API_URL_BACKEND}${path}`, body, { headers: this.headers }).map((res)=> res.json())
    .catch(this.handleError);;
  }

  public put(path: string, data: any): Observable<any> {
    let body = JSON.stringify(data);
    return this.http.put(`${this.API_URL}${path}`, body, { headers: this.headers }).map((res)=> res.json())
    .catch(this.handleError);;
  }

  public delete(path: string): Observable<any> {
    this.authHeaders();
    return this.http.delete(`${this.API_URL}${path}`, { headers: this.headers }).map((res)=> res.json())
    .catch(this.handleError);;
  }

  public setHeaders(headers) {
    Object.keys(headers).forEach(header => this.headers.set(header, headers[header]));
  }

  public authHeaders() {
    let basic_auth = this.getSecureToken();
    this.setHeaders({ 'Authorization': 'Basic YXBwX3VzZXI6dXNlcl9wYXNzMTIz' });
    this.setHeaders({ 'Content-Type': 'application/hal+json' });
    this.setHeaders({ 'Accept': 'application/hal+json' });
    this.setHeaders({ 'X-CSRF-Token': basic_auth});
  }

  public getHeaders(){
    this.headers.forEach((element,key) => {
      this.deleteHeader(key);
    });
    
    this.setHeaders({ 'Content-Type': 'application/json' });
    this.setHeaders({ 'Accept': 'application/json' });
  }

  public getSandboxHeaders(){
    this.headers.forEach((element,key) => {
      this.deleteHeader(key);
    });
    this.setHeaders({ 'Accept': 'application/json' });
    this.setHeaders({ 'Content-Type': 'application/json' });
    this.setHeaders({ 'Authorization':  this.sandbox_token}); //'Token f01zV65Xt55pF7Y9o0X287fI409LgrzI'
  }

  public setHeader(key: string, value: string) {
    this.headers.set(key, value);
  }

  public deleteHeader(key: string) {
    if (this.headers.has(key)) {
      this.headers.delete(key);
    } else {
      console.log(`header:${key} not found!`);
    }
  }

  private extractData(res: Response): Array<any> | any {
    if (res.status >= 200 && res.status <= 300) {
      return res.json() || {};
    }
    return res;
  }

  private handleError(error: any) {
    return Observable.throw(error);
  }

}