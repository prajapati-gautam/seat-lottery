import { Component, OnInit, AfterContentInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot  } from '@angular/router';
import { BaseService } from '../common/services/base.service';
import { Smap } from '../common/modal/map.modal';
import { svgMap } from '../../../assets/js/svgmap';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { SeatSelectionComponent } from './seat-selection/seat-selection.component';


@Component({
  selector: 'app-stadium',
  templateUrl: './stadium.component.html',
  styleUrls: ['./stadium.component.css']
})



export class StadiumComponent implements OnInit, AfterContentInit  {

  
  public _stadiumId :number = null;
  public stadium : any;
  public map : Smap;
  public mapInitialse : any;
  public BASEURL : string = null;
  constructor( private activeRoute:ActivatedRoute, 
               private bs : BaseService,
               private dialog: MatDialog) {
    this._stadiumId = this.activeRoute.snapshot.params.id;
    this.BASEURL    = this.bs.baseurl();
  }

  @ViewChild("mapwrapper", {read: ViewContainerRef}) mpw: ViewContainerRef;
  map_wrapper : any;

  ngOnInit() {    
    this.bs.getStadiumById(this._stadiumId).subscribe(response=>{
      this.bs.hideLoader();
      this.stadium  = response[0];
      if((this.stadium['field_finished_stadium']).trim()){
        this.map = JSON.parse(this.stadium['field_finished_stadium']);
      } 
      this.map_wrapper   = this.mpw.element.nativeElement;
      this.bs.setToLocal('__GAMEID',this.stadium['field_game_id']);
      this.bs.__GAMEID = this.stadium['field_game_id'];
      setTimeout(() => {
        svgMap(this.map_wrapper);
      }, 0);
      
    });
  }

  selectBlock(id):void {
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.disableClose = true;
    dialogConfig.maxHeight = "100%";
    dialogConfig.width = '800px';
    dialogConfig['data'] = {};
    dialogConfig['data']['stadium_id'] = Number(id);
    this.dialog.open(SeatSelectionComponent, dialogConfig);
  }

  ngAfterContentInit(){
  }
}
