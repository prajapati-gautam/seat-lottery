import { Component, OnInit,Input,Output, EventEmitter } from '@angular/core';
import {Location} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { baseService } from '../../../../core/services/base.service';
import {ToastaService, ToastOptions, ToastData} from 'ngx-toasta';
import * as d3 from 'd3';
import { from } from 'rxjs';



@Component({
  selector: 'app-edit-venue',
  templateUrl: './edit-venue.component.html',
  styleUrls: ['./edit-venue.component.css'],
  providers: [baseService]
})
export class EditVenueComponent {



  @Output() createBlock: EventEmitter<any> = new EventEmitter();

  constructor(private srvs:baseService, 
              private toastaService:ToastaService, 
              private route:ActivatedRoute,
              private router: Router,
              private _location: Location) {}
                
  public currentVenue:Array<any> = [];
  public blocksList : Array<any> = [];
  public BASEURL: string = "";
  public svgImg : string = "";
  public setBlockId : number = null;
  public isSvgValid : boolean = false;
  public stadium_id : number = null;
  public errorMsg : string = '';
  public mapJson  : string = '';

  ngOnInit() {
    this.BASEURL = this.srvs.baseurl();
    this.srvs.getActiveParamFromUrl('id',(id)=>{
      this.stadium_id = id;
      let assets = this.srvs.getStadiumAssets(id);
      assets.subscribe((venue)=>{
        this.currentVenue = venue;
        venue.map((a)=>{
          this.svgImg = a['field_stadium_aerial_view_seatin'];
          this.mapJson = a['field_finished_stadium'];
        })
      },(error)=>{})

      let blocks = this.srvs.getBlocks(id);
      blocks.subscribe((block :Array<any>)=>{
        block.map((b)=>{ 
          let mp = this.mapJson != "" ? eval( '(' + this.mapJson + ')' ) : '';
          if(typeof(mp) == 'object'){
            b['selected'] = false;
            mp.blocks.forEach(element => {
              if(element.block_id == b.nid){
                b['selected'] = true;
              }
            });
          }
          this.blocksList.push(b); 
        });
      },(error)=>{});
    })
  }

  backClicked() {
    this._location.back();
  }

  addBlock(id){
    this.setBlockId = id;
    d3.select('#blockId').attr('value',id);
  }

  submitSvg(){
    let blocklength = this.blocksList.length;
    let activeBtns = d3.select('.block-list').selectAll('button[disabled]').size();
    this.isSvgValid = false;
    if(activeBtns > 0){
      let element = d3.select('svg.svg-map');
      let map =  JSON.stringify(this.preapreSvgObject(element)).replace(/"/g,'\"').toString();
      let toastOptions:ToastOptions = {
        title: "Map Update",
        msg:   "The Map updated succesfully.",
        timeout: 2000,
        onRemove: (toast:ToastData) => {
          this.router.navigate(['venues']);
        }
      }
      setTimeout(() => {
        if(map){
          let response = this.srvs.updateMapLayout(this.stadium_id,map);
          response.subscribe(response=>{
            this.isSvgValid = true;
            if(response){
              this.toastaService.success(toastOptions);
            }
          });
        }
      },0);
    }
  }

  preapreSvgObject(svg){
    if(svg.size() < 1) return false;
    let entity = svg;
    let map = {};
    let image = entity.select('image');
    let blocks = entity.selectAll('.polygon');
    map['stadium_id'] = this.stadium_id;
    
    map['image'] = {};
    if(image.size() > 0){
      map['image']['url'] = image.attr('href');
      map['image']['size'] = {};
      map['image']['size']['width'] = entity.attr('viewBox').split(',')[2];
      map['image']['size']['height'] = entity.attr('viewBox').split(',')[3];
    }

    map['blocks'] = [];
    if(blocks.size() > 0){
      blocks.each(function(d,index) {
        let block = d3.select(this);
        map['blocks'][index] = {};
        map['blocks'][index]['block_id'] = block.attr('data-block-id');
        map['blocks'][index]['points']   = [];
        let blockPoint = block.select('polygon');
        if(blockPoint.size() > 0){
          let points = blockPoint.attr('points').split(',');
          points.forEach(element => {
            map['blocks'][index]['points'].push(element)
          });
        }
      });
    }

    return map;
  }

}
