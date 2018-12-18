import * as d3 from 'd3';

export function svgMap(svg){
  
  var options = {};
  var svgmp = {};
  var svgWrapper = d3.select(svg);
  var svgElement = svgWrapper.select('.map-wrap > svg');
  var svgContainer = d3.select('g#mapgroup');
  
  var _zoom = d3.zoom().scaleExtent([0.9, 5]).on("zoom", function() {svgContainer.attr("transform", d3.event.transform);});
  svgElement.call(_zoom).on("dblclick.zoom", null).on("wheel.zoom",null).on("touchstart.zoom mousedown.zoom touchmove.zoom touchend.zoom", enableAction);
  
  function enableAction(){
    svgElement.call(_zoom);
  }

  var gui = d3.select(".action-bar");
  gui.select("#svgZoomIn").on("click", function() { _zoom.scaleBy(svgElement, 1.2); });
  gui.select("#svgZoomOut").on("click", function() { _zoom.scaleBy(svgElement, 0.5); });
  return svgmp;
}
