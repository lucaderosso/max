// Luca De Rosso
// http://www.lucaderosso.com/

// Instagram: @lucaderosso
// Twitter: @lucaderosso
// Facebook: facebook.com/derossoluca
// Pinterest: pinterest.com/lucaderosso

// NOTES:
// Velocity is used in two ways:
// 1 - to enable events throug conditionals. If Velocity is greater than 0 it means there is an event so the m code can be executed
// 2 - to create variation on the method that is being called. i.e.: different values can make things move faster or slower



//==================
//		General
//==================

// these arrays are populated with all the Characters type that will be on stage at a given scene
var layer1 = [];
var layer2 = [];
var layer3 = [];
var layer4 = [];

var positions = [-increment, increment];
var size_multipliers = [0.625, 0.125, 0.25, 0.5, 1];

var rotation = false;
var vel = 0;



//====================================
//		Methods to manage layers
//====================================

function clearAll(){
	layer1 = [];
	layer2 = [];
	layer3 = [];
	layer4 = [];
}

function prepareArrayForLayer(layer){	
	var array = [];
	switch(layer){
		case "layer1":
			layer1 = [];
			array = layer1;
		break;
		case "layer2":
			layer2 = [];
			array = layer2;
		break;
		case "layer3":
			layer3 = [];
			array = layer3;
		break;
		case "layer4":
			layer4 = [];
			array = layer4;
		break;
	    default:
	}
	return array
}

function getArrayForLayer(layer){	
	var array = [];
	switch(layer){
		case "layer1":
			array = layer1;
		break;
		case "layer2":
			array = layer2;
		break;
		case "layer3":
			array = layer3;
		break;
		case "layer4":
			array = layer4;
		break;
	    default:
	}
	return array
}



//===========================
//		Character Object
//===========================

function Character(xPos, yPos, size, type){
	this.easing = false;
	this.flashing = false;
	this.rotating = false;
	this.dying = true;
	
	this.size = size;
	this.type = type;
	this.ease = 0.2;
	this.lifespan = 255;

	this.location = Object.create(Vector);
	this.location.x = xPos;
	this.location.y = yPos;	
	this.target = Object.create(Vector);

	this.rotation = 0;
	this.color = Object.create(Color);
	this.color.r = 1;
	this.color.g = 1;
	this.color.b = 1;
}

Character.prototype.display = function(){
	// REMEMBER — From OpenGL Red Book:
	// If you rotate the object first and then translate it, the rotated object appears on the x-axis.
	// If you translate it down the x-axis first, and then rotate about the origin, the object is on the line y=x. 
	// In general, the order of transformations is critical.
	// Also:
	// mySketch.moveto(0, 0, 0); is used below to center the composition on x,y 0,0.

	mySketch.glpushmatrix();
	var alpha = this.lifespan / 255.0;
	mySketch.glcolor(this.color.r, this.color.g, this.color.b, alpha);
	mySketch.gllinewidth(4);

	switch(this.type) {
	    case "round":
	    	mySketch.gltranslate(this.location.x, this.location.y, 0);
			mySketch.moveto(0, 0, 0);
			mySketch.circle(this.size / 2);
	        break;

	    case "rect":
		    mySketch.gltranslate(this.location.x, this.location.y, 0);
	    	mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.moveto(0, 0, 0); 
			mySketch.plane(this.size * 0.1, this.size * 1, this.size * 0.1, this.size * 1);
	        break;

	    case "square":
		    mySketch.gltranslate(this.location.x, this.location.y, 0);
	    	mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.moveto(0, 0, 0); 
			mySketch.plane(this.size, this.size, this.size, this.size);
	        break;   

	    case "circle":
	    	mySketch.gltranslate(this.location.x, this.location.y, 0);
			mySketch.shapeslice(50);
			mySketch.moveto(0, 0, 0);
			mySketch.circle(this.size);
			mySketch.glcolor(0, 0, 0, alpha);
			mySketch.circle(this.size / 1.5);
	        break;

	    case "x":
	    	mySketch.gltranslate(this.location.x, this.location.y, 0);
	    	mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.linesegment(-this.size/2, -this.size/2, 0, this.size/2, this.size/2, 0);
			mySketch.linesegment(-this.size/2, this.size/2, 0, this.size/2, -this.size/2, 0);
	        break;

	    case "rail":
			mySketch.gltranslate(0, this.location.y, 0);
			mySketch.moveto(0, 0, 0);
			mySketch.linesegment(-this.size, 0, 0, this.size, 0, 0);
			mySketch.linesegment(this.size*this.location.x, this.size/8, 0, this.size*this.location.x, -this.size/8, 0);
			// mySketch.linesegment(-this.size, this.size/8, 0, -this.size, -this.size/8, 0);	
	        break;

	    case "stripes":
	    	var w = 32;
		    mySketch.gltranslate(this.location.x, this.location.y, 0);
	    	mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.moveto((2*windowWidth/w), 0, 0);
			mySketch.plane(windowWidth/w, windowHeight/4, windowWidth/w, windowHeight/4);
			mySketch.moveto((-2*windowWidth/w), 0, 0);
			mySketch.plane(windowWidth/w, windowHeight/4, windowWidth/w, windowHeight/4);
			mySketch.moveto((6*windowWidth/w), 0, 0);
			mySketch.plane(windowWidth/w, windowHeight/4, windowWidth/w, windowHeight/4);
			mySketch.moveto((-6*windowWidth/w), 0, 0);
			mySketch.plane(windowWidth/w, windowHeight/4, windowWidth/w, windowHeight/4);
	        break;

	    case "razor":
		    mySketch.gltranslate(this.location.x, 0, 0);
			mySketch.linesegment(-0.5, -1, 0, -0.5, 1, 0);
			mySketch.moveto(-windowHeight/2, 0, 0); 
	        mySketch.glcolor(0, 0, 0, 1);
			mySketch.plane(windowWidth/2, windowHeight/2, windowWidth/2, windowHeight/2);

		    mySketch.gltranslate(-this.location.x, this.location.y, 0);
		    mySketch.glcolor(1, 1, 1, 1);
			mySketch.linesegment(-1, 0, 0, 1, 0, 0);
			mySketch.moveto(0, -windowHeight/2, 0); 
	        mySketch.glcolor(0, 0, 0, 1);
			mySketch.plane(windowWidth/2, windowHeight/2, windowWidth/2, windowHeight/2);
	        break;

	    default:
	    	// if no object type has been assigned, make a red dot in the middle of the screen 
	    	mySketch.gltranslate(0, 0, 0);
			mySketch.moveto(0, 0, 0);
			mySketch.glcolor(1, 0, 0, 1);
			mySketch.circle(this.size);
	}

	mySketch.glpopmatrix();
}

