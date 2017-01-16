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
outlets = 2;

include("utilities");
include("characters");

// low mid high levels coming from the DSP Values M4L device in the same track as this one.
var low = 0;
var mid = 0;
var high = 0;

var progressBar = new Line(viewPortLeft, viewPortBottom, viewPortRight, viewPortBottom);


//==================
//		Setup
//==================

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

function lfoFreq(value){
	// var freqs = [2, 4, 8, 16, 32];
	var freqs = [32, 16, 8, 4, 2, 1];
	var freq = freqs[value];
	// post("freq: " + freq + "\n");
	return freq;
}

function levels(l, m, h){
	// update values for low mid high levels coming from the DSP Values M4L device in the same track as this one.
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

	// assign dials to the method they should run
	lfoFreq(d1);
	updateLifeDecay(d2);
	// d3
	// d4
	// d5
	// d6
	background(d7);
}

function background(value){
	// colorBackground.r = 0.9;
	// colorBackground.g = 0.9;
	myRender.erase_color = [0, 0, 0, value];
}

function invertColors(invert){
	if (invert == 1) {
		// black into white
		colorBlack.r = 0.9;
		colorBlack.g = 0.9;
		colorBlack.b = 0.9;
		// white into black
		colorWhite.r = 0;
		colorWhite.g = 0;
		colorWhite.b = 0;
		// background
		myRender.erase_color = [1, 1, 1, 1];
	} else if (invert == 0){
		// back to black
		colorBlack.r = 0;
		colorBlack.g = 0;
		colorBlack.b = 0;
		// back to white
		colorWhite.r = 0.9;
		colorWhite.g = 0.9;
		colorWhite.b = 0.9;
		// background
		myRender.erase_color = [0, 0, 0, 1];
	}
}

function updateProgressBar(timeLeft, totalTime){
	progressBar.endPoint.x = (windowWidth * (timeLeft / totalTime)) - winR;
}

var sustainForLayer1 = false;
var sustainForLayer2 = false;
var sustainForLayer3 = false;
var sustainForLayer4 = false;

function updateSustainForLayer(layer, velocity){	
	
	var sustainStatus = velocity > 0 ? true : false;
	
	switch (layer){
		case "layer1":
			sustainForLayer1 = sustainStatus;
		break;
		case "layer2":
			sustainForLayer2 = sustainStatus;
		break;
		case "layer3":
			sustainForLayer3 = sustainStatus;
		break;
		case "layer4":
			sustainForLayer4 = sustainStatus;
		break;
		default:
	}
}


//==================
//		Draw
//==================

var clock = 1;

function draw(){
	// mySketch.moveto(-1, 0, 0);
	// mySketch.glrotate(45, 0, 0, 1);

	if (clock <= 32){
		clock += 1;		
	} else {
		clock = 1;
	}
    
	// you should consider creating a rule by which only when decay is 255 these loop ar run
	// this will avoid to have instructions being sent also for layers not displayed
	if(layer1.length > 0 && sustainForLayer1 == true){
		for(var i = 0; i < layer1.length; i++){
			layer1[i].run();
		}
	}	

	if(layer2.length > 0 && sustainForLayer2 == true){
		for(var i =	 0; i < layer2.length; i++){
			layer2[i].run();
		}
	}

	if(layer3.length > 0 && sustainForLayer3 == true){
		for(var i = 0; i < layer3.length; i++){
			layer3[i].run();
		}
	}

	if(layer4.length > 0 && sustainForLayer4 == true){
		for(var i = 0; i < layer4.length; i++){
			layer4[i].run();
		}
	}

	outlet(0, "jit_matrix", myRender.name); 
	outlet(1, "jit_matrix", myMatrix.name);

	progressBar.run();

	gridIntensity(dial1);
	viewPort();

	myRender.erase();
	myRender.drawswap();

	// reset the sketch at every frame to avoid to overload the command list 
	// that's because the sketch object will keep accumulating all the commands at each cycle	
	mySketch.reset();
}
