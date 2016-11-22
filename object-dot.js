// Luca De Rosso
// http://www.lucaderosso.com/

// Instagram: @lucaderosso
// Twitter: @lucaderosso
// Facebook: facebook.com/derossoluca
// Pinterest: pinterest.com/lucaderosso



//———————————————————
// Variables and such 
//———————————————————

// these arrays are populated with all the Characters type that will be on stage at a given scene
var layer1 = [];
var layer2 = [];
var layer3 = [];
var layer4 = [];

var positions = [-0.25, 0, 0.25, -0.25, 0, 0.25, 0];1
// var positions = [-0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75];

var rotation = false;
var vel = 0;



//———————————
// Characters
//———————————

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
	mySketch.glpushmatrix();
	// From OpenGL Red Book:
	// If you rotate the object first and then translate it, the rotated object appears on the x-axis.
	// If you translate it down the x-axis first, and then rotate about the origin, the object is on the line y=x. 
	// In general, the order of transformations is critical.
	mySketch.gltranslate(this.location.x, this.location.y, 0);
	
	mySketch.glcolor(this.color.r, this.color.g, this.color.b, this.color.alpha);
	
	switch(this.type) {
	    case "x":
	    	mySketch.glrotate(this.rotation, 0, 0, 1);
	        mySketch.gllinewidth(3);
			mySketch.linesegment(0 - (this.size), 0 - (this.size), 0, 0 + (this.size), 0 + (this.size), 0);
			mySketch.linesegment(0 - (this.size), 0 + (this.size), 0, 0 + (this.size), 0 - (this.size), 0);	
	        break;

	    case "cyclopx":
			mySketch.shapeslice(50);
			mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.moveto(0, 0, 0); // to center the composition on x,y 0,0.
			mySketch.circle(this.size);
			mySketch.glcolor(0, 0, 0, this.color.alpha);
			mySketch.circle(this.size / 4);
			mySketch.gllinewidth(3);
			mySketch.glcolor(this.color.r, this.color.g, this.color.b, 0.3);
			mySketch.linesegment(-this.size, -this.size, 0, this.size, this.size, 0);
			mySketch.linesegment(-this.size, this.size, 0, this.size, -this.size, 0);	
	        break;

	    case "plane":
	    	mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.moveto(0, 0, 0); // to center the composition on x,y 0,0. 
			// mySketch.glscale(0.2, 1, 1);
			mySketch.plane(this.size * 0.1, this.size * 1, this.size * 0.1, this.size * 1);
	        break;

	    case "circle":
		    mySketch.shapeslice(30);
		    // remember cylinders are expensive especially with high shapeslice values
	        mySketch.cylinder(this.size * 0.75, this.size, 0, 0, 360);	
	        break;

	    case "arc":
		    mySketch.shapeslice(80);
		    mySketch.glrotate(90, 0, 0, 1);
		    mySketch.cylinder(this.size * 0.75, this.size, 0, 0, this.rotation);
	        // mySketch.framecircle(this.size);	
	        break;

	    default:
	    	// post("No type has been assigned to object");
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

// Characters.prototype.easeRotation = function(currentRot, targetRot, ease){
// 	var dRot = targetRot - currentRot;
// 	post("dRot: " + dRot + "\n");
// 	currentRot += dRot * ease;
// 	post("currentRot: " + currentRot + "\n");


// 	if(Math.abs(dRot) < 0.001) {
// 		currentRot = targetRot;
// 		return false;
// 	}

// 	return true;
// }



//————————
// METHODS
//————————

// Adding elements

function addAndPosition(layer, type, arrangement, quantity, size){

	var array = prepareArrayForLayer(layer);

	for(var i = 0; i < quantity; i++){
		
		if(arrangement == "random"){
			var xPos = positions[Math.floor((Math.random() * 7))];
			var yPos = positions[Math.floor((Math.random() * 7))];			
		}

		if(arrangement == "organized"){	
	// 		var xElements = ;
	// 		var yElements = ;

			var xElements = Math.floor(Math.sqrt(quantity));
			var yElements = Math.ceil(Math.sqrt(quantity));

	// 		// for(){
	// 		// 	// increment y
	// 		// 	for(){
	// 		// 		// increment x
	// 		// 	}
	// 		// }
		}
		addCharactersToLayer(array, xPos, yPos, size, type);		
	}

	// post(numberOfCharacters + " should be " + xElements + " x " + yElements + "\n");
	// post("\n");

	post(layer + " has: " + quantity + " charaters of " + type + " type." + "\n");
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
	post("wInc: " + wInc + "\n");
	post("hInc: " + hInc + "\n");
}



// Moving elements

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

function easeToStep(layer, velocity){
	// go get the right array for the layer I want to interact with
	var array = getArrayForLayer(layer);

	if(array.length > 0 && velocity > 0){
		for(var i = 0; i < array.length; i++){
			array[i].easing = true;
			array[i].ease = mappedVelocity(velocity);

			var xPos = positions[Math.floor((Math.random() * 7))];
			var yPos = positions[Math.floor((Math.random() * 7))];

			if(array[i].target.x + xPos < winL || array[i].target.x + xPos > winR){
				xPos = xPos * -1;
			}

			if(array[i].target.y + yPos < winB || array[i].target.y + yPos > winT){
				yPos = yPos * -1;
			}
			array[i].target.x = array[i].target.x + xPos;
			array[i].target.y = array[i].target.y + yPos;
		}
	}
}

function snapToStep(layer, velocity){
	// go get the right array for the layer I want to interact with
	var array = getArrayForLayer(layer);

	if(array.length > 0 && velocity > 0){
		for(var i = 0; i < array.length; i++){
			array[i].easing = false;

			var xPos = positions[Math.floor((Math.random() * 7))];
			var yPos = positions[Math.floor((Math.random() * 7))];

			if(array[i].target.x + xPos < winL || array[i].target.x + xPos > winR){
				xPos = xPos * -1;
			}

			if(array[i].target.y + yPos < winB || array[i].target.y + yPos > winT){
				yPos = yPos * -1;
			}

			array[i].target.x = array[i].target.x + xPos;
			array[i].target.y = array[i].target.y + yPos;
			array[i].location.x = array[i].target.x;
			array[i].location.x = array[i].target.x;
		}
	}
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


