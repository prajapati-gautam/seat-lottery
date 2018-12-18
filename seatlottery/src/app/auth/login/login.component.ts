import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './login';
import { baseService } from '../../core/services/base.service';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[baseService,AuthService]
})
export class LoginComponent implements OnInit {

  loginForm = new User('','');
  isSubmit : boolean = false;
  errorMessage : string = "";

  constructor(private baseservice:baseService,
    private authService: AuthService,
    private route: Router
    ) {}
  ngOnInit(){
    let token = this.authService.getSecureToken();
    if(token){this.route.navigate(["venues"]);}
  }
  onSubmit(form){
    if(!form.invalid){
      this.isSubmit = true;
      const login = new User(form.user,form.password);
      let isLogin =  this.baseservice.login(login);
      isLogin.subscribe((response)=>{
        let user : Object = {};
        user['csrf_token'] = response['csrf_token'];
        user['name'] = response['current_user']['name'];
        user['uid'] = response['current_user']['uid'];
        user['logout_token'] = response['logout_token'];
        this.authService.setSecureToken(JSON.stringify(user));
        this.route.navigate(["venues"]);
      },
      (error) =>{
        this.isSubmit = false;
        let errorResponse = JSON.parse(error['_body']);
        this.errorMessage = errorResponse['message'];
      })
    }
  }
}
