import { Component, OnInit } from '@angular/core';
import { baseService } from '../../services/base.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import {Location} from '@angular/common';
import { EditBlockComponent } from './edit-block/edit-block.component';

@Component({
  selector: 'app-block-list',
  templateUrl: './block-list.component.html',
  styleUrls: ['./block-list.component.css'],
  providers:[baseService]
})
export class BlockListComponent implements OnInit {

  constructor(private srvs:baseService,private dialog: MatDialog, private _location: Location) { }

  public blockList : object = [];
  public stadiumId : number;

  backClicked() {
    this._location.back();
  }
  editBlock(id) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';

    this.srvs.getBlockByID(id,this.blockList,(block)=>{
      block['stadium_id'] = this.stadiumId;
      dialogConfig.data = block;
      
      this.dialog.open(EditBlockComponent, dialogConfig);
    });
  }

  ngOnInit() {
    this.srvs.getActiveParamFromUrl('id',(id)=>{
      let venues = this.srvs.getBlocks(id);
      this.stadiumId = id;
      venues.subscribe(
        (blocks)=>{
          this.blockList = blocks;
        },
        (error)=>{}
      )
    });
  }

}
