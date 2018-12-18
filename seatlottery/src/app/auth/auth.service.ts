import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment }  from '../../environments/environment';
import { API } from '../core/api';





@Injectable()
export class AuthService {
   public token;
   public httpOptions;
   constructor(private router: Router, private http:HttpClient) {
   this.token = this.getSecureToken();
   
   
   if(this.token !== null){
    this.httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'X-CSRF-Token':this.token['csrf_token'] 
      })
    }
  }
}

  

   //Set User Secure Token
  setSecureToken(secure_token: string) {
    localStorage.setItem("QcyHLeCvIwaoAKeVe3l4bg", secure_token)
  }

  //Set User Secure Token
  getSecureToken() {
    if(localStorage.getItem("QcyHLeCvIwaoAKeVe3l4bg") !== null)
    {
      const t = eval( '(' + localStorage.getItem("QcyHLeCvIwaoAKeVe3l4bg") + ')' );
      return t;
    }
    return null;
  }

  //Check User is LoggedIn or not!
  isLoggednIn() {
    return this.getSecureToken() !== null;
  }

  //Logout method
  logout() {
    localStorage.removeItem("QcyHLeCvIwaoAKeVe3l4bg");
    this.router.navigate(["login"]);
    /*this.http.post(environment.api_url+API.LOGOUT+this.token.logout_token,'',this.httpOptions).subscribe((response)=>{
      console.log(response);
    });*/
  }
}

//encryption key // awe1005010@Ww