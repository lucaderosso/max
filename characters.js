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

var decay = 15;

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

	this.location = Object.create(Vector);
	this.location.x = xPos;
	this.location.y = yPos;	
	this.targetLocation = Object.create(Vector);
	this.targetLocation.x = xPos;
	this.targetLocation.y = yPos;	

	this.rotation = 0;
	this.targetRotation = 0;

	this.size = size;
	this.targetSize = size;
	this.sizeGenesis = size;

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
	this.freq = lfoFreq();
	mySketch.glpushmatrix();
	var alpha = this.lifespan / 255.0;
	// var alpha = 255.0;
	mySketch.glcolor(this.color.r, this.color.g, this.color.b, alpha);
	mySketch.gllinewidth(4);

	switch(this.type) {
	    case "rnd:+":
	    	mySketch.gltranslate(this.location.x - increment, this.location.y, 0);
			mySketch.shapeslice(50);
			mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.moveto(increment, 0, 0);
			mySketch.circle(this.size / 2);
	        break;

	    case "rnd:-":
	    	mySketch.gltranslate(this.locationGenesis.x, this.location.y - increment, 0);
			mySketch.shapeslice(50);
			mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.moveto(0, increment, 0);
			mySketch.circle(this.size / 2);
	        break;

	    case "rnd:|":
	    	mySketch.gltranslate(this.location.x - increment, this.locationGenesis.y, 0);
			mySketch.shapeslice(50);
			mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.moveto(increment, 0, 0);
			mySketch.circle(this.size / 2);
	        break;    

	    case "hxg":
	    	mySketch.gltranslate(this.location.x, this.location.y, 0);
			mySketch.shapeslice(6);
			mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.moveto(0, 0, 0);
			mySketch.framecircle(this.size/2);
	        break;

	    case "rct":
		    mySketch.gltranslate(this.location.x, this.location.y, 0);
	    	mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.moveto(0, 0, 0); 
			// making the width 1/8th of the height
			mySketch.plane(this.size/16, this.size / 2, this.size/16, this.size / 2);
	        break;

	    case "pln":
		    var w =  Math.abs(this.boundRight - this.boundLeft) / 2;
		    var h =  Math.abs(this.boundTop - this.boundBottom) / 2;
		    mySketch.gltranslate(this.locationGenesis.x, this.locationGenesis.y, 0);
		    mySketch.moveto(0, -this.location.y, 0);
	    	mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.plane(w, this.location.y, w, this.location.y);
	        break;   
		
		case "sqr":
		    mySketch.gltranslate(this.locationGenesis.x, this.locationGenesis.y, 0);
	    	mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.moveto(0, this.locationGenesis.y, 0); 
			mySketch.plane(this.size / 2, this.size + this.location.y, this.size / 2, this.size + this.location.y);
	        break;

	    case "x--":
	    	mySketch.gltranslate(this.location.x, this.location.y, 0);
	    	mySketch.glrotate(this.rotation, 0, 0, 1);
	    	// dividing size by 2 becasue linesegments takes coordinates which would make it double the size otherwise
			mySketch.linesegment(-this.size/2, -this.size/2, 0, this.size/2, this.size/2, 0);
			mySketch.linesegment(-this.size/2, this.size/2, 0, this.size/2, -this.size/2, 0);
	        break;

	    case "rl-":
			mySketch.gltranslate(this.locationGenesis.x, this.location.y, 0);
			mySketch.linesegment(-this.size, 0, 0, this.size, 0, 0);
			mySketch.linesegment(this.size * this.location.x, this.size/8, 0, this.size * this.location.x, -this.size/8, 0);
	        break;

	    case "a_l":
	    	var w = this.boundRight - this.boundLeft;
		    mySketch.gltranslate(this.locationGenesis.x + -this.size, this.locationGenesis.y, 0);
		    // mySketch.glrotate(45, 0., 0., 1.);
		    mySketch.glscale(this.size, 0, 0);
			mySketch.linesegment(this.boundLeft, 0, 0, this.boundRight, 0, 0);
			break;

		case "v_l":
		    mySketch.gltranslate(this.location.x, 0, 0);
			mySketch.linesegment(0, this.boundBottom, 0, 0, this.boundTop, 0);
			break;	

		case "h_l":
			var w =  Math.abs(this.boundRight - this.boundLeft) / 2;
		    
		 //    mySketch.gltranslate(0, this.location.y, 0);
			// mySketch.linesegment(this.boundLeft, 0, 0, this.boundRight, 0, 0);	
			// mySketch.glrotate(this.rotation, 0, 0, 1);
		    mySketch.gltranslate(this.locationGenesis.x, this.location.y, 0);
			mySketch.glrotate(this.rotation, 0, 0, 1);
			// mySketch.moveto(w, 0, 0);
			mySketch.plane(w, 0.005, w, 0.005);	
	        break;

	    //////////////////
	    // Primadonnas? //
	    //////////////////
	    case "crc":
	    	mySketch.gltranslate(this.location.x, this.location.y, 0);
			mySketch.shapeslice(50);
			mySketch.moveto(0, 0, 0);
			mySketch.circle(this.size/2);
			mySketch.glcolor(0, 0, 0, alpha);
			mySketch.circle(this.size/4);
	        break;

	    case "pd1":
	    	mySketch.gltranslate(0, 0, 0);
			// mySketch.shapeslice(50);
			// mySketch.moveto(0, 0, 0);
			// mySketch.circle(this.size/2);
			// mySketch.glcolor(0, 0, 0, alpha);
			// mySketch.circle(this.size/4);
			// mySketch.gltranslate(this.boundLeft/2 + this.location.x, 0, 0);
			mySketch.moveto(this.boundLeft/2, 0, 0);
			mySketch.plane(this.sizeGenesis / 2, this.sizeGenesis / 2 * this.size, this.sizeGenesis / 2, this.sizeGenesis / 2 * this.size);

			mySketch.gltranslate(this.boundRight, 0, 0);
			mySketch.plane(this.sizeGenesis / 2, this.sizeGenesis / 2 * this.size, this.sizeGenesis / 2, this.sizeGenesis / 2 * this.size);
			
			mySketch.gltranslate(-this.boundRight / 2, this.boundTop / 2, 0);
			mySketch.plane(this.sizeGenesis / 2, this.sizeGenesis / 2, this.sizeGenesis / 2, this.sizeGenesis / 2);
			
			mySketch.gltranslate(0, this.boundBottom, 0);
			mySketch.plane(this.sizeGenesis / 2, this.sizeGenesis / 2, this.sizeGenesis / 2, this.sizeGenesis / 2);
	        break;

	    case "arc":
	    	mySketch.gltranslate(this.locationGenesis.x, this.locationGenesis.y, 0);
	    	mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.moveto(this.location.x, 0, 0);
			mySketch.shapeslice(60);
			mySketch.framecircle(0.25);
	    	// mySketch.cylinder(0.2, 0.3, 0., 0., 90. * this.location.x);
	    	// mySketch.cylinder(0.2, 0.3, 0., 90., 180. * this.location.x);
	    	// mySketch.cylinder(0.2, 0.3, 0., 180., 270. * this.location.x);
	    	// mySketch.cylinder(0.2, 0.3, 0., 270., 360. * this.location.x);
	    	mySketch.cylinder(0.2, 0.3 + this.location.x, 0., 0., 85.);
	    	mySketch.cylinder(0.2, 0.3, 0., 90., 175.);
	    	mySketch.cylinder(0.2, 0.3 + this.location.x, 0., 180., 265.);
	    	mySketch.cylinder(0.2, 0.3, 0., 270., 355.);
	    	break;

	    case "str":
		    mySketch.gltranslate(this.locationGenesis.x, this.locationGenesis.y, 0);
	    	mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.moveto(this.location.x, 0, 0);
			mySketch.plane(increment / 2, windowHeight/4 + this.location.x, increment / 2, windowHeight/4 + this.location.x);
			mySketch.moveto((3 * increment + (this.location.x)), 0, 0);
			mySketch.plane(increment / 2, windowHeight/4 + this.location.x, increment / 2, windowHeight/4 + this.location.x);
			mySketch.moveto((-3 * increment + (this.location.x)), 0, 0);
			mySketch.plane(increment / 2, windowHeight/4 - this.location.x, increment / 2, windowHeight/4 - this.location.x);
			mySketch.moveto((6 * increment + (this.location.x)), 0, 0);
			mySketch.plane(increment / 2, windowHeight/4 + this.location.x, increment / 2, windowHeight/4 + this.location.x);
			mySketch.moveto((-6 * increment + (this.location.x)), 0, 0);
			mySketch.plane(increment / 2, windowHeight/4 - this.location.x, increment / 2, windowHeight/4 - this.location.x);
	        mySketch.moveto(0, 0, 0);
			mySketch.linesegment(winL, 0, 0, winR, 0, 0);
	        break;

	    case "rzr":
		    mySketch.gltranslate(this.location.x, 0, 0);
			mySketch.linesegment(-0.5, -1, 0, -0.5, 1, 0);
			mySketch.moveto(-windowHeight/2, 0, 0); 
	        // mySketch.glcolor(0, 0, 0, 1);
			// mySketch.plane(windowWidth/2, windowHeight/2, windowWidth/2, windowHeight/2);

		    mySketch.gltranslate(-this.location.x, this.location.y, 0);
		    mySketch.glcolor(1, 1, 1, 1);
			mySketch.linesegment(-1, 0, 0, 1, 0, 0);
			mySketch.moveto(0, -windowHeight/2, 0); 
	        // mySketch.glcolor(0, 0, 0, 1);
			// mySketch.plane(windowWidth/2, windowHeight/2, windowWidth/2, windowHeight/2);
	        break;

	    default:
	    	// if no object type has been assigned, make a red dot in the middle of the screen 
	    	// i had something here but then removed it because it was constantly displayed... not sure why. I should check the max patch.
	}

	mySketch.glpopmatrix();
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
		this.size = Math.abs(this.easeValue(this.size, this.targetSize, this.scaling));
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
	// if(sizeMultiplier == 0){
	// 	var size = increment * size_multipliers[Math.floor((Math.random() * 4))];		
	// } else {
	// 	var size = sizeMultiplier * increment;
	// }
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

	var maxColumns = windowWidth / increment / 2;

	var colPace = (windowWidth / columns) / 2;
	var rowPace = (windowHeight / rows) / 2;
	var multiples = [1, 3, 5, 7, 9, 11, 13, 15];
	var x = 0;
	var y = 0;
	var xCoordinates = [];
	var yCoordinates = [];
	var leftBounds = [];
	var rightBounds = [];
	var bottomBounds = [];
	var topBounds = [];
	var sizeCap;
	
	if(columns > maxColumns){
		columns = maxColumns;
	}

	// this makes sure there are equal or less items than the available coordinates that will be calculated
	if(items > (columns * rows)){
		items = columns * rows;
	}

	// calculate size cap to make sure shapes don't go outside bounds
	if(rows > columns){
		// -2 to make sure eaxche grid cell had two gutters og the size if 1 increment on both side
		sizeCap = (windowHeight / rows / increment) - 2;
	} else {
		sizeCap = (windowWidth / columns / increment) - 2;
	}
	
	if(sizeCap <= 0){
		// not proud of this but: doing it to avoid having a cap of 0 which will end up assigning a value of 0 to the updatedSize
		sizeCap = 1;
	}

	// calculate x and y position for all items
	for (var f = 0; f < rows; f++) {
		// calculate vertical multiplier
		var verticalMultiplier = multiples[f];		
		y = winB + (rowPace * verticalMultiplier);
		var bottom = y - rowPace;
		var top = y + rowPace;

		for (var g = 0; g < columns; g++) {
			// calculate horizontal multiplier
			var horizontalMultiplier = multiples[g];
			x = winL + (colPace * horizontalMultiplier);
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
	
	var index = 0;
	// offset elements position in grid
	if(items < (columns * rows)){
		var totalCells = columns * rows;
		var emptyCells = totalCells - items;
		index = Math.floor((emptyCells / (Math.floor(Math.random() * 4)+1)));
	}

	// populate array with elements
	for (var i = index; i < (items + index); i++) {
		// calculate size
		if(size > 0){
			if(size > sizeCap){
				var updatedSize = sizeCap * increment;	
			} else {
				var updatedSize = size * increment;	
			}
		} else if (size == 0){
			var updatedSize = size_multipliers[Math.floor((Math.random() * 5))] * increment;
		}

		addCharactersToLayer(array, xCoordinates[i], yCoordinates[i], leftBounds[i], rightBounds[i], bottomBounds[i], topBounds[i], updatedSize, type);					
	}
}



//=====================================
//		Methods to move characters
//=====================================

// sustain: allows to maintain image on screen for as long as pad is pressed
function checkSustain(element, velocity){
	if(velocity > 0){
		element.lifespan = 255; // recover lifespan
		element.fading = false;
	} else {
		element.fading = true;
	}
}

function flip(layer, velocity){
	var array = getArrayForLayer(layer);
	// do the following only if the array is populated to avoid errors
	if(array.length > 0){ 	
		for(var i = 0; i < array.length; i++){
			// enable sustain to maintain image on screen for as long as pad is pressed
			checkSustain(layer, velocity);
			
			if (velocity > 0){
				array[i].rotation += 45;
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

// each object has its own increemnt calculated by dividing the 

function roam(layer, velocity){
	newLocationTarget(layer, velocity, true, "roam");
}

function base(layer, velocity){
	newLocationTarget(layer, velocity, true, "reset");
	newScaleTarget(layer, velocity, true, "reset");
}

function newLocationTarget(layer, velocity, easeStatus, arrangement){
	// go get the right array for the layer I want to interact with
	var array = getArrayForLayer(layer);	
	// do the following only if the array is populated to avoid errors
	if(array.length > 0){
		// go through each element in the array
		for(var i = 0; i < array.length; i++){
			// enable sustain to maintain image on screen for as long as pad is pressed
			checkSustain(array[i], velocity);
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
					case "reset":
						var locationX = -(array[i].targetLocation.x - array[i].locationGenesis.x);
						var locationY = -(array[i].targetLocation.y - array[i].locationGenesis.y);
						array[i].rotation = 0;
						array[i].targetRotation = 0;
					break;
					default:
				}
				// check bounds. this also assigns the values to the right object properites
				array[i].checkBounds(locationX, locationY);
			}
		}
	}
}

function rotate(layer, velocity){
	newRotationTarget(layer, velocity, true);
}

function newRotationTarget(layer, velocity, easeStatus){
	// go get the right array for the layer I want to interact with
	var array = getArrayForLayer(layer);
	// do the following only if the array is populated to avoid errors
	if(array.length > 0){
		// go through each element in the array
		for(var i = 0; i < array.length; i++){
			// enable sustain to maintain image on screen for as long as pad is pressed
			checkSustain(array[i], velocity);
			// here starts method's specific logic 
			if (velocity > 0){	
				// enable easing for moving
				array[i].rotating = easeStatus;
				// assign ease value
				array[i].ease = velocity / 128;
				// pick a position where to send the object
				var angle = Math.random() > 0.5 ? 45 : 90;
				
				if(array[i].type == "rnd:+" || array[i].type == "rnd:-" || array[i].type == "rnd:|"){
					var randomDirection = Math.random() > 0.5 ? 1 : -1;
				} else {
					var randomDirection = 1;
				}

				// check bounds. this also assigns the values to the right object properites
				array[i].rotation = array[i].targetRotation;
				array[i].targetRotation += angle * randomDirection;


			}
		}
	}
}

function scale(layer, velocity){
	newScaleTarget(layer, velocity, true, "scale");
}

function newScaleTarget(layer, velocity, easeStatus, arrangement){
	// go get the right array for the layer I want to interact with
	var array = getArrayForLayer(layer);
	// do the following only if the array is populated to avoid errors
	if(array.length > 0){
		// go through each element in the array
		for(var i = 0; i < array.length; i++){
			// enable sustain to maintain image on screen for as long as pad is pressed
			checkSustain(array[i], velocity);
			// here starts method's specific logic 
			if (velocity > 0){	
				// enable easing for moving
				array[i].scaling = easeStatus;
				// assign ease value
				array[i].ease = velocity / 128;
				// pick a position where to send the object
				switch (arrangement){
					case "scale":
						// var chosenValue = Math.random() < 0.5 ? -1 : 1;
						// var newSize = array[i].size + (increment * chosenValue);
						// newSize = newSize == 0 ? increment * 2 : newSize;
						var newSize = size_multipliers[Math.floor(Math.random() * 5)];
					break;
					case "reset":
						var newSize = array[i].sizeGenesis;
					break;
					default:
				}
				// check bounds. this also assigns the values to the right object properites
				array[i].targetSize = newSize;
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


function updateLifeDecay(value){		
	if(layer1.length > 0){
		for(var f = 0; f < layer1.length; f++){
			layer1[f].lifeDecay = (1 - value + 0.01) * 255;
		}
	}
	if(layer2.length > 0){
		for(var f = 0; f < layer2.length; f++){
			layer2[f].lifeDecay = (1 - value + 0.01) * 255;
		}
	}
	if(layer3.length > 0){
		for(var f = 0; f < layer3.length; f++){
			layer3[f].lifeDecay = (1 - value + 0.01) * 255;
		}
	}
	if(layer4.length > 0){
		for(var f = 0; f < layer4.length; f++){
			layer4[f].lifeDecay = (1 - value + 0.01) * 255;
		}
	}		
}