import { Component, OnInit, Input, AfterContentInit } from '@angular/core';
import { baseService } from '../../services/base.service';

@Component({
  selector: 'app-venue-list',
  templateUrl: './venue-list.component.html',
  styleUrls: ['./venue-list.component.css'],
  providers:[baseService]
})
export class VenueListComponent implements OnInit, AfterContentInit {


  constructor(private srvs:baseService) { }

  venueList : object;
  BASEURL   : string = '';
  field_ticket_tag: any;

  ngOnInit() {}
  
  ngAfterContentInit() {
    this.BASEURL = this.srvs.baseurl();
    let venues = this.srvs.getVenues()
    venues.subscribe(
      (venues)=>{
        this.venueList = venues;
      },
      (error)=>{
      }
    )
  }

  gotoBlocklist(id){
    this.srvs.gotoPage('blocks/'+id);
  }

  editVenue(id){
    this.srvs.getBlockByID(id,this.venueList,(obj)=>{
      this.srvs.gotoPage('venues/'+id);
    });
  }

}
