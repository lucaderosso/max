// Luca De Rosso
// http://www.lucaderosso.com/

// Instagram: @lucaderosso
// Twitter: @lucaderosso
// Facebook: facebook.com/derossoluca
// Pinterest: pinterest.com/lucaderosso


// SETTING UP WINDOW, RENDER AND SKETCH OBJECTS

var myWindow = new JitterObject("jit.window", "video-window"); //
myWindow.floating = 0;
myWindow.size = [300, 600];
// myWindow.rect = [305, 305];
myWindow.pos = [0, 50];
myWindow.fsaa = 1;
myWindow.floating = 1;
myWindow.fullscreen = 0;
myWindow.usedstrect = 1;
myWindow.depthbuffer = 0; // to enable transparency
myWindow.fsmenubar = 0;


var myRender = new JitterObject("jit.gl.render", "video-window");
myRender.erase_color = [0, 0, 0, 1]; // change last value to set background opacity
myRender.high_res = 1;
myRender.ortho = 2;

var mySketch = new JitterObject("jit.gl.sketch", "video-window");
mySketch.blend_enable = 1; //because we are working with transparency
mySketch.antialias = 1;

var viewPortStatus = 1;
var xPositions = [];
var yPositions = [];
var grid = [];
// 1440 X 900 = 3.2 X 2
// 1 X 2 = 0.5 X 1
var withRatio = myWindow.size[0] / myWindow.size[1]; // width ratio based on screen size
var heightRatio = 1; // height ratio based on screen size
var winL = -withRatio; // window left cohordinate
var winR = withRatio; // window right cohordinate
var winB = -heightRatio; // window bottom cohordinate
var winT = heightRatio; // window top cohordinate
var windowWidth = Math.abs(winL) + winR;
var windowHeight = Math.abs(winB) + winT;

var Vector = {
	x: 0.0,
	y: 0.0,
	z: 0.0,

	add:function(Vector){
		this.x += Vector.x;
		this.y += Vector.y;
		this.z += Vector.z;
	}
};

var Color = {
	r: 0.0,
	g: 0.0,
	b: 0.0,
	a: 1.0,

	add:function(Vector){
		this.r += Color.r;
		this.g += Color.g;
		this.b += Color.b;
		this.a += Color.a;
	}
};

function Line(startX, startY, endX, endY){
	this.startPoint = Object.create(Vector);
	this.startPoint.x = startX;
	this.startPoint.y = startY;
	this.startPoint.z = 0;
	
	this.endPoint = Object.create(Vector);
	this.endPoint.x = endX;
	this.endPoint.y = endY;
	this.endPoint.z = 0;

	this.color = Object.create(Color);
	this.color.r = 1;
	this.color.g = 1;
	this.color.b = 1;
	this.color.a = 0.1;
}

Line.prototype.display = function(){
	// mySketch.glcolor(0.39, 0.94, 1, 0.2);
	mySketch.glcolor(this.color.r, this.color.g, this.color.b, this.color.a);
	mySketch.gllinewidth(3);
	mySketch.linesegment(this.startPoint.x, this.startPoint.y, 0, this.endPoint.x, this.endPoint.y, 0);
}

Line.prototype.run = function(){
	this.display();
}


// METHODS

function fullScreen(toggle){
	myWindow.fullscreen = toggle;
}	

function toggleViewPort(toggle){
	viewPortStatus = toggle;	
}

function viewPort(){
	if(viewPortStatus == 1){
		// Drawing some guides to define viewport and help positioning the projector
		mySketch.moveto(0, 0, 0);
		mySketch.glcolor(0.5, 0.5, 0.5, 1);
		mySketch.gllinewidth(4);
		mySketch.linesegment(-0.5, 1, 0, 0.5, 1, 0);
		mySketch.linesegment(-0.5, -1, 0, 0.5, -1, 0);
		mySketch.linesegment(-0.5, 1, 0, -0.5, -1, 0);
		mySketch.linesegment(0.5, 1, 0, 0.5, -1, 0);
		// Drawing two black planes on the sides of the frame to hide bleeding
		mySketch.glcolor(0, 0, 0, 0.8);
		mySketch.moveto(-1.5, 1);
		mySketch.plane(1, 2);
		mySketch.moveto(1.5, 1);
		mySketch.plane(1, 2);
		myRender.axes = 1;		
	} else {
		mySketch.glcolor(0, 0, 0, 1);
		mySketch.moveto(-1.5, 1);
		mySketch.plane(1, 2);
		mySketch.moveto(1.5, 1);
		mySketch.plane(1, 2);
		myRender.axes = 0;
	}
}


