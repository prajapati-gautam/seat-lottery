d3.select('#poly').on('click', function() {
	new Polygon();
});

var w = 723,
		h = 523;
var svgCanvas = d3.select('body').append('svg').attr("width", w).attr("height", h);

function Polygon() {

	var polyPoints = [];
	var gContainer = svgCanvas.append('g').classed("outline", true);
	var isDrawing = false;
	var isDragging = false;
	var linePoint1, linePoint2;
	var startPoint;
	var bbox;
	var boundingRect;
	var shape;
	var gPoly;

	var polyDraw = svgCanvas.on("mousedown", setPoints)
		.on("mousemove", drawline)
		.on("mouseup", decidePoly);

	var dragBehavior = d3.drag().on("drag", alterPolygon);
	//        var dragPolygon = d3.drag().on("drag", movePolygon(bbox));

	//On mousedown - setting points for the polygon
	function setPoints() {

		if (isDragging) return;


		isDrawing = true;

		var plod = d3.mouse(this);
		linePoint1 = {
			x: plod[0],
			y: plod[1]
		};

		polyPoints.push(plod);

		var circlePoint = gContainer.append("circle")
			.attr("cx", linePoint1.x)
			.attr("cy", linePoint1.y)
			.attr("r", 4)
			.attr("start-point", true)
			.classed("handle", true)
			.style("cursor", "pointer");


		// on setting points if mousedown on a handle
		if (d3.event.target.hasAttribute("handle")) {
			completePolygon()
		}

	}

	//on mousemove - appending SVG line elements to the points
	function drawline() {

		if (isDrawing) {
			linePoint2 = d3.mouse(this);
			gContainer.select('line').remove();
			gContainer.append('line')
				.attr("x1", linePoint1.x)
				.attr("y1", linePoint1.y)
				.attr("x2", linePoint2[0] - 2) //arbitary value must be substracted due to circle cursor hover not working
				.attr("y2", linePoint2[1] - 2); // arbitary values must be tested

		}
	}

	//On mouseup - Removing the placeholder SVG lines and adding polyline
	function decidePoly() {

		gContainer.select('line').remove();
		gContainer.select('polyline').remove();

		var polyline = gContainer.append('polyline').attr('points', polyPoints);

		gContainer.selectAll('circle').remove();

		for (var i = 0; i < polyPoints.length; i++) {
			var circlePoint = gContainer.append('circle')
				.attr('cx', polyPoints[i][0])
				.attr('cy', polyPoints[i][1])
				.attr('r', 4)
				.attr("handle", true)
				.classed("handle", true);

		}

	}

	//Called on mousedown if mousedown point if a polygon handle
	function completePolygon() {
		d3.select('g.outline').remove();

		gPoly = svgCanvas.append('g')
			.classed("polygon", true);

		polyPoints.splice(polyPoints.length - 1);
		console.log(polyPoints);

		polyEl = gPoly.append("polygon")
			.attr("points", polyPoints);

		for (var i = 0; i < polyPoints.length; i++) {
			gPoly.append('circle')
				.attr("cx", polyPoints[i][0])
				.attr("cy", polyPoints[i][1])
				.attr("r", 4)
				.call(dragBehavior);
		}

		isDrawing = false;
		isDragging = true;

		bbox = polyEl._groups[0][0].getBBox();
		var bbox2 = gPoly._groups[0][0].getBBox();


		bbox.x = 0;
		bbox.y = 0;
		bbox.width = 50;
		bbox.height = 50;


		//            debugger;

		gPoly.datum({
			x: 0,
			y: 0
		})

		//console.log(bbox);
		gPoly.attr("transform", function(d) {
			return "translate(" + d.x + "," + d.y + ")"
		});
		//          polyEL.attr("transform", "translate(" + 0 + "," + 0 + ")");
		//
		gPoly.call(d3.drag().on("drag", function(d) {
			d3.select(this).attr("transform", "translate(" + (d.x = d3.event.x) + "," + (d.y = d3.event.y) + ")")
		}));

	}

	//Altering polygon coordinates based on handle drag
	function alterPolygon() {

		if (isDrawing === true) return;

		var alteredPoints = [];
		var selectedP = d3.select(this);
		var parentNode = d3.select(this.parentNode);

		//select only the elements belonging to the parent <g> of the selected circle
		var circles = d3.select(this.parentNode).selectAll('circle');
		var polygon = d3.select(this.parentNode).select('polygon');


		var pointCX = d3.event.x;
		var pointCY = d3.event.y;

		//rendering selected circle on drag
		selectedP.attr("cx", pointCX).attr("cy", pointCY);

		//loop through the group of circle handles attatched to the polygon and push to new array
		for (var i = 0; i < polyPoints.length; i++) {

			var circleCoord = d3.select(circles._groups[0][i]);
			var pointCoord = [circleCoord.attr("cx"), circleCoord.attr("cy")];
			alteredPoints[i] = pointCoord;

		}

		//re-rendering polygon attributes to fit the handles
		polygon.attr("points", alteredPoints);

		bbox = parentNode._groups[0][0].getBBox();
		console.log(bbox);
	}

	function movePolygon() {

	}

	function prepareTransform(bboxVal) {

		var originalPosition = {
			x: bboxVal.x,
			y: bboxVal.y
		};

		console.log(bboxVal);
		console.log(bbox);

		bbox.x = 0;
		bbox.y = 0;




		//            //render a bounding box
		//            shape.rectEl.attr("x", bbox.x).attr("y", bbox.y).attr("height", bbox.height).attr("width", bbox.width);
		//
		//            //drag points
		//            shape.pointEl1.attr("cx", bbox.x).attr("cy", bbox.y).attr("r", 4);
		//            shape.pointEl2.attr("cx", (bbox.x + bbox.width)).attr("cy", (bbox.y + bbox.height)).attr("r", 4);
		//            shape.pointEl3.attr("cx", bbox.x + bbox.width).attr("cy", bbox.y).attr("r", 4);
		//            shape.pointEl4.attr("cx", bbox.x).attr("cy", bbox.y + bbox.height).attr("r", 4);

		return originalPosition;
	}
}


