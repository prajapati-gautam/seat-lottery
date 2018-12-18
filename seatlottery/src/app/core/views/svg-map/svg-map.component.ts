import { Component, AfterViewInit, ViewChild, ViewContainerRef, Input, OnInit, HostListener, OnChanges, SimpleChange } from '@angular/core';
import * as d3 from "d3";

import { baseService } from '../../services/base.service';
import { svgMap } from '../../../../assets/svgmap';



@Component({
  selector: 'app-svg-map',
  templateUrl: './svg-map.component.html',
  styleUrls: ['./svg-map.component.css']
})



export class SvgMapComponent implements AfterViewInit  {
  @Input() svgImg : string = "";
  

  BASEURL   : string = '';
  isLoading : boolean = true;
  constructor(private srvs:baseService) {

  }

  @ViewChild("svgmap", {read: ViewContainerRef}) svg: ViewContainerRef;
  @ViewChild("backImage", {read: ViewContainerRef}) backImage: ViewContainerRef;
  @ViewChild("mapWrapper", {read: ViewContainerRef}) mapWrapper: ViewContainerRef;
  @ViewChild("scaleWrapper", {read: ViewContainerRef}) scaleWrapper: ViewContainerRef;
  @ViewChild("blockId", {read: ViewContainerRef}) blockId: ViewContainerRef;
  

  public svgImage;
  public map_wrapper;
  public scale_wrapper;
  public back_image;
  public imageLoaded :boolean = false;
  public originalSize;
  public init;

  ngOnInit():void {
    this.BASEURL = this.srvs.baseurl();
    this.svgImage     = this.svg.element.nativeElement;
    this.map_wrapper   = this.mapWrapper.element.nativeElement;
    this.scale_wrapper = this.scaleWrapper.element.nativeElement;
    this.back_image = this.backImage.element.nativeElement;
    d3.select(this.svgImage).attr("preserveAspectRatio", "xMinYMin meet").classed
    ("svg-content-responsive", true);
  }

  ngAfterContentInit(){}
  ngAfterViewInit(){}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setSizeOfWrapper();
  };

  initImage(image){
    this.isLoading = false;
    setTimeout(()=>{
      let svgContent = d3.select("svg");
      this.imageLoaded = true;
      this.setSizeOfWrapper();
      svgContent.select("g.mapContainer").append("image")
        .attr("width", image.naturalWidth)
        .attr("height", image.naturalHeight)
        .attr("xlink:href", this.BASEURL + this.svgImg);
      this.init = svgMap(this.svgImage,{});
    },0)
  }

  setSizeOfWrapper(){
    if(!this.imageLoaded){return false};
    let size = {
      width : d3.select(this.back_image).node().clientWidth,
      height : d3.select(this.back_image).node().clientHeight,
      maxWidth:d3.select(this.back_image).node().naturalWidth,
      maxHeight:d3.select(this.back_image).node().naturalHeight
    }

    let viewbox = [0,0,size.maxWidth,size.maxHeight];
    d3.select(this.svgImage).attr('viewBox', viewbox[0]+','+viewbox[1]+','+viewbox[2]+','+viewbox[3]);
    d3.select(this.map_wrapper).style("max-width", size.maxWidth+'px').style("max-height", size.maxHeight+'px');
    this.originalSize = size;
  }

  ngOnChanges(changes:SimpleChange){}
  onDomChange($event: Event): void {
    let addedNodes = $event['addedNodes'];
    let removedNodes = $event['removedNodes'];
    let parent = d3.select('.editor-block');
    let blockList = d3.select('.block-list');


    if(addedNodes.length > 0){
      if(addedNodes[0].classList.contains('polygon')){
        let selected = parent.select('button[data-block-id="'+addedNodes[0].dataset['blockId']+'"]');
        selected.attr('disabled','disabled')
      }
    }
    if(removedNodes.length > 0 && removedNodes[0].classList.contains('polygon')){
      if(removedNodes[0].classList.contains('polygon')){
        let selected = parent.select('button[data-block-id="'+removedNodes[0].dataset['blockId']+'"]');
        this.blockId = null;
        selected.attr('disabled',null);
      }
    }

    setTimeout(() => {
      if(blockList.selectAll('button[disabled]').size() > 0 ){
        d3.select('.map-wrapper').select('button[data-svg-submit]').attr('disabled',null);
      }else{
        d3.select('.map-wrapper').select('button[data-svg-submit]').attr('disabled','disabled');
      }
    },0);

  }
}






