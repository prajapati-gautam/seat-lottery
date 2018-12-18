import { Injectable, Inject,  } from '@angular/core';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs-compat';
import { map } from 'rxjs-compat/operators/map';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service' 




@Injectable()
export class ApiService {

  private API_URL: string;

  private headers: Headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  constructor( private http : Http, protected auth : AuthService) {
    this.API_URL = environment.api_url;
  }

  public get(path: string,id?:any, term?: any): Observable<any> {
    this.getHeaders();
    let Response = this.http.get(`${this.API_URL}${path}${id}${term}`, {headers: this.headers })
                            .map((res)=> res.json())
                            .catch(this.handleError);
    return Response;
  }

  public post(path: string,format:any, data: any, with_auth = true): Observable<any> {
    let body = JSON.stringify(data);
    if (with_auth) {
      this.authHeaders();
    }
    return this.http.post(`${this.API_URL}${path}${format}`, body, { headers: this.headers })
                    .map((res)=> res.json())
                    .catch(this.handleError);
  }

  public patch(path: string, data: any, with_auth: boolean = true): Observable<any> {
    let body = JSON.stringify(data);
    if (with_auth) {
      this.authHeaders();
    }
    return  this.http.patch(`${this.API_URL}${path}`, body, { headers: this.headers })
                     .map((res)=> res.json())
                     .catch(this.handleError);
  }

  public put(path: string, data: any): Observable<any> {
    let body = JSON.stringify(data);

    return this.http.put(`${this.API_URL}${path}`, body, { headers: this.headers })
                    .map((res)=> res.json())
                    .catch(this.handleError);;
  }

  public delete(path: string): Observable<any> {
    this.authHeaders();
    return this.http.delete(`${this.API_URL}${path}`, { headers: this.headers })
                    .map((res)=> res.json())
                    .catch(this.handleError);;
  }

  public setHeaders(headers) {
    Object.keys(headers).forEach(header => this.headers.set(header, headers[header]));
  }

  public authHeaders() {
    let basic_auth = this.auth.getSecureToken();
    this.setHeaders({ 'Authorization': 'Basic Y2xpZW50Om1hbmFnZXJfcGFzcw==' });
    this.setHeaders({ 'Content-Type': 'application/hal+json' });
    this.setHeaders({ 'Accept': 'application/hal+json' });
    this.setHeaders({ 'X-CSRF-Token': basic_auth['csrf_token'] });
  }

  public getHeaders(){
    this.headers.forEach((element,key) => {
      this.deleteHeader(key);
    });
    
    this.setHeaders({ 'Content-Type': 'application/json' });
    this.setHeaders({ 'Accept': 'application/json' });
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