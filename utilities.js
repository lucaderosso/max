// Luca De Rosso
// http://www.lucaderosso.com/

// Instagram: @lucaderosso
// Twitter: @lucaderosso
// Facebook: facebook.com/derossoluca
// Pinterest: pinterest.com/lucaderosso


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
	r: 0,
	g: 0,
	b: 0,
	a: 1,

	add:function(Vector){
		this.r += Color.r;
		this.g += Color.g;
		this.b += Color.b;
		this.a += Color.a;
	}
};

var colorBlack = Object.create(Color);
colorBlack.r = 0.2;
colorBlack.g = 0.2;
colorBlack.b = 0.2;
var colorWhite = Object.create(Color);
colorWhite.r = 0.9;
colorWhite.g = 0.9;
colorWhite.b = 0.9;

var myMatrix = new JitterObject("jit.matrix", "mat"); //
myMatrix.dim = [1280, 1024];

// SETTING UP WINDOW, RENDER AND SKETCH OBJECTS
var myWindow = new JitterObject("jit.window", "video-window"); //
myWindow.floating = 0;
// myWindow.size = [1920, 1080];
myWindow.size = [960, 540];
// myWindow.rect = [305, 305];
myWindow.pos = [0, 50];
myWindow.fsaa = 1;
myWindow.floating = 0;
myWindow.border = 1;
myWindow.fullscreen = 0;
myWindow.usedstrect = 1;
myWindow.depthbuffer = 0; // to enable transparency
myWindow.fsmenubar = 0;
// myWindow.colormode = "uyvy";

var myRender = new JitterObject("jit.gl.render", "video-window");
myRender.erase_color = [0, 0, 0, 1]; // change last value to set background opacity
myRender.high_res = 1;
myRender.ortho = 2;

var mySketch = new JitterObject("jit.gl.sketch", "video-window");
mySketch.blend_enable = 1; //because we are working with transparency
mySketch.antialias = 1;
// mySketch.position = [-0.5, 0, 0];
// mySketch.automatic = 0;

var myGrid = new JitterObject("jit.gl.gridshape", "video-window");
myGrid.depth_enable = 1; 
myGrid.smooth_shading = 1; 
myGrid.lighting_enable = 1;
myGrid.shape = "plane";
myGrid.gl_color = [0.3, 0.3, 0.3, 0.5]; 
myGrid.gridmode = 0;
myGrid.poly_mode = 1;
myGrid.line_width = 2;

var viewPortStatus = 0;
var xPositions = [];
var yPositions = [];

var viewPortAspectRatio = [1, 2];

var screenResolution = [2880, 1800]; // setting widow size as a default value

var withRatio; // width ratio based on screen size
var heightRatio; // height ratio based on screen size
var viewPortLeft; // window left cohordinate
var viewPortRight; // window right cohordinate
var viewPortBottom; // window bottom cohordinate
var viewPortTop; // window top cohordinate
var windowWidth;
var windowHeight;

var subdivisions;
var increment;
var horizontalRes;
var verticalRes;

function calculateSizesForViewPort(){
	if(viewPortAspectRatio[0] <= viewPortAspectRatio[1]){
		withRatio = viewPortAspectRatio[0] / viewPortAspectRatio[1]; // width ratio based on screen size
		heightRatio = 1; // height ratio based on screen size		
	} else if(viewPortAspectRatio[0] > viewPortAspectRatio[1]){
		withRatio = 1; // width ratio based on screen size
		heightRatio = viewPortAspectRatio[1] / viewPortAspectRatio[0]; // height ratio based on screen size
	}
	viewPortLeft = -withRatio; // window left cohordinate
	viewPortRight = withRatio; // window right cohordinate
	viewPortBottom = -heightRatio; // window bottom cohordinate
	viewPortTop = heightRatio; // window top cohordinate
	windowWidth = Math.abs(viewPortLeft) + viewPortRight;
	windowHeight = Math.abs(viewPortBottom) + viewPortTop;
}

function scaleSketch(){
	if(heightRatio < 1){
		var factor = screenResolution[0] / screenResolution[1];
		mySketch.scale = [factor, factor, 1];
		myGrid.scale = [withRatio * factor, heightRatio * factor, 1];
	} else {
		mySketch.scale = [1, 1, 1];
		myGrid.scale = [withRatio, heightRatio, 1];
	}
}

