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
var size_multipliers = [0.0625, 0.125, 0.25, 0.5, 1]; // aka 1/16 1/8 1/4 1/2 1 of increment calculated in utilities.js

var decay = 255; // setting 255 (aka sudden decay) because it's my preffered starting setting

//====================================
//		Methods to manage allLayers
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

function Character(xPos, yPos, leftBound, rightBound, bottomBound, topBound, size, type){	
	this.flashing = false;
	this.fading = true; // objects are all fading by default causing lifespan to decrease and disappear from the window
	this.bouncing = false;
	this.freq = 1;

	this.moving = false;
	this.rotating = false;
	this.scaling = false;

	this.type = type;
	this.ease = 0.2;
	this.lifespan = 0;
	this.lifeDecay = 255.0;

	// the value at generation time. this value must never change so it can be used to recover the initial position or preserve the position given.
	this.locationGenesis = Object.create(Vector);
	this.locationGenesis.x = xPos;
	this.locationGenesis.y = yPos;	

	// roaming bounds
	this.boundLeft = leftBound;
	this.boundRight = rightBound;
	this.boundBottom = bottomBound;
	this.boundTop = topBound;

	this.boundsWidth = Math.abs(this.boundLeft - this.boundRight);
	this.boundsHeight = Math.abs(this.boundTop - this.boundBottom);

	this.width = (Math.abs(this.boundRight - this.boundLeft) / 2);
	this.height = (Math.abs(this.boundTop - this.boundBottom) / 2);

	this.location = Object.create(Vector);
	this.location.x = xPos;
	this.location.y = yPos;	
	this.targetLocation = Object.create(Vector);
	this.targetLocation.x = xPos;
	this.targetLocation.y = yPos;

	this.scale = Object.create(Vector);
	this.scale.x = 1;
	this.scale.y = 1;
	this.targetScale = Object.create(Vector);
	this.targetScale.x = 1;
	this.targetScale.y = 1;

	this.rotation = 0;
	this.targetRotation = 0;

	this.color = Object.create(Color);
	this.color.r = 0.9;
	this.color.g = 0.9;
	this.color.b = 0.9;
}

