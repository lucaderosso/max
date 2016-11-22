// Luca De Rosso
// http://www.lucaderosso.com/

// Instagram: @lucaderosso
// Twitter: @lucaderosso
// Facebook: facebook.com/derossoluca
// Pinterest: pinterest.com/lucaderosso

// Things you will forget
// 1.0 — always first check the array of shape is not empty otherwise it will give an error. remember every time a new scen starts the array is emptied and quickly populated again with the shapes necessary for the current scene



// GENERAL
autowatch = 1;

include("utilities");
include("characters");

var dial0 = 0;
var dial1 = 0;
var dial2 = 0;
var dial3 = 0;
var dial4 = 0;
var dial5 = 0;
var dial6 = 0;
var dial7 = 0;

var low = 0;
var mid = 0;
var high = 0;



// SETUP
makeGrid(8);



// METHODS
function noAction(){
	// This is ment to do nothing, to allow the possibility for the random function 
	// selection in the patch to avoid associating actions to midi notes.
}

function levels(l, m, h){
	low = l;
	mid = m;
	high = h;
}

function dialsValues(d0, d1, d2, d3, d4, d5, d6, d7){
	dial0 = d0;
	dial1 = d1;
	dial2 = d2;
	dial3 = d3;
	dial4 = d4;
	dial5 = d5;
	dial6 = d6;
	dial7 = d7;
}

function addPlane(xPos, yPos, width, height, r, g, b){
	shapes.push(new Plane(xPos, yPos, width, height, r, g, b));		
}

function clearAll(){
	layer1 = [];
	layer2 = [];
	layer3 = [];
	layer4 = [];
}

function background(){
	myRender.erase_color = [dial7, dial7, dial7, 1-(dial7 * 2)];
}

var topStatus = new Character(0, 0.9375, 0.005, 0);
var bottomStatus = new Character(0, -0.9375, 0.005, 0);

// DRAW

function draw(){
	
	background();
	gridIntensity();

	topStatus.run();
	bottomStatus.run();

	if(layer1.length > 0){
		for(var i = 0; i < layer1.length; i++){
			layer1[i].run();
		}
	}

	if(layer2.length > 0){
		for(var i = 0; i < layer2.length; i++){
			layer2[i].run();
		}
	}

	if(layer3.length > 0){
		for(var i = 0; i < layer3.length; i++){
			layer3[i].run();
		}
	}

	if(layer4.length > 0){
		for(var i = 0; i < layer4.length; i++){
			layer4[i].run();
		}
	}

	if(grid.length > 0){
		for(var i = 0; i < grid.length; i++){
			grid[i].run();
		}
	}


	viewPort();
	myRender.erase();
	myRender.drawswap();

	// reset the sketch at every frame to avoid to overload the command list 
	// that's because the sketch object will keep accumulating all the commands at each cycle	
	mySketch.reset();

}
