// Luca De Rosso
// http://www.lucaderosso.com/

// Instagram: @lucaderosso
// Twitter: @lucaderosso
// Facebook: facebook.com/derossoluca
// Pinterest: pinterest.com/lucaderosso



//==================
//		General
//==================

// these arrays are populated with all the Characters type that will be on stage at a given scene
var layer1 = [];
var layer2 = [];
var layer3 = [];
var layer4 = [];

var positions = [-0.25, 0.25, 0.25, -0.25, -0.25, 0.25, 0.25];
// var positions = [-0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75];

var rotation = false;
var vel = 0;



//===========================
//		Character Object
//===========================

function Character(xPos, yPos, size, type){
	this.easing = false;
	this.ease = 0.2;
	this.location = Object.create(Vector);
	this.location.x = xPos;
	this.location.y = yPos;

	this.startX = xPos;
	this.startY = yPos;

	this.target = Object.create(Vector);
	this.target.x = xPos;
	this.target.y = yPos;
	this.rotation = 0;
	this.color = Object.create(Color);
	this.color.r = 1;
	this.color.g = 1;
	this.color.b = 1;
	this.size = size;
	this.type = type
}

Character.prototype.display = function(){
	// REMEMBER — From OpenGL Red Book:
	// If you rotate the object first and then translate it, the rotated object appears on the x-axis.
	// If you translate it down the x-axis first, and then rotate about the origin, the object is on the line y=x. 
	// In general, the order of transformations is critical.
	// Also:
	// mySketch.moveto(0, 0, 0); is used below to center the composition on x,y 0,0.

	mySketch.glpushmatrix();
	mySketch.glcolor(this.color.r, this.color.g, this.color.b, this.color.alpha);
	mySketch.gllinewidth(4);

	switch(this.type) {
	    case "x":
	    	mySketch.gltranslate(this.location.x, this.location.y, 0);
	    	mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.linesegment(-this.size, -this.size, 0, this.size, this.size, 0);
			mySketch.linesegment(-this.size, this.size, 0, this.size, -this.size, 0);
	        break;

	    case "cyclopx":
			mySketch.gltranslate(this.location.x, this.location.y, 0);
			mySketch.shapeslice(50);
			mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.moveto(0, 0, 0);
			mySketch.circle(this.size);
			mySketch.glcolor(0, 0, 0, this.color.alpha);
			mySketch.circle(this.size / 4);
			mySketch.glcolor(this.color.r, this.color.g, this.color.b, 0.3);
			mySketch.linesegment(-this.size, -this.size, 0, this.size, this.size, 0);
			mySketch.linesegment(-this.size, this.size, 0, this.size, -this.size, 0);	
	        break;

	    case "plane":
		    mySketch.gltranslate(this.location.x, this.location.y, 0);
	    	mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.moveto(0, 0, 0); 
			mySketch.plane(this.size * 0.1, this.size * 1, this.size * 0.1, this.size * 1);
	        break;

	    case "circle":
	    	mySketch.gltranslate(this.location.x, this.location.y, 0);
			mySketch.shapeslice(50);
			mySketch.moveto(0, 0, 0);
			mySketch.circle(this.size);
			mySketch.glcolor(0, 0, 0, 1);
			mySketch.circle(this.size / 1.5);
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

Character.prototype.run = function(){
	if(this.easing){
		this.easeTo(this.location, this.target, this.ease);
	}
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



//==================
//		Methods
//==================

//–––––––––––––––––
// Adding elements
//–––––––––––––––––

function addAndPosition(layer, type, layouts, quantity, size){

	var array = prepareArrayForLayer(layer);
	
	switch(layouts){

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

function addCharactersToLayer(layer, x, y, s, t){
	var size = s;
	// given that having a size of zero would make the shape invisible and therefore resul useless, I'm using 0 to enable randomization of size
	if(size == 0){
		// sizes should be externally accessible by all methods and populated by utilities.js
		var sizes = [0.125, 0.0625, 0.03125];
		var size = sizes[Math.floor((Math.random() * 3))];		
	}

	layer.push(new Character(x, y, size, t));
}

function calculateLocationIncrements(wRes, hRes){
	var wInc = windowWidth / wRes;
	var hInc = windowHeight / hRes;
	// post("wInc: " + wInc + "\n");
	// post("hInc: " + hInc + "\n");
}

function clearAll(){
	layer1 = [];
	layer2 = [];
	layer3 = [];
	layer4 = [];
}



//–––––––––––––––––
// Moving elements
//–––––––––––––––––

function noAction(){
	// This is ment to do nothing, to allow the possibility for the random function 
	// selection in the patch to avoid associating actions to midi notes.
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

function rotate(layer, velocity){	
	vel = 9;
	if(vel > 0){
		rotation = true;
		doRotate(layer);
	}
	// } else if (vel == 0){
	// 	rotation = false;
	// }
}

function doRotate(layer){
	// go get the right array for the layer I want to interact with
	var array = getArrayForLayer(layer);
	// do the following only if the array is populated to avoid errors
	if(array.length > 0){
		for(var i = 0; i < array.length; i++){
			if (vel > 0){
				if(array[i].rotation >= 360){
					array[i].rotation = 0;
				} else {
					array[i].rotation += 5;
				}
			} else if (vel == 0){
				// array[i].rotation = 45 * (array[i].rotation % 45);
				rotation = false;
			}
		}
	}
}

function snapToStep(layer, velocity){
	makeStep(layer, velocity, false);
}	

function easeToStep(layer, velocity){
	makeStep(layer, velocity, true);
}	

function makeStep(layer, velocity, ease){
	// go get the right array for the layer I want to interact with
	var array = getArrayForLayer(layer);
	// do the following only if the array is populated to avoid errors
	if(array.length > 0 && velocity > 0){
		// go through each element in the array
		for(var i = 0; i < array.length; i++){
			// disable easing
			array[i].easing = ease;
			// pick a position where to send the object
			var xPos = positions[Math.floor((Math.random() * 7))];
			var yPos = positions[Math.floor((Math.random() * 7))];
			// check and eventually correct direction if the target is outside the defined window bounds
			var validatedDirection = new checkDirectionAndCorrect(array[i], xPos, yPos);
			// assign confirmed direction
			array[i].target.x = array[i].target.x + validatedDirection[0];
			array[i].target.y = array[i].target.y + validatedDirection[1];
			// assign target to object
			if(array[i].easing == true){
				array[i].target.x = array[i].target.x + xPos;
				array[i].target.y = array[i].target.y + yPos;
			} else if(array[i].easing == false){
				array[i].location.x = array[i].target.x;
				array[i].location.y = array[i].target.y;
			}
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

function easeToCenter(layer, velocity){
	// go get the right array for the layer I want to interact with
	var array = getArrayForLayer(layer);

	if(array.length > 0 && velocity > 0){
		for(var i = 0; i < array.length; i++){
			if(array[i].location.x == 0){
				array[i].location.x = positions[Math.floor((Math.random() * 7))];
			}
			array[i].easing = true;
			array[i].ease = velocity / 128;
			array[i].target.x = 0;
			array[i].target.y = array[i].target.y;

		}
	}
}


