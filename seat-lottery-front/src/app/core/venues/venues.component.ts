import { Component, OnInit } from '@angular/core';
import { BaseService } from '../common/services/base.service';

@Component({
  selector: 'app-venues',
  templateUrl: './venues.component.html',
  styleUrls: ['./venues.component.css']
})


export class VenuesComponent implements OnInit {
  BASEURL : string = "";
  public stadiums : any;
  constructor( private bs : BaseService 
  ) { 
    this.BASEURL = this.bs.baseurl();
    this.bs.getToken(); 
  }
  ngOnInit() {
    this.bs.getAllStadiums().subscribe((stadium)=>{
      this.bs.hideLoader();
      this.stadiums =  stadium;
    });
  }
}