Character.prototype.display = function(){
	// REMEMBER — From OpenGL Red Book:
	// If you rotate the object first and then translate it, the rotated object appears on the x-axis.
	// If you translate it down the x-axis first, and then rotate about the origin, the object is on the line y=x. 
	// In general, the order of transformations is critical.
	// Also:
	// mySketch.moveto(0, 0, 0); is used below to center the composition on x,y 0,0.
	this.freq = lfoFreq();
	var alpha = this.lifespan / 255.0;
	// var alpha = 255.0;
	mySketch.glcolor(this.color.r, this.color.g, this.color.b, alpha);
	mySketch.gllinewidth(4);

	switch(this.type) {
		// for objects to do something when any pad is pushed they need to include:
		// this.scale.x
		// this.scale.y
		// this.location.x
		// this.location.y
		// this.rotation

		case "sqr": 
			//plane centered scaling both directions
		    mySketch.glpushmatrix();
		    mySketch.gltranslate(this.locationGenesis.x, this.location.y, 0);
	    	mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.moveto(0, 0, 0);
			mySketch.glscale(this.scale.x, this.scale.y, 1);
			mySketch.plane(this.width, this.height);
        	mySketch.glpopmatrix();
        break;

        case "kld":
        	// this is and insane kaleidoscopic one.
        	// when many elements are displayed, they ovelrap in nice composition every 360 degrees.
        	mySketch.glpushmatrix();
        	mySketch.gltranslate(this.location.x, this.location.y, 0);
	    	mySketch.moveto(this.boundLeft + this.width, this.boundBottom + this.height, 0);
	    	mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.glscale(this.scale.x, this.scale.y, 1);
			mySketch.plane(this.width, this.height);
        	mySketch.glpopmatrix();
        break;

	    case "pln":
	    	// creates bars where the bottom side is fixed and the top one scales
		    mySketch.glpushmatrix();
		    mySketch.gltranslate(this.location.x, (this.location.y + (this.scale.y * this.height) - this.height), 0); // position shape at location
			mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.plane(this.width, this.height * this.scale.y); // putting scale.y here to avoid using glscale
        	mySketch.glpopmatrix();
        break;

        case "dtt":
        	mySketch.glpushmatrix();
        	mySketch.glenable("line_stipple"), 
        	mySketch.gllinestipple(1, 32639); // 0011111100111111 - 0111111101111111
		    mySketch.gltranslate(this.location.x, (this.location.y + (this.scale.y * this.height) - this.height), 0); // position shape at location
	    	mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.glscale(this.scale.x, this.scale.y, 1.);
			mySketch.framequad(this.width, this.height, 0, this.width, -this.height, 0, -this.width, -this.height, 0, -this.width, this.height, 0);
	    	// mySketch.moveto(this.location.x, (this.location.y + (this.scale.y * this.height) - this.height), 0);
	    	mySketch.glpopmatrix();
	    	mySketch.glpushmatrix();
	    	// mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.gltranslate(this.location.x, (this.location.y + (this.scale.y * this.height) - this.height), 0); // position shape at location
			mySketch.circle(0.01);
			mySketch.glpopmatrix();
        break;

        case "rtt": // old rect
	        mySketch.glpushmatrix();
		    mySketch.gltranslate(this.location.x, this.location.y, 0);
	    	mySketch.glrotate(this.rotation/2, 0, 0, 1);
			mySketch.glscale(this.scale.x * 4, 1, 1);
			// making the width 1/8th of the height
			mySketch.plane(this.width/4, this.height);
        	mySketch.glpopmatrix();
        break;

        case "sq_":
        	// to fix
        	mySketch.glpushmatrix();
			mySketch.glscale(this.scale.x, this.scale.y, 1);
		    mySketch.glrotate(this.rotation, 0, 0, 1);
		    mySketch.gltranslate(this.location.x, this.location.y, 0);
			mySketch.moveto(0, 0, 0); 
			mySketch.plane(this.width, this.height);
       		mySketch.glpopmatrix();
        break;

        case "seg":
        	mySketch.glpushmatrix();
			mySketch.glscale(this.scale.x, 1, 1);
			mySketch.glrotate(this.rotation, 0, 0, -1);
			mySketch.linesegment(this.location.x - this.width, this.location.y, 0, this.location.x + this.width, this.location.y, 0);
        	mySketch.glpopmatrix();
        break;

        case "dsg":
        	// dsg aka double segment: similar to segment but it creates nice 45degrees compositions when rotating
			mySketch.glpushmatrix();
			mySketch.glrotate(this.rotation/2, 0, 0, 1);
			mySketch.glscale(this.scale.x, 1, 1);
			mySketch.linesegment(this.location.x - this.width, this.location.y, 0, this.location.x + this.width, this.location.y, 0);
			mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.linesegment(this.location.x - this.width, this.location.y, 0, this.location.x + this.width, this.location.y, 0);
        	mySketch.glpopmatrix();
        break;

	  //   case "rnd":
	  //   	mySketch.gltranslate(this.location.x - increment, this.location.y, 0);
			// mySketch.shapeslice(50);
			// mySketch.glrotate(this.rotation, 0, 0, 1);
			// mySketch.moveto(increment, 0, 0);
			// mySketch.circle(this.size / 2);
	  //       break;

	  //   case "rnd:-":
	  //   	mySketch.gltranslate(this.locationGenesis.x, this.location.y - increment, 0);
			// mySketch.shapeslice(50);
			// mySketch.glrotate(this.rotation, 0, 0, 1);
			// mySketch.moveto(0, increment, 0);
			// mySketch.circle(this.size / 2);
	  //       break;

	  //   case "rnd:|":
	  //   	mySketch.gltranslate(this.location.x - increment, this.locationGenesis.y, 0);
			// mySketch.shapeslice(50);
			// mySketch.glrotate(this.rotation, 0, 0, 1);
			// mySketch.moveto(increment, 0, 0);
			// mySketch.circle(this.size / 2);
	  //       break;

		

	    case "pin":
	    	mySketch.glpushmatrix();
			mySketch.linesegment(this.locationGenesis.x, this.boundTop, 0, this.location.x, this.location.y, 0);
			// mySketch.linesegment(this.locationGenesis.x, this.boundTop, 0, -1 * this.location.x, -1 * this.location.y, 0);
   		    // mySketch.gltranslate(this.location.x, this.location.y, 0);
   		    // mySketch.moveto(this.location.x, this.location.y, 0); 	
			mySketch.glscale(this.scale.x, this.scale.y, 1);
			mySketch.gltranslate(this.locationGenesis.x, this.locationGenesis.y, 0);
			mySketch.shapeslice(4); 
	        mySketch.circle(0.1);
	        mySketch.glpopmatrix();
        break;

	    case "x--":
	    	mySketch.glpushmatrix();
	    	mySketch.gltranslate(this.location.x, this.location.y, 0);
	    	mySketch.glrotate(this.rotation, 0, 0, 1);
	    	// dividing size by 2 becasue linesegments takes coordinates which would make it double the size otherwise
			mySketch.linesegment(-this.size/2, -this.size/2, 0, this.size/2, this.size/2, 0);
			mySketch.linesegment(-this.size/2, this.size/2, 0, this.size/2, -this.size/2, 0);
        	mySketch.glpopmatrix();
        break;

	    case "rl-":
	    	mySketch.glpushmatrix();
			mySketch.gltranslate(this.locationGenesis.x, this.location.y, 0);
	    	mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.linesegment(-this.size, 0, 0, this.size, 0, 0);
			mySketch.linesegment(this.location.x, this.size/8, 0, this.location.x, -this.size/8, 0);
        	mySketch.glpopmatrix();
        break;

	    case "a_l":
	    	mySketch.glpushmatrix();
	    	var w = this.boundRight - this.boundLeft;
		    mySketch.gltranslate(this.locationGenesis.x + -this.size, this.locationGenesis.y, 0);
		    // mySketch.glrotate(45, 0., 0., 1.);
		    mySketch.glscale(this.size, 0, 0);
			mySketch.linesegment(this.boundLeft, 0, 0, this.boundRight, 0, 0);
			mySketch.glpopmatrix();
		break;

		case "v_l":
			mySketch.glpushmatrix();
		    mySketch.gltranslate(this.location.x, 0, 0);
			mySketch.linesegment(0, this.boundBottom, 0, 0, this.boundTop, 0);
			mySketch.glpopmatrix();
		break;	

		case "h_l":
			mySketch.glpushmatrix();
			var w =  Math.abs(this.boundRight - this.boundLeft) / 2;
		    
		 //    mySketch.gltranslate(0, this.location.y, 0);
			// mySketch.linesegment(this.boundLeft, 0, 0, this.boundRight, 0, 0);	
			// mySketch.glrotate(this.rotation, 0, 0, 1);
		    mySketch.gltranslate(this.locationGenesis.x, this.location.y, 0);
			mySketch.glrotate(this.rotation/2, 0, 0, 1);
			// mySketch.moveto(w, 0, 0);
			mySketch.plane(w, 0.005, w, 0.005);	
			mySketch.glpopmatrix();
	        break;

	    default:
	    	// if no object type has been assigned, make a red dot in the middle of the screen 
	    	// i had something here but then removed it because it was constantly displayed... not sure why. I should check the max patch.
	}

	mySketch.glflush(); // you starte testing glflus on jan 14, 2017 to see if it would increase performance.
}