function gridResolution(res){
	xPositions = [];
	yPositions = [];

	// if (withRatio > heightRatio){
	var wIncrement = windowWidth / res;		
	// } else if (withRatio <= heightRatio){
	// 	var wIncrement = windowWidth / wRes;
	// }

	var verticalRes = Math.floor(windowHeight / wIncrement);
	var verticalCorrector = (windowHeight - (verticalRes * wIncrement)) / 2;
	
	post("wIncrement: " + wIncrement + "\n");
	post("verticalRes: " + verticalRes + "\n");
	post("verticalCorrector: " + verticalCorrector + "\n");
	post("\n");
	post("\n");

	for(var i = 0; i <= res; i++){
		var xVal = (wIncrement * i) - (windowWidth / 2);
		xPositions.push(xVal);
	}

	for(var i = 0; i <= verticalRes; i++){
		var yVal = verticalCorrector + (wIncrement * i) - (windowHeight / 2);
		yPositions.push(yVal);
	}

	// post("xPositions: " + xPositions + "\n");
	// post("yPositions: " + yPositions + "\n");
}

function makeGrid(res){

	grid = [];
	
	if(res > 0){
		gridResolution(res);

		for(var i = 0; i < xPositions.length; i++){
			var sX = xPositions[i];
			var sY = yPositions[0];
			var eX = xPositions[i];
			var eY = yPositions[yPositions.length - 1];
			
			grid.push(new Line(sX, sY, eX, eY));
		}

		for(var i = 0; i < yPositions.length; i++){
			var sX = xPositions[0];
			var sY = yPositions[i];
			var eX = xPositions[xPositions.length - 1];
			var eY = yPositions[i];

			grid.push(new Line(sX, sY, eX, eY));
		}

		for(var i = 0; i < xPositions.length - 1; i++){
			var sX = xPositions[0];
			var sY = yPositions[i];
			var eX = xPositions[xPositions.length - 1 - i];
			var eY = yPositions[yPositions.length - 1];
			
			// grid.push(new Line(sX, sY, eX, eY));
		}

		for(var i = 1; i < xPositions.length - 1; i++){
			var sX = xPositions[i];
			var sY = yPositions[0];
			var eX = xPositions[xPositions.length - 1];
			var eY = yPositions[yPositions.length - 1 - i];
			
			// grid.push(new Line(sX, sY, eX, eY));
		}

		for(var i = 1; i < xPositions.length - 1; i++){
			var sX = xPositions[i];
			var sY = yPositions[0];
			var eX = xPositions[0];
			var eY = yPositions[i];
			
			// grid.push(new Line(sX, sY, eX, eY));
		}

		for(var i = 0; i < xPositions.length - 1; i++){
			var sX = xPositions[i];
			var sY = yPositions[yPositions.length - 1];
			var eX = xPositions[xPositions.length - 1];
			var eY = yPositions[i];
			
			// grid.push(new Line(sX, sY, eX, eY));
		}
	}

	// post("grid: " + grid.length + "\n");
}

function windowSize(w ,h){
	myWindow.size = [w ,h];

	if(w < h){
		withRatio = myWindow.size[0] / myWindow.size[1]; // width ratio based on screen size
		heightRatio = 1; // height ratio based on screen size		
	} else if(w > h){
		withRatio = 1; // width ratio based on screen size
		heightRatio = 1 / (myWindow.size[0] / myWindow.size[1]); // height ratio based on screen size
	} else if(w == h){
		withRatio = 1;
		heightRatio = 1;
	}

	winL = -withRatio; // window left cohordinate
	winR = withRatio; // window right cohordinate
	winB = -heightRatio; // window bottom cohordinate
	winT = heightRatio; // window top cohordinate
	windowWidth = Math.abs(winL) + winR;
	windowHeight = Math.abs(winB) + winT;

}

function gridIntensity(){
	if(grid.length > 0){
		for(var i = 0; i < grid.length; i++){
			// addin 0.1 so it never goes to 0
			grid[i].color.a = high + 0.1;
		}
	}
}

// given that small velocity values are very hard to trigger with preciosion, this method allows me to rudimentally tune the sensitivity of pads
function mappedVelocity(velocity){	
	// the smaller the number the higher will be the minimum value
	var sensitivity = 90;
	var mappedVelocity = 0;
	if(velocity >= sensitivity){
		mappedVelocity = 1.0;
	} else {
		mappedVelocity = velocity / sensitivity;
	}
	return mappedVelocity;
}