Character.prototype.update = function(){
	if(this.easing){
		this.easeTo(this.location, this.target, this.ease);
	}
	if(this.flashing){
		this.flash();		
	}
	if(this.rotating){
		this.rot();		
	}
	if(this.dying){
		this.lifespan -= 15;
	}
}

Character.prototype.run = function(){
	this.update();
	this.display();	
}

Character.prototype.easeTo = function(position, target, ease){
	var dx = target.x - position.x;
	var dy = target.y - position.y;
	
	position.x += dx * ease;
	position.y += dy * ease;

	if(Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
		position.x = target.x;
		position.y = target.y;
		this.easing = false;
	}
	this.easing = true;
}

Character.prototype.flash = function(){
	if((clock % 3) == 0){
		// this.location.x = 0.2;
		this.color.a = 1;
	} else {
		// this.location.x = 0;
		this.color.a = 0;
	}
}

Character.prototype.rot = function(){
	this.rotation += 1;
}



//====================================
//		Methods to add characters
//====================================

function addAndPosition(layer, type, layout, quantity, size){
	// layer: mandatory
	// type: mandatory
	// layout: ??
	// quantity: ??
	// size: ??

	var array = prepareArrayForLayer(layer);
	
	switch(layout){

		case "default":
			// for(var i = 0; i < quantity; i++){
				// will create a number of objects all placed at the default coordinates
				var xPos = 0;
				var yPos = 0;
				var newSize = 0;

				if(windowWidth < windowHeight){
					newSize = windowWidth / 2;
				} else if(windowWidth > windowHeight){
					newSize = windowHeight / 2;
				}

				addCharactersToLayer(array, xPos, yPos, newSize, type);
			// }
		break;

		case "random":
			for(var i = 0; i < quantity; i++){
				// wil arrange objects randomly on the grid
				var xPos = positions[Math.floor((Math.random() * 7))];
				var yPos = positions[Math.floor((Math.random() * 7))];
				addCharactersToLayer(array, xPos, yPos, size, type);
			}
		break;

		case "organized":
			for(var i = 0; i < quantity; i++){
				// will arrange objects on the grid forming an organized group
				
				// var xElements = ;
				// var yElements = ;
				var xElements = Math.floor(Math.sqrt(quantity));
				var yElements = Math.ceil(Math.sqrt(quantity));

				// for(){
				// 	increment y
				// 	for(){
				// 		increment x
				// 	}
				// }
				addCharactersToLayer(array, xPos, yPos, size, type);
			}
		break;

		default:
			// adding this as a duplicate of the default above in case of errors in the layouts.txt file
			for(var i = 0; i < quantity; i++){
				// will create a number of objects all placed at the default coordinates
				var xPos = 0;
				var yPos = 0;
				addCharactersToLayer(array, xPos, yPos, size, type);
			}
	}

	// post(numberOfCharacters + " should be " + xElements + " x " + yElements + "\n");
	// post("\n");

	// post(layer + " has: " + quantity + " charaters of " + type + " type." + "\n");
	// post("\n");
}

function addCharactersToLayer(layer, x, y, size_multiplier, t){
	// given that having a size of zero would make the shape invisible and therefore resul useless, I'm using 0 to enable randomization of size
	if(size_multiplier == 0){
		var size = increment * size_multipliers[Math.floor((Math.random() * 5))];		
	} else {
		var size = size_multiplier * increment;
	}
	layer.push(new Character(x, y, size, t));
}

