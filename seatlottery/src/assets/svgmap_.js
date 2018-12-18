import * as d3 from 'd3';
import {contextMenu} from './context-menu.js';


export function svgMap(svg){

  var options = {};
  var svgmp = {};
  var svgElement = d3.select(svg);
  var blockStorage = new Array();
  var svgContainer = d3.select('g.scaleWrapper');
  var svgCanvas = d3.select('g.mapContainer');
  var canvasImage = svgCanvas.select('image');
  var drawMode = false;
  var dragMode = false;
  var gPoly,polyEl,bbox;
  var setEditMode;

  var json  = [{
    id:13,
    points:[192.9556884765625,102.28976440429688,354.5270080566406,102.28976440429688,360.33892822265625,237.1262664794922,188.30615234375,242.9381866455078]
  },{
    id:10,
    points:[448.6800842285156,108.1016845703125,463.79107666015625,335.92889404296875,576.5422973632812,266.18585205078125]
  },
  {
    id:8,
    points:[338.2536315917969,288.2711486816406,280.13446044921875,374.28753662109375,419.6205139160156,373.1251525878906]
  },
  {
    id:7,
    points:[487.03875732421875,349.8774719238281,466.1158447265625,488.2011413574219,581.1918334960938,394.0480651855469]
  }
];


  createMapFromJson(json);

  function createMapFromJson(json) {
    svgCanvas.selectAll('g')
    .data(json)
    .enter()
    .append('g')
    .classed('polygon',true)
    .attr('data-block-id',function(d){
      return d.id;
    }).call(
      d3.drag().on("drag", function(d) {
        d3.select(this).attr("transform", "translate(" + (d.x = d3.event.x) + "," + (d.y = d3.event.y) + ")")
      })
    ).append('polygon').attr('points',function(d){
      return d.points;
    }).on('contextmenu',function(){
      if(event.target.nodeName === "polygon"){
        let selector = '.mapContainer g[data-block-id="'+event.target.parentNode.dataset['blockId']+'"]'
        svgCanvas.select(selector).call(contextMenu(menu));
      }
      d3.event.preventDefault();
    });
  }

  svgmp.createBlock = function(id){

    if(blockStorage.indexOf(id) == -1 && svgCanvas.selectAll('g.mock')._groups[0].length == 0 ){
      blockStorage.push(id);
      new CreatePolygone(id);
    }

  }

  var menu = [
    {
      title: 'Remove Block',
      action: function(elm, d, i) {
        console.log(d);
          var id = d._groups[0][0]['dataset']['blockId'];
          if(blockStorage.indexOf(id) > -1){
            blockStorage = removeObjectByKey(blockStorage, id)
            d3.select('.mapContainer g[data-block-id="'+id+'"]').remove();
          }
      },
      disabled: false // optional, defaults to false
    },
    /*{
      title: 'Edit Block',
      action: function(elm, d, i) {
        setEditMode(d._groups[0][0]);
      },
      disabled: false // optional, defaults to false
    }*/
  ]



  function removeObjectByKey(array, value){
    array.some(function(item, index) {
    if(array[index] === value){
      array.splice(index, 1);
      return true;
    }
    return false;
    });
    return array;
  }

  function CreatePolygone(id){
    var linePoint1;
    var linePoint2;
    var polypoints = [];
    var group = svgCanvas.append('g').classed('mock',true).attr('data-block-id',id);
        dragMode = false;
    var dragBehavior = d3.drag().on("drag", alterPolygon);


    setEditMode = function(element){
      var points = d3.select(element).select('polygon').attr('points');
      points = points.split(',');
      var pointsList = new Array();

      points.reduce(function(result, value, index, array) {
        if (index % 2 === 0){
          pointsList.push(array.slice(index, index + 2));
          return result;
        }
      }, []);

      gPoly.selectAll('circle').remove();
      for (var i = 0; i < pointsList.length; i++) {
        gPoly.append('circle')
          .attr("cx", pointsList[i][0])
          .attr("cy", pointsList[i][1])
          .attr("r", 2)
          .style("cursor", "pointer")
          .call(dragBehavior);
      }
    }



    function setPoint(){
      if(dragMode) return;
      drawMode = true;

      var plod = d3.mouse(this);

      linePoint1 = {
        x: plod[0],
        y: plod[1]
      };

      if (d3.event.target.hasAttribute("handle")) {
        completePolygon()
        return true;
      }

      polypoints.push(plod);

      group.append("circle")
        .attr("cx", linePoint1.x)
        .attr("cy", linePoint1.y)
        .attr("r", 3)
        .attr("start-point", true)
        .attr('handle',true)
        .classed("handle", true);

    }

    function completePolygon() {
      if(polypoints.length < 3){return}

      var id = d3.select('g.mock').attr('data-block-id');
          d3.select('g.mock').remove();

      gPoly = svgCanvas.append('g')
        .classed("polygon", true).attr('data-block-id', id).attr('data-drag',true);
        polyEl = gPoly.append("polygon")
                    .attr("points", polypoints)
                    .attr('fill','#ffffff')
                    .attr('fill-opacity',0.5)
                    .attr('stroke','#0067ff')
                    .attr('stroke-width','2px');

        for (var i = 0; i < polypoints.length; i++) {
          gPoly.append('circle')
            .attr("cx", polypoints[i][0])
            .attr("cy", polypoints[i][1])
            .attr("r", 2)
            .style("cursor", "pointer")
            .call(dragBehavior);
        }

      drawMode = false;
      dragMode = true;
      bbox = polyEl._groups[0][0].getBBox();
      bbox.x = 0;
      bbox.y = 0;
      bbox.width = 50;
      bbox.height = 50;
      gPoly.datum({x: 0,y: 0});
      gPoly.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")"
      });
      gPoly.call(
          d3.drag().on("drag", function(d) {
              d3.select(this).attr("transform", "translate(" + (d.x = d3.event.x) + "," + (d.y = d3.event.y) + ")")
            })
      );

      gPoly.on('contextmenu',function(){
        if(event.target.nodeName === "polygon"){
          let selector = '.mapContainer g[data-block-id="'+event.target.parentNode.dataset['blockId']+'"]'
          svgCanvas.select(selector).call(contextMenu(menu));
        }
        d3.event.preventDefault();
      })

    }

    //Altering polygon coordinates based on handle drag
    function alterPolygon() {
      if (drawMode === true) return;

      var alteredPoints = [];
      var selectedP = d3.select(this);
      var parentNode = d3.select(this.parentNode);
      console.log(selectedP);
      //select only the elements belonging to the parent <g> of the selected circle
      var circles = d3.select(this.parentNode).selectAll('circle');
      var polygon = d3.select(this.parentNode).select('polygon');


      var pointCX = d3.event.x;
      var pointCY = d3.event.y;
      console.log(pointCX,pointCY)

      //rendering selected circle on drag
      selectedP.attr("cx", pointCX).attr("cy", pointCY);

      //loop through the group of circle handles attatched to the polygon and push to new array
      for (var i = 0; i < polypoints.length; i++) {

        var circleCoord = d3.select(circles._groups[0][i]);
        var pointCoord = [circleCoord.attr("cx"), circleCoord.attr("cy")];
        alteredPoints[i] = pointCoord;

      }

      //re-rendering polygon attributes to fit the handles
      polygon.attr("points", alteredPoints);
      bbox = parentNode._groups[0][0].getBBox();
    }

    function drawline() {
      if (drawMode) {
        linePoint2 = d3.mouse(this);
        group.select('line').remove();
        if(typeof linePoint1 != 'undefined'){
          group.append('line')
          .attr("x1", linePoint1.x)
          .attr("y1", linePoint1.y)
          .style('stroke','blue')
          .attr("x2", linePoint2[0]) //arbitary value must be substracted due to circle cursor hover not working
          .attr("y2", linePoint2[1]); // arbitary values must be tested
        }
      }
    }

    function decidePoly() {

      group.select('line').remove();
      group.select('polyline').remove();
      group.append('polyline').attr('points', polypoints);

      group.selectAll('circle').remove();

      for (var i = 0; i < polypoints.length; i++) {
        group.append('circle')
          .attr('cx', polypoints[i][0])
          .attr('cy', polypoints[i][1])
          .attr('r', 3)
          .attr("handle", true)
          .classed("handle", true)
          .style("cursor", "pointer");
      }
    }

    svgCanvas.on('mousedown',setPoint).on("click", function(){
      d3.event.stopPropagation();
      decidePoly();
    }).on('mousemove',drawline);

  }


  var _zoom = d3.zoom().scaleExtent([0.9, 5]).on("zoom", function() {svgContainer.attr("transform", d3.event.transform);});
  svgElement.call(_zoom).on("dblclick.zoom", null).on("wheel.zoom",null).on("touchstart.zoom mousedown.zoom touchmove.zoom touchend.zoom", enableAction);

  function enableAction(){
    if(drawMode){
      return null;
    }
    svgElement.call(_zoom);
  }

  var gui = d3.select(".action-bar");
  gui.select("#svgZoomIn").on("click", function() { _zoom.scaleBy(svgElement, 1.2); });
  gui.select("#svgZoomOut").on("click", function() { _zoom.scaleBy(svgElement, 0.5); });

  return svgmp;
}



