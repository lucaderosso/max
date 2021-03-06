// Luca De Rosso
// http://www.lucaderosso.com/

// Instagram: @lucaderosso
// Twitter: @lucaderosso
// Facebook: facebook.com/derossoluca
// Pinterest: pinterest.com/lucaderosso

// Things you will forget
// 1.0 — always first check the array of shape is not empty otherwise it will give an error. remember every time a new scen starts the array is emptied and quickly populated again with the shapes necessary for the current scene



//===================
//		General
//===================

autowatch = 1;

include("utilities");
include("characters");

// dials controlled by user
var dial0 = 0;
var dial1 = 0;
var dial2 = 0;
var dial3 = 0;
var dial4 = 0;
var dial5 = 0;
var dial6 = 0;
var dial7 = 0;

// low mid high levels coming from the DSP Values M4L device in the same track as this one.
var low = 0;
var mid = 0;
var high = 0;

// create two x to display at the top and bottom of the projection 
var topStatus = new Character(0, 0.9375, 0.005, "x");
var bottomStatus = new Character(0, -0.9375, 0.005, "x");
var progressBar = new Line(winL, winB, winR, winB, 20, 1);



//==================
//		Setup
//==================

makeGrid(16); // build a grid that draw() will display



//==================
//		Methods
//==================

function levels(l, m, h){
	// update values for low mid high levels coming from the DSP Values M4L device in the same track as this one.
	low = l;
	mid = m;
	high = h;
}

function dialsValues(d0, d1, d2, d3, d4, d5, d6, d7){
	// update valued for dials controlled by user
	dial0 = d0;
	dial1 = d1;
	dial2 = d2;
	dial3 = d3;
	dial4 = d4;
	dial5 = d5;
	dial6 = d6;
	dial7 = d7;
}

function background(){
	myRender.erase_color = [dial7, dial7, dial7, 1-(dial7 * 2)];
}

function updateProgressBar(timeLeft, totalTime){
	progressBar.endPoint.x = (windowWidth * (timeLeft / totalTime)) - winR;
}



//==================
//		Draw
//==================

function draw(){

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

	topStatus.run();
	bottomStatus.run();
	progressBar.run();

	background();
	gridIntensity();
	viewPort();

	myRender.erase();
	myRender.drawswap();

	// reset the sketch at every frame to avoid to overload the command list 
	// that's because the sketch object will keep accumulating all the commands at each cycle	
	mySketch.reset();

}