function calculateLocationIncrements(wRes, hRes){
	var wInc = windowWidth / wRes;
	var hInc = windowHeight / hRes;
	// post("wInc: " + wInc + "\n");
	// post("hInc: " + hInc + "\n");
}



//=====================================
//		Methods to move characters
//=====================================

function noAction(){
	// This is ment to do nothing, to allow the possibility for the random function 
	// selection in the patch to avoid associating actions to midi notes.
}

function rotate(layer, velocity){
	var array = getArrayForLayer(layer);
	// do the following only if the array is populated to avoid errors
	if(array.length > 0){
		for(var i = 0; i < array.length; i++){
			if(velocity > 0){
				array[i].rotating = true;
			} else if (velocity == 0) {
				if (array[i].rotation % 45 != 0){
					array[i].rotation += 45 - (array[i].rotation % 45);
				} 
				array[i].rotating = false;
			}
		}
	}
}



function makeStep(layer, velocity, orientation, ease){
	// go get the right array for the layer I want to interact with
	var array = getArrayForLayer(layer);
	// create to variables to which then assign x and y steps
	var xStep;
	var yStep;

	sustain(layer, velocity);

	// do the following only if the array is populated to avoid errors
	if(array.length > 0 && velocity > 0){
		// go through each element in the array
		for(var i = 0; i < array.length; i++){
			// recover lifespan
			array[i].lifespan = 255;
			// disable easing
			array[i].easing = ease;
			array[i].ease = velocity / 128;

			

			switch(orientation){
				case "horizontal":
					// pick a position where to send the object
					xStep = positions[Math.floor((Math.random() * 2))];
					yStep = 0;
				break;
				case "vertical":
					// pick a position where to send the object
					xStep = 0;
					yStep = positions[Math.floor((Math.random() * 2))];
				break;
				case "both":
					// pick a position where to send the object
					xStep = positions[Math.floor((Math.random() * 2))];
					yStep = positions[Math.floor((Math.random() * 2))];
				break;
				case "center":
					if(array[i].location.x == 0){
						array[i].location.x = positions[Math.floor((Math.random() * 2))];
					}
					xStep = -array[i].target.x;
					yStep = 0;
			    default:
			}

			// check and eventually correct direction if the target is outside the defined window bounds
			var validatedDirection = new checkDirectionAndCorrect(array[i], xStep, yStep);

			// assign target to object
			if(array[i].easing == true){
				// make the object jumb to the previously established target
				array[i].location.x = array[i].target.x;
				array[i].location.y = array[i].target.y;
				// calculate new target to ease to
				array[i].target.x = array[i].target.x + validatedDirection[0];
				array[i].target.y = array[i].target.y + validatedDirection[1];
			} else if(array[i].easing == false){
				// calculate new target to jump to
				array[i].target.x = array[i].target.x + validatedDirection[0];
				array[i].target.y = array[i].target.y + validatedDirection[1];
				// make the object jump to target
				array[i].location.x = array[i].target.x;
				array[i].location.y = array[i].target.y;
			}
		}
	}
}

function sustain(layer, velocity){
	// go get the right array for the layer I want to interact with
	var array = getArrayForLayer(layer);

	for(var i = 0; i < array.length; i++){
		if(velocity > 0){
			array[i].dying = false;
		} else {
			array[i].dying = true;
		}
	}
}

function checkDirectionAndCorrect(object, xSelected, ySelected){
	var x = xSelected;
	var y = ySelected;

	if(object.target.x + xSelected < winL || object.target.x + xSelected > winR){
		x = xSelected * -1;
	} else if(object.target.y + ySelected < winB || object.target.y + ySelected > winT){
		y = ySelected * -1;
	}
	return [x, y];
}

function flash(layer, velocity){
	var array = getArrayForLayer(layer);
	// do the following only if the array is populated to avoid errors
	if(array.length > 0){
		for(var i = 0; i < array.length; i++){
			if(velocity > 0){
				array[i].flashing = true;
			} else {
				array[i].color.a = 0;
				array[i].flashing = false;
			}
		}
	}
}

function appear(layer, velocity){
	var array = getArrayForLayer(layer);
	// do the following only if the array is populated to avoid errors
	if(array.length > 0){
		for(var i = 0; i < array.length; i++){
			if(velocity > 0){
				array[i].lifespan = 255;				
			} else if(velocity == 0){
				array[i].lifespan = 0;
			}
		}
	}
}

function stepRandomly(layer, velocity){
	makeStep(layer, velocity, "both", false);
}	

function stepVertically(layer, velocity){
	makeStep(layer, velocity, "vertical", false);
}	

function stepHorizontally(layer, velocity){
	makeStep(layer, velocity, "horizontal", false);
}	

function stepToCenter(layer, velocity){
	makeStep(layer, velocity, "center", false);
}

function easeRandomly(layer, velocity){
	makeStep(layer, velocity, "both", true);
}

function easeVertically(layer, velocity){
	makeStep(layer, velocity, "vertical", true);
}

function easeHorizontally(layer, velocity){
	makeStep(layer, velocity, "horizontal", true);
}

function easeToCenter(layer, velocity){
	makeStep(layer, velocity, "center", true);
}