Character.prototype.update = function(){	
	if(this.moving){
		this.location.x = this.easeValue(this.location.x, this.targetLocation.x, this.moving);
		this.location.y = this.easeValue(this.location.y, this.targetLocation.y, this.moving);		
	}

	if(this.rotating){
		this.rotation = this.easeValue(this.rotation, this.targetRotation, this.rotating);
	}

	if(this.scaling){
		this.scale.x = Math.abs(this.easeValue(this.scale.x, this.targetScale.x, this.scaling));
		this.scale.y = Math.abs(this.easeValue(this.scale.y, this.targetScale.y, this.scaling));
	}

	if(this.flashing){
		this.flash();		
	}

	if(this.bouncing){
		this.bounce();
	}

	if(this.fading){
		this.lifespan -= this.lifeDecay;
	}
}

Character.prototype.run = function(){
	this.update();
	this.display();
}

Character.prototype.easeValue = function(start, end, easing){
	// similar curve to a easeOutExpo	
	var result = start + ((end - start) * this.ease);
	if(Math.abs(end - start) < 0.0001) {
		result = end;
		type = false;
	}
	return result;
}

Character.prototype.checkBounds = function(xStep, yStep){
	var x = xStep;
	var y = yStep;

	if(this.targetLocation.x + x < this.boundLeft || this.targetLocation.x + x > this.boundRight){
		x = x * -1;
	}
	if(this.targetLocation.y + y < this.boundBottom || this.targetLocation.y + y > this.boundTop){
		y = y * -1;
	}
	// make the object jump to the previously established targetLocation
	// in this way the next  move will be within the defined grid's increment			
	this.location.x = this.targetLocation.x;
	this.location.y = this.targetLocation.y;
	// update targetLocation to ease to	
	this.targetLocation.x = this.targetLocation.x + x;
	this.targetLocation.y = this.targetLocation.y + y;
}

