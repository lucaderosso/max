// Luca De Rosso
// http://www.lucaderosso.com/

// Instagram: @lucaderosso
// Twitter: @lucaderosso
// Facebook: facebook.com/derossoluca
// Pinterest: pinterest.com/lucaderosso
// Github:

// Things you will forget
// 1.0 — always first check the array of shape is not empty otherwise it will give an error. remember every time a new scen starts the array is emptied and quickly populated again with the shapes necessary for the current scene


//===================
//		General
//===================

autowatch = 1;
outlets = 2;

include("utilities");
include("characters");

// low mid high levels coming from the DSP Values M4L device in the same track as this one.
var low = 0;
var mid = 0;
var high = 0;

var dial0 = 0;
var dial1 = 0;
var dial2 = 0;
var dial3 = 0;
var dial4 = 0;
var dial5 = 0;
var dial6 = 0;
var dial7 = 0;

var progressBar = new Line(viewPortLeft, viewPortBottom, viewPortRight, viewPortBottom);


//==================
//		Setup
//==================

calculateSizesForViewPort();
scaleSketch();
viewPort();
newGrid(8); // build a grid that draw() will display



//==================
//		Methods
//==================

function transport(l, m, h){
	// update values for low mid high levels coming from the DSP Values M4L device in the same track as this one.
	low = l;
	mid = m;
	high = h;
}

function levels(l, m, h){
	// update values for low mid high levels coming from the DSP Values M4L device in the same track as this one.
	low = l;
	mid = m;
	high = h;
}

function dialValue(dial, value){	
	switch (dial){
		case "d0":
			assignLifeSpan(value);
			dial0 = value;
		break;
		case "d1":
			dial1 = value;
		break;
		case "d2":
			dial2 = value;
		break;
		case "d3":
			dial3 = value;
		break;
		case "d4":
			dial4 = value;
		break;
		case "d5":
			dial5 = value;
		break;
		case "d6":
			updateLifeDecay(value);			
			dial6 = value;
		break;
		case "d7":
			background(value);
			dial7 = value;
		break;
		default:
	}
}

var whiteOnBlack = true;

function invertColors(invert){
	if (invert == 0) {
		whiteOnBlack = true;
		// back to black
		colorBlack.r = 0;
		colorBlack.g = 0;
		colorBlack.b = 0;
		// back to white
		colorWhite.r = 0.9;
		colorWhite.g = 0.9;
		colorWhite.b = 0.9;
		// black background
		myRender.erase_color = [0, 0, 0, 1];
		// white grid
		myGrid.gl_color = [0.8, 0.8, 8, 0.1];
	} else if (invert == 1){
		whiteOnBlack = false;
		// black into white
		colorBlack.r = 0.9;
		colorBlack.g = 0.9;
		colorBlack.b = 0.9;
		// white into black
		colorWhite.r = 0;
		colorWhite.g = 0;
		colorWhite.b = 0;
		// white background background
		myRender.erase_color = [1, 1, 1, 1];
		// black grid
		myGrid.gl_color = [0, 0, 0, 0.1];
	}
}

function gridIntensity(){
	// adding 0.1 so it never goes to 0
	if(whiteOnBlack == true){
		myGrid.gl_color = [0.8, 0.8, 0.8, (high * dial1) + 0.1];
	} else {
		myGrid.gl_color = [0, 0, 0, (high * dial1) + 0.1];
	}
}

function background(value){
	if(whiteOnBlack == true){
		myRender.erase_color = [0, 0, 0, 1 - value];
	} else {
		myRender.erase_color = [1, 1, 1, 1 - value];
	}
}

function updateProgressBar(timeLeft, totalTime){
	progressBar.endPoint.x = (windowWidth * (timeLeft / totalTime)) - viewPortRight;
}

function updateSustainForLayer(layer, velocity){	
	// this method was made to update a boolean value I can then use to decide 
	// wether or not drawing instruction for a specific layer should be sent to mySketch
	// with the objective to same cpu when shapes' lifespan is 0
	var sustainStatus = velocity > 0 ? true : false;
	
	switch (layer){
		case "layer1":
			layer1.sustain = sustainStatus;
		break;
		case "layer2":
			layer2.sustain = sustainStatus;
		break;
		case "layer3":
			layer3.sustain = sustainStatus;
		break;
		case "layer4":
			layer4.sustain = sustainStatus;
		break;
		default:
	}
}


//==================
//		Draw
//==================

function draw(){

	if(layer1.toDraw()){
		for(var i = 0; i < layer1.elements.length; i++){
			layer1.elements[i].run();
		}
	}

	if(layer2.toDraw()){
		for(var i = 0; i < layer2.elements.length; i++){
			layer2.elements[i].run();
		}
	}

	if(layer3.toDraw()){
		for(var i = 0; i < layer3.elements.length; i++){
			layer3.elements[i].run();
		}
	}

	if(layer4.toDraw()){
		for(var i = 0; i < layer4.elements.length; i++){
			layer4.elements[i].run();
		}
	}

	outlet(0, "jit_matrix", myRender.name); 
	outlet(1, "jit_matrix", myMatrix.name);

	progressBar.run();
	gridIntensity();
	viewPort();

	myRender.erase();
	myRender.drawswap();

	// reset the sketch at every frame to avoid to overload the command list 
	// that's because the sketch object will keep accumulating all the commands at each cycle	
	mySketch.reset();
}
