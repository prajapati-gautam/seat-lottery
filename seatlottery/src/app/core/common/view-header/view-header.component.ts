import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-view-header',
  templateUrl: './view-header.component.html',
  styleUrls: ['./view-header.component.css'],
  providers:[AuthService]
})

export class ViewHeaderComponent implements OnInit {
  constructor(private auth:AuthService, private route:Router) {
  }

  userName : string = "";

  ngOnInit() {
    if(!this.auth.isLoggednIn()){
      this.route.navigate(["login"]);
    }else{
      let token = this.auth.getSecureToken();
      this.userName = token['name'];
    }
  }
  logout(){
    this.auth.logout();
  }

}