Character.prototype.flash = function(){
	if((clock % 2) == 0){
		this.lifespan = 255;
	} else {
		this.lifespan = 0;
	}
}

var testinc = 0.2

Character.prototype.bounce = function(){
	// post("testinc: " + testinc + "\n");
	// post("this.location.y: " + this.location.y + "\n");
	if(clock % this.freq == 0){
		this.location.y = this.location.y + testinc;	
		testinc = testinc * -1;
	}
}



//====================================
//		Methods to add characters
//====================================

function addCharactersToLayer(layer, x, y, leftBound, rightBound, bottomBound, topBound, size, t){
	// given that having a size of zero would make the shape invisible and therefore resul useless, I'm using 0 to enable randomization of size
	layer.push(new Character(x, y, leftBound, rightBound, bottomBound, topBound, size, t));
}

function checkColumns(columns, rows){
	// a method to check that the numbers of columns and rows in the grid is never greater than the one allowed: verticalSubdivision / 2 
	var newColumns = columns;
	var newRows = rows;
	if(columns > (verticalSubdivision / 2)){
		newColumns = verticalSubdivision / 2;
	}
	if(rows > ((windowHeight / increment) / 2)){
		newRows = (windowHeight / increment) / 2;
	}
	return [newColumns, newRows];
}

function genesis(layer, items, type, size, gridColumns, gridRows){
	var array = prepareArrayForLayer(layer);
	
	var columnsAndRows = checkColumns(gridColumns, gridRows);
	var columns = columnsAndRows[0];
	var rows = columnsAndRows[1];
	var totalCells = columns * rows;

	// var maxColumns = windowWidth / increment / 2;

	var colPace = (windowWidth / columns) / 2;
	var rowPace = (windowHeight / rows) / 2;
	var multiples = [1, 3, 5, 7, 9, 11, 13, 15];

	var xCoordinates = [];
	var yCoordinates = [];
	var leftBounds = [];
	var rightBounds = [];
	var bottomBounds = [];
	var topBounds = [];

	var cellsIndex = 0; // defines the starting cell in polulating a grid (eg: grid 2coll 2rows cellsIndex = 1, first element will be in the second cell - bottom right)

	// if(columns > maxColumns){
	// 	columns = maxColumns;
	// }

	// calculate x and y position for all items
	for (var f = 0; f < rows; f++) {
		// calculate vertical multiplier
		var verticalMultiplier = multiples[f];		
		var y = winB + (rowPace * verticalMultiplier);
		var bottom = y - rowPace;
		var top = y + rowPace;

		for (var g = 0; g < columns; g++) {
			// calculate horizontal multiplier
			var horizontalMultiplier = multiples[g];
			var x = winL + (colPace * horizontalMultiplier);
			var left = x - colPace;
			var right = x + colPace;	
			// populate the arrays with all the coordinates calculated
			yCoordinates.push(y);
			xCoordinates.push(x);
			// populate the arrays with all the coordinates to define the roaming areas
			leftBounds.push(left);
			rightBounds.push(right);
			bottomBounds.push(bottom);
			topBounds.push(top);
		}
	}
	
	// check if there is extra room in the grid
	if(items < totalCells && items > 1){
		// calculate extra room
		var emptyCells = totalCells - items;
		// calculate new starting index do that there will be n even number of empty cells at the beginnin and end of the grid
		cellsIndex = emptyCells / 2;
	}

	// populate array with elements
	for (var i = cellsIndex; i < (items + cellsIndex); i++) {
		addCharactersToLayer(array, xCoordinates[i], yCoordinates[i], leftBounds[i], rightBounds[i], bottomBounds[i], topBounds[i], size, type);					
	}
}