function newGrid(i){
	subdivisions = i; // vertical subdivision is expressed in how many cells to display horizontaly, vertical count will be calculated accordingly
	
	if(viewPortAspectRatio[0] >= viewPortAspectRatio[1]){
		increment = windowHeight / subdivisions;		
	} else if(viewPortAspectRatio[0] < viewPortAspectRatio[1]){
		increment = windowWidth / subdivisions;
	}

	horizontalRes = windowWidth / increment;
	verticalRes = windowHeight / increment;
	positions = [-increment, increment];
	myGrid.dim = [1 + horizontalRes, 1 + verticalRes];
}

function assignScreenResolution(width, height){
	// sets the size of the sceen to project on
	screenResolution[0] = width;
	screenResolution[1] = height;
	calculateSizesForViewPort();
	scaleSketch();
}

function assignViewPortAspectRatio(width, height){
	// sets the size of the sceen to project on
	viewPortAspectRatio[0] = width;
	viewPortAspectRatio[1] = height;
	calculateSizesForViewPort();
	updateBrogressBarPosition();
	newGrid(8)
	scaleSketch();
}

function updateBrogressBarPosition(){
	progressBar.startPoint.x = viewPortLeft;
	progressBar.endPoint.x = viewPortRight;
	progressBar.startPoint.y = viewPortBottom;
	progressBar.endPoint.y = viewPortBottom;
}

function manualScale(factor){ 
	mySketch.scale = [factor, factor, 1];
	myGrid.scale = [withRatio * factor, heightRatio * factor, 1];
}

calculateSizesForViewPort();
scaleSketch();
viewPort();
newGrid(8);

function Line(startX, startY, endX, endY){
	this.startPoint = Object.create(Vector);
	this.startPoint.x = startX;
	this.startPoint.y = startY;
	this.startPoint.z = 0;
	
	this.endPoint = Object.create(Vector);
	this.endPoint.x = endX;
	this.endPoint.y = endY;
	this.endPoint.z = 0;

	this.color = colorWhite;
	this.color.r = 0.7;
	this.color.g = 0.7;
	this.color.b = 0.7;
}

Line.prototype.display = function(){
	mySketch.glpushmatrix();
	// mySketch.glcolor(0.39, 0.94, 1, 1);
	mySketch.glcolor(this.color.r, this.color.g, this.color.b, this.color.a);
	mySketch.quad(this.startPoint.x, this.startPoint.y, 0, this.startPoint.x, this.startPoint.y + 0.004, 0, this.endPoint.x, this.endPoint.y + 0.004, 0, this.endPoint.x, this.startPoint.y, 0);
	mySketch.glpopmatrix();
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
	mySketch.glpushmatrix();
	
	if(viewPortStatus == 1){
		mySketch.glcolor(0, 1, 0, 0.1);
		myRender.axes = 1;	

	} else {
		mySketch.glcolor(0, 0, 0, 1);
		myRender.axes = 0;		
	}

	if(heightRatio < 1){
		var x1 = viewPortRight;
		var y1 = viewPortTop;
		var x2 = viewPortRight;
		var y2 = viewPortTop + windowHeight * 10;
		var x3 = viewPortLeft;
		var y3 = viewPortTop + windowHeight * 10;
		var x4 = viewPortLeft;
		var y4 = viewPortTop;
		mySketch.quad(x1, y1, 0, x2, y2, 0, x3, y3, 0, x4, y4, 0);
		mySketch.quad(x1, -y1, 0, x2, -y2, 0, x3, -y3, 0, x4, -y4, 0);
	} else if(heightRatio >= 1){
		var x1 = viewPortRight + windowWidth * 10;
		var y1 = viewPortTop;
		var x2 = viewPortRight + windowWidth * 10;
		var y2 = viewPortBottom;
		var x3 = viewPortRight;
		var y3 = viewPortBottom;
		var x4 = viewPortRight;
		var y4 = viewPortTop;
		mySketch.quad(x1, y1, 0, x2, y2, 0, x3, y3, 0, x4, y4, 0);
		mySketch.quad(-x1, y1, 0, -x2, y2, 0, -x3, y3, 0, -x4, y4, 0);
	}
	mySketch.glpopmatrix();
	mySketch.glflush();
}

function gridIntensity(value){
	// if(grid.length > 0){
	// 	for(var i = 0; i < grid.length; i++){
	// 		// adding 0.1 so it never goes to 0
	// 		// grid[i].color.a = (high * value) + 0.1;
	// 	}
	// }
}