//=====================================
//		Methods to move characters
//=====================================

// sustain: allows to maintain image on screen for as long as pad is pressed
function checkSustain(layer, velocity){
	updateSustainForLayer(layer, velocity);
	// go get the right array for the layer I want to interact with
	var array = getArrayForLayer(layer);	
	// do the following only if the array is populated to avoid errors
	if(array.length > 0){
		// go through each element in the array
		for(var i = 0; i < array.length; i++){
			if(velocity > 0){
				array[i].lifespan = 255; // recover lifespan
				array[i].fading = false;
			} else {
				array[i].fading = true;
			}
		}
	}
}

function bounce(layer, velocity){
	var array = getArrayForLayer(layer);
	// do the following only if the array is populated to avoid errors
	if(array.length > 0){
		for(var i = 0; i < array.length; i++){
			// enable sustain to maintain image on screen for as long as pad is pressed
			checkSustain(layer, velocity);

			if(velocity > 0){
				// array[i].freq = lfoFreq();
				array[i].easing = false
				array[i].bouncing = true;
			} else if (velocity == 0) {
				array[i].bouncing = false;
			}
		}
	}
}

function newLocationTarget(layer, velocity, easeStatus, arrangement){
	// go get the right array for the layer I want to interact with
	var array = getArrayForLayer(layer);	

	updateSustainForLayer(array, velocity);
	// do the following only if the array is populated to avoid errors
	if(array.length > 0){
		// go through each element in the array
		for(var i = 0; i < array.length; i++){
			// here starts method's specific logic 
			if (velocity > 0){	
				// enable easing for moving
				array[i].moving = easeStatus;
				// assign ease value
				array[i].ease = velocity / 128;
				// pick a position where to send the object
				switch (arrangement){
					case "roam":
						var locationX = positions[Math.floor((Math.random() * 2))];
						var locationY = positions[Math.floor((Math.random() * 2))];
					break;
					case "vertical":
						var locationX = 0;
						var locationY = positions[Math.floor((Math.random() * 2))];
					break;
					case "horizontal":
						var locationX = positions[Math.floor((Math.random() * 2))];
						var locationY = 0;
					break;
					case "reset":
						var locationX = -(array[i].targetLocation.x - array[i].locationGenesis.x);
						var locationY = -(array[i].targetLocation.y - array[i].locationGenesis.y);
						array[i].rotation = 0;
						array[i].targetRotation = 0;
						array[i].scale.x = 1;
						array[i].scale.y = 1;
						array[i].targetScale.x = 1;
						array[i].targetScale.y = 1;
						// array[i].targetSize = array[i].sizeGenesis;
					break;
					default:
				}
				// check bounds. this also assigns the values to the right object properites
				array[i].checkBounds(locationX, locationY);
			}
		}
	}
}

function newRotationTarget(layer, velocity, easeStatus){
	// go get the right array for the layer I want to interact with
	var array = getArrayForLayer(layer);
	// do the following only if the array is populated to avoid errors
	if(array.length > 0){
		// go through each element in the array
		for(var i = 0; i < array.length; i++){
			// here starts method's specific logic 
			if (velocity > 0){	
				// enable easing for moving
				array[i].rotating = easeStatus;
				// assign ease value
				array[i].ease = velocity / 128;
				// pick a position where to send the object
				// var angle = Math.random() > 0.5 ? 45 : 90;
				
				if(array[i].type == "rnd:+" || array[i].type == "rnd:-" || array[i].type == "rnd:|"){
					var randomDirection = Math.random() > 0.5 ? 1 : -1;
				} else {
					var randomDirection = 1;
				}

				// check bounds. this also assigns the values to the right object properites
				array[i].rotation = array[i].targetRotation;
				// array[i].targetRotation += angle * randomDirection;
				array[i].targetRotation += 90 * randomDirection;


			}
		}
	}
}

function newScaleTarget(layer, velocity, easeStatus, arrangement){
	// go get the right array for the layer I want to interact with
	var array = getArrayForLayer(layer);
	// do the following only if the array is populated to avoid errors
	if(array.length > 0){
		// go through each element in the array
		for(var i = 0; i < array.length; i++){
			// here starts method's specific logic 
			if (velocity > 0){	
				// enable easing for moving
				array[i].scaling = easeStatus;
				// assign ease value
				array[i].ease = velocity / 128;
				// pick a position where to send the object
				switch (arrangement){
					case "random":
						var scaleWidthRange = array[i].boundsWidth / increment;
						var scaleHeightRange = array[i].boundsHeight / increment;
						// here I'm forcing scale factors to scale the shape so it's always an even multiple of increment
						// this of course creates issues when the bound width or height are only divisible by 2 increments 
						var newWidthScale = (Math.ceil( Math.random() * scaleWidthRange / 2 ) * 2) / scaleWidthRange;
						var newHeightScale = (Math.ceil( Math.random() * scaleHeightRange / 2 ) * 2) / scaleHeightRange;
					break;
					default:
				}
				// check bounds. this also assigns the values to the right object properites
				array[i].targetScale.x = newWidthScale;
				array[i].targetScale.y = newHeightScale;
			}
		}
	}
}

function flash(layer, velocity){
	var array = getArrayForLayer(layer);
	// do the following only if the array is populated to avoid errors
	if(array.length > 0){
		for(var i = 0; i < array.length; i++){
			if(velocity > 0){
				array[i].flashing = true;
			} else {
				array[i].flashing = false;
				array[i].lifespan = 255; // restore lifespan which will then fade in Character.prototype.display()
			}
		}
	}
}

function updateLifeDecay(value){		
	if(layer1.length > 0){
		for(var f = 0; f < layer1.length; f++){
			layer1[f].lifeDecay = (1 - value) * 255;
		}
	}
	if(layer2.length > 0){
		for(var f = 0; f < layer2.length; f++){
			layer2[f].lifeDecay = (1 - value) * 255;
		}
	}
	if(layer3.length > 0){
		for(var f = 0; f < layer3.length; f++){
			layer3[f].lifeDecay = (1 - value) * 255;
		}
	}
	if(layer4.length > 0){
		for(var f = 0; f < layer4.length; f++){
			layer4[f].lifeDecay = (1 - value) * 255;
		}
	}		
}

function callAction(family, type, layer, velocity){
	// create action name concatenating family and type
	var action = family.concat(type);

	switch (action){
		case "resetAll":
			newLocationTarget(layer, velocity, true, "reset");
			// newSizeTarget(layer, velocity, true, "reset");
		break;
		case "translateBoth":
			newLocationTarget(layer, velocity, true, "roam");
		break;
		// case "translateVertical":
		// 	newLocationTarget(layer, velocity, true, "vertical");
		// break;
		// case "translateHorizontal":
		// 	newLocationTarget(layer, velocity, true, "horizontal");
		// break;
		case "rotateRandom":
			newRotationTarget(layer, velocity, true);
		break;
		case "scaleBoth":
			// newSizeTarget(layer, velocity, true, "scale");
			newScaleTarget(layer, velocity, true, "random");

		break;
	}
}
