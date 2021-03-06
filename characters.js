// Luca De Rosso
// http://www.lucaderosso.com/

// Instagram: @lucaderosso
// Twitter: @lucaderosso
// Facebook: facebook.com/derossoluca
// Pinterest: pinterest.com/lucaderosso
// Github:

// NOTES:
// Velocity is used in two ways:
// 1 - to enable events throug conditionals. If Velocity is greater than 0 the method is executed
// 2 - to create variation on the method that is being called. i.e.: different values can make things move faster or slower

//==================
//		General
//==================

var positions = [-increment, increment];

var decay = 255; // setting 255 (aka sudden decay) because it's my preffered starting setting

//====================================
//		Methods to manage allLayers
//====================================

function prepareArrayForLayer(layer){	
	var array = [];
	
	switch(layer){
		case "layer1":
			layer1.elements.length = 0;
			array = layer1.elements;
		break;
		case "layer2":
			layer2.elements.length = 0;
			array = layer2.elements;
		break;
		case "layer3":
			layer3.elements.length = 0;
			array = layer3.elements;
		break;
		case "layer4":
			layer4.elements.length = 0;
			array = layer4.elements;
		break;
	    default:
	}

	return array
}

function getArrayForLayer(layer){	
	var array = [];
	switch(layer){
		case "layer1":
			array = layer1.elements;
		break;
		case "layer2":
			array = layer2.elements;
		break;
		case "layer3":
			array = layer3.elements;
		break;
		case "layer4":
			array = layer4.elements;
		break;
	    default:
	}
	return array
}



//===========================
//		Character Object
//===========================

function Character(xPos, yPos, leftBound, rightBound, bottomBound, topBound, type){	
	this.flashing = false;
	this.fading = true; // objects are all fading by default causing lifespan to decrease and disappear from the window
	this.bouncing = false;
	this.freq = 1;

	this.moving = false;
	this.rotating = false;
	this.scaling = false;

	this.type = type;
	this.ease = 1;
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
	this.rotationDirection = Math.random() > 0.5 ? 1 : -1;
	this.targetRotation = 0;

	this.color = Object.create(colorWhite);
}

Character.prototype.display = function(){
	// REMEMBER — From OpenGL Red Book:
	// If you rotate the object first and then translate it, the rotated object appears on the x-axis.
	// If you translate it down the x-axis first, and then rotate about the origin, the object is on the line y=x. 
	// In general, the order of transformations is critical.
	// Also:
	// mySketch.moveto(0, 0, 0); is used below to center the composition on x,y 0,0.

	var alpha = this.lifespan / 255.0;
	mySketch.glcolor(this.color.r, this.color.g, this.color.b, alpha);
	mySketch.gllinewidth(4);

	switch(this.type) {
		// for objects to do something when any pad is pushed they need to include:
		// this.scale.x
		// this.scale.y
		// this.location.x
		// this.location.y
		// this.rotation

		// Notes on commands:
		// - moveto(): if you don't want to use it to actually move objects, then add it to the shape and set it to 0,0,0 to restore the coordinate other shapes might have assigned 

		//–––––––––––-
		// Cube based
		//––––––––––-–

        case "CUB_00A": 
			//plane centered scaling both directions
		    mySketch.glpushmatrix();
		    mySketch.shapeorient(0, 0, 0);
		    mySketch.gltranslate(this.locationGenesis.x, this.location.y, 0);
	    	mySketch.moveto(0, 0, 0);
	    	mySketch.glrotate(this.rotation, 0, 1, 0);
			mySketch.glscale(1, this.scale.y, 1);
			mySketch.cube(this.width, this.height, 0.01);
        	mySketch.glpopmatrix();
        break;

        case "CUB_00B":
	    	// creates bars where the bottom side is fixed and the top one scales
		    mySketch.glpushmatrix();
		    mySketch.shapeorient(0, 0, 0);
		    mySketch.gltranslate(this.locationGenesis.x, (this.location.y + (this.scale.y * this.height) - this.height), 0); // position shape at location
			mySketch.moveto(0, 0, 0);
			mySketch.glrotate(this.rotation, 0, 1, 0);
			//
			mySketch.gldisable("line_stipple");
			//
			mySketch.cube(this.width, this.height * this.scale.y, 0.01); // putting scale.y here to avoid using glscale
        	mySketch.glpopmatrix();
        break;

        case "CUB_10A": 
			//plane centered scaling both directions
		    mySketch.glpushmatrix();
		    mySketch.shapeorient(0, 0, 0);
		    mySketch.gltranslate(this.locationGenesis.x, this.location.y, 0);
	    	mySketch.moveto(0, 0, 0);
	    	mySketch.glrotate(this.rotation + 45, 0, 1, 0);
			mySketch.glscale(1, this.scale.y, 1);
			//
			mySketch.shapeslice(2, 1);
			mySketch.shapeprim("lines");
			mySketch.gllinewidth(2);
			//
			mySketch.cube(this.width, this.height, 0.01);
        	mySketch.glpopmatrix();
        break;

		//––––––––––––-
		// Plane based
		//–––––––––––-–

		// how to name

		// first letters
		// 	PLN = plane
		// 	CUB = cube
		// 	HLN = horizontal line
		// 	VLN = vertical line

		// first digit
		// 	0 = solid
		// 	1 = lines
		// 	2 = dots
		// 	3 = lines and dots
		
		// second digit
		// 	0 = no line_stipple
		// 	1 = line_stipple
		//  2 = both styles
		case "PLN____":
			mySketch.glpushmatrix();
			mySketch.shapeorient(0, 0, 0);
			mySketch.gltranslate(this.location.x, this.locationGenesis.y, 0);
			mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.moveto(0, 0, 0);
			//
			mySketch.shapeslice(6);
			mySketch.framequad(this.locationGenesis.x + 0.015, this.locationGenesis.y + 0.015, 0, this.locationGenesis.x + 0.015, this.locationGenesis.y - 0.015, 0, this.locationGenesis.x - 0.015, this.locationGenesis.y, - 0.015, 0, this.locationGenesis.x - 0.015, this.locationGenesis.y + 0.015, 0);
	        mySketch.glpopmatrix();
        break;

        case "PLN_00A":
		    mySketch.glpushmatrix();
		    mySketch.shapeorient(0, 0, 0);
		    mySketch.gltranslate(this.locationGenesis.x, (this.location.y + (this.scale.y * this.height) - this.height), 0); // position shape at location
			mySketch.moveto(0, 0, 0);
			mySketch.glrotate(this.rotation, 0, 0, 1);
			//
			mySketch.gldisable("line_stipple");
			//
			mySketch.plane(this.width, this.height * this.scale.y); // putting scale.y here to avoid using glscale
        	mySketch.glpopmatrix();
        break;

        case "PLN_10A":
		    mySketch.glpushmatrix();
		    mySketch.shapeorient(0, 0, 0);
		    mySketch.gltranslate(this.locationGenesis.x, (this.location.y + (this.scale.y * this.height) - this.height), 0); // position shape at location
			mySketch.moveto(0, 0, 0);
			mySketch.glrotate(this.rotation, 0, 0, 1);
			//
			mySketch.gldisable("line_stipple");
			mySketch.shapeprim("lines");
			mySketch.shapeslice(8, 1);
			mySketch.gllinewidth(20);
			mySketch.glpointsize(10);
			//
			mySketch.plane(this.width, this.height * this.scale.y); // putting scale.y here to avoid using glscale
        	mySketch.glpopmatrix();
        break;

        case "PLN_12A":
		    mySketch.glpushmatrix();
		    mySketch.shapeorient(0, 0, 0);
		    mySketch.gltranslate(this.locationGenesis.x, this.locationGenesis.y, 0); // position shape at location
			mySketch.moveto(0, 0, 0);
			mySketch.glrotate(this.rotation, 0, 0, 1);
			//
			mySketch.shapeprim("lines");
			mySketch.shapeslice(4, 1);
			mySketch.gldisable("line_stipple");
			mySketch.gllinestipple(1, 255);
			mySketch.gllinewidth(10);
			mySketch.glpointsize(10);
			mySketch.plane(this.width, this.height * this.scale.y); // putting scale.y here to avoid using glscale
        	//
        	mySketch.glenable("line_stipple");
			mySketch.gllinestipple(1, 3855);
			mySketch.gllinewidth(2);
			mySketch.gllinewidth(2);
			//
			mySketch.plane(this.width, this.height); // putting scale.y here to avoid using glscale
        	mySketch.glpopmatrix();
        break;

        case "PLN_12B":
		    mySketch.glpushmatrix();
		    mySketch.shapeorient(0, 0, 0);
		    mySketch.gltranslate(this.locationGenesis.x, this.locationGenesis.y, 0); // position shape at location
			mySketch.moveto(0, 0, 0);
			mySketch.glrotate(this.rotation, 0, 0, 1);
			//
			mySketch.shapeprim("lines");
			mySketch.shapeslice(3, 1);
			mySketch.gldisable("line_stipple");
			mySketch.gllinestipple(1, 255);
			mySketch.gllinewidth(30);
			mySketch.glpointsize(10);
			mySketch.plane(this.width - increment, (this.height - increment) * this.scale.y); // putting scale.y here to avoid using glscale
        	//
   //      	mySketch.glenable("line_stipple");
			// mySketch.gllinestipple(1, 3855);
			// mySketch.gllinewidth(2);
			// mySketch.gllinewidth(30);
			mySketch.glenable("line_stipple");
			mySketch.gllinestipple(1, 128);

			mySketch.glcolor(0, 0, 0, alpha / 8);
			mySketch.plane(this.width - increment, (this.height - increment) * this.scale.y); // putting scale.y here to avoid using glscale
			// mySketch.gllinewidth(2);
			//
			mySketch.glcolor(this.color.r, this.color.g, this.color.b, alpha / 8);
			mySketch.plane(this.width - increment, this.height - increment); // putting scale.y here to avoid using glscale
        	mySketch.glpopmatrix();
        break;

        case "PLN_12C":
		    mySketch.glpushmatrix();
		    mySketch.shapeorient(0, 0, 0);
		    mySketch.gltranslate(this.locationGenesis.x, this.location.y, 0); // position shape at location
			mySketch.moveto(0, 0, 0);
			mySketch.glrotate(this.rotation, 0, 0, 1);
			//
			mySketch.shapeprim("lines");
			mySketch.shapeslice(3, 1);
			mySketch.gldisable("line_stipple");
			mySketch.gllinestipple(1, 255);
			mySketch.gllinewidth(30);
			mySketch.glpointsize(10);
			mySketch.plane(this.width - increment, (this.height / 8) * this.scale.y); // putting scale.y here to avoid using glscale
        	mySketch.glpopmatrix();

        	mySketch.glpushmatrix();
        	mySketch.gltranslate(this.locationGenesis.x, this.locationGenesis.y, 0);
			mySketch.glenable("line_stipple");
			mySketch.gllinestipple(1, 128);
			// mySketch.gllinewidth(2);
			//
			mySketch.moveto(0, 0, 0);
			mySketch.glcolor(this.color.r, this.color.g, this.color.b, alpha / 4);
			mySketch.plane(this.width - increment, this.height - increment); // putting scale.y here to avoid using glscale
        	mySketch.glpopmatrix();
        break;

   		case "PLN_20A":
		    mySketch.glpushmatrix();
		    mySketch.shapeorient(0, 0, 0);
		    mySketch.gltranslate(this.location.x, (this.location.y + (this.scale.y * this.height) - this.height), 0); // position shape at location
			mySketch.moveto(0, 0, 0);
			mySketch.glrotate(this.rotation, 0, 0, 1);
			//
			mySketch.gldisable("line_stipple");
			mySketch.shapeprim("points");
			mySketch.shapeslice(1, 1);
			mySketch.glpointsize(10);
			//
			mySketch.plane(this.width, this.height * this.scale.y); // putting scale.y here to avoid using glscale
        	mySketch.glpopmatrix();
        break;

        case "PLN_32A":
		    mySketch.glpushmatrix();
		    mySketch.shapeorient(0, 0, 0);
		    mySketch.gltranslate(this.locationGenesis.x, this.locationGenesis.y, 0); // position shape at location
			mySketch.moveto(0, 0, 0);
			mySketch.glrotate(this.rotation, 1, 0, 0);
			//
			mySketch.shapeprim("lines");
			mySketch.shapeslice(4, 1);
			mySketch.gldisable("line_stipple");
			mySketch.gllinestipple(1, 255);
			mySketch.gllinewidth(10);
			mySketch.glpointsize(10);
			//
			mySketch.plane(this.width, this.height * this.scale.y); // putting scale.y here to avoid using glscale
        	//
        	mySketch.glenable("line_stipple");
			mySketch.gllinestipple(1, 3855);
			mySketch.gllinewidth(2);
			//
			mySketch.glcolor(0, 0, 0, 1);
			mySketch.shapeprim("points");
			mySketch.shapeslice(4, 16);
			mySketch.plane(this.width, this.height); // putting scale.y here to avoid using glscale
        	mySketch.glpopmatrix();
        break;

       	//–––––––––––-
		// Line based
		//––––––––––-–

        case "HLN_00A":
        	mySketch.glpushmatrix();
        	mySketch.shapeorient(0, 0, 0);
        	mySketch.gltranslate(this.location.x, this.location.y * (1 - (high * dial1)), 0); // position shape at location
			mySketch.moveto(this.location.x - this.width, this.location.y, 0);
			mySketch.glrotate(this.rotation, 0, 0, -1);
			mySketch.glscale(this.scale.x, 1, 1);
			//
			mySketch.gldisable("line_stipple");
			//
			mySketch.lineto(this.location.x + this.width, this.location.y * (1 - (high * dial1)), 0);
        	mySketch.glpopmatrix();
        break;

        case "HLN_00B":
        	mySketch.glpushmatrix();
        	mySketch.shapeorient(0, 0, 0);
        	mySketch.gltranslate(this.location.x, this.location.y * (1 - (high * dial1)), 0); // position shape at location
			mySketch.moveto(this.location.x - this.width, this.location.y, 0);
			mySketch.glrotate(this.rotation, 0, 0, -1);
			mySketch.glscale(this.scale.x, 1, 1);
			//
			mySketch.gldisable("line_stipple");
			//
			mySketch.lineto(this.location.x + this.width, this.location.y * (1 - (high * dial1)), 0);
			mySketch.moveto((this.location.x + this.width)* (1 - (high * dial1)), (this.location.y + increment), 0);
			mySketch.lineto(this.location.x + this.width, (this.location.y + increment) * (1 - (high * dial1)), 0);
        	mySketch.glpopmatrix();
        break;

        case "HLN_00C":
        	// dsg aka double segment: similar to segment but it creates nice 45degrees compositions when rotating
			mySketch.glpushmatrix();
			mySketch.shapeorient(0, 0, 0);
			mySketch.glrotate(this.rotation/2, 0, 0, 1);
			mySketch.glscale(this.scale.x, 1, 1);
			mySketch.move(0, 0, 0);
			mySketch.linesegment(this.location.x - this.width, this.location.y, 0, this.location.x + this.width, this.location.y, 0);
			mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.linesegment(this.location.x - this.width, this.location.y, 0, this.location.x + this.width, this.location.y, 0);
        	mySketch.glpopmatrix();
        break;

        case "VLN____":
	    	mySketch.glpushmatrix();
			mySketch.linesegment(this.location.x, this.boundTop, 0, this.location.x, this.boundTop - (this.boundsHeight * this.scale.y), 0);
	        mySketch.glpopmatrix();
        break;

        case "MNT____":
	    	mySketch.glpushmatrix();
			mySketch.linesegment(this.boundLeft, this.locationGenesis.y, 0, this.locationGenesis.x * this.scale.x, this.location.y, 0);
			mySketch.linesegment(this.locationGenesis.x * this.scale.x, this.location.y, 0, this.boundRight, this.locationGenesis.y, 0);	
			mySketch.glpopmatrix();
        break;

	    case "RAL____":
	    	mySketch.glpushmatrix();
			mySketch.gltranslate(this.locationGenesis.x, this.location.y, 0);
	    	mySketch.moveto(0, 0, 0);
			mySketch.glrotate(this.rotation, 0, 0, 1);
			//
			mySketch.gldisable("line_stipple");
			//
			mySketch.plane(this.boundsWidth / 2, 0.0019);
			mySketch.moveto(0, this.locationGenesis.x * (1 - this.scale.x), 0);
			mySketch.glrotate(90, 0, 0, 1);

			mySketch.plane(0.03, 0.0019);
        	mySketch.glpopmatrix();
        break;

        //––––––––––––––
        // Circle based
        //––––––––––––––

        case "HEX___A":
			mySketch.glpushmatrix();
			mySketch.shapeorient(0, 0, 0);
			mySketch.gltranslate(this.location.x + positions[1], this.locationGenesis.y, 0);
			mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.moveto(0, 0, 0);
			//
			mySketch.shapeslice(6);
			mySketch.circle(0.015);
	        mySketch.glpopmatrix();
        break;

        case "HEX___B":
			mySketch.glpushmatrix();
			mySketch.shapeorient(0, 0, 0);
			mySketch.gltranslate(this.location.x, this.locationGenesis.y, 0);
			mySketch.shapeorient(0, 0, this.rotation + 45);
			mySketch.moveto(0, 0, 0);
			//
			mySketch.shapeslice(4);
			mySketch.framecircle(0.015);
	        mySketch.glpopmatrix();
        break;

        case "HEX_00A":
			mySketch.glpushmatrix();
			mySketch.shapeorient(0, 0, 45);
			mySketch.gltranslate(this.location.x, this.locationGenesis.y, 0);
			mySketch.glrotate(this.rotation, 0, 1, 0);
			mySketch.moveto(0, 0, 0);
			mySketch.glscale(this.scale.x, this.scale.y, 0)
			//
			mySketch.gldisable("line_stipple");
			mySketch.shapeslice(4);
			//
			mySketch.framecircle(0.015);
	        mySketch.glpopmatrix();
        break;

        case "HEX_00B":
			mySketch.glpushmatrix();
			mySketch.shapeorient(0, 0, 45);
			mySketch.gltranslate(this.location.x, this.locationGenesis.y, 0);
			mySketch.glrotate(this.rotation, 0, 0, 1);
			mySketch.moveto(0, 0, 0);
			
			mySketch.shapeslice(24);
			//
			mySketch.circle(0.00375);

			mySketch.glscale(this.scale.x, this.scale.y, 0)
			//
			mySketch.shapeslice(4);
			//
			mySketch.framecircle(0.015);
	        //
			
	        mySketch.glpopmatrix();
        break;

        case "HEX___C":
			mySketch.glpushmatrix();
			mySketch.shapeorient(0, 0, 0);
			mySketch.gltranslate(this.location.x + positions[1], this.locationGenesis.y, 0);
			mySketch.glrotate(this.rotation + 45, 0, 0, 1);
			mySketch.moveto(positions[0], 0, 0);
			//
			mySketch.shapeslice(32);
			mySketch.framecircle(0.015);
	        mySketch.glpopmatrix();
        break;

	    default:
	    	// if no object type has been assigned, make a red dot in the middle of the screen 
	    	// i had something here but then removed it because it was constantly displayed... not sure why. I should check the max patch.
	}

	mySketch.glflush(); // you started testing glflush on jan 14, 2017 to see if it would increase performance.
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



//====================================
//		Methods to add characters
//====================================

function addCharactersToLayer(layer, x, y, leftBound, rightBound, bottomBound, topBound, t){
	// given that having a size of zero would make the shape invisible and therefore resul useless, I'm using 0 to enable randomization of size
	layer.push(new Character(x, y, leftBound, rightBound, bottomBound, topBound, t));
}

function checkColumns(columns, rows){
	// a method to check that the numbers of columns and rows in the grid is never greater than the one allowed: verticalSubdivision / 2 
	var newColumns = columns;
	var newRows = rows;

	if(columns > (horizontalRes / 2)){
		newColumns = horizontalRes / 2;
	}

	if(rows > (verticalRes / 2)){
		newRows = verticalRes / 2;
	}
	
	return [newColumns, newRows];
}

function genesis(layer, items, type, gridColumns, gridRows){
	var array = prepareArrayForLayer(layer);
	
	var columnsAndRows = checkColumns(gridColumns, gridRows);
	var columns = columnsAndRows[0];
	var rows = columnsAndRows[1];
	var totalCells = columns * rows;

	var colPace = (windowWidth / columns) / 2;
	var rowPace = (windowHeight / rows) / 2;
	var multiples = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31];

	var xCoordinates = [];
	var yCoordinates = [];
	var leftBounds = [];
	var rightBounds = [];
	var bottomBounds = [];
	var topBounds = [];

	var cellsIndex = 0; // defines the starting cell in polulating a grid (eg: grid 2coll 2rows cellsIndex = 1, first element will be in the second cell - bottom right)

	// calculate x and y position for all items
	for (var f = 0; f < rows; f++) {
		// calculate vertical multiplier
		var verticalMultiplier = multiples[f];		
		var y = viewPortBottom + (rowPace * verticalMultiplier);
		var bottom = y - rowPace;
		var top = y + rowPace;

		for (var g = 0; g < columns; g++) {
			// calculate horizontal multiplier
			var horizontalMultiplier = multiples[g];
			var x = viewPortLeft + (colPace * horizontalMultiplier);
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
		addCharactersToLayer(array, xCoordinates[i], yCoordinates[i], leftBounds[i], rightBounds[i], bottomBounds[i], topBounds[i], type);					
	}

	// for (var i = totalCells; i >= (totalCells - items); i--) {
	// 	addCharactersToLayer(array, xCoordinates[i], yCoordinates[i], leftBounds[i], rightBounds[i], bottomBounds[i], topBounds[i], type);					
	// }
}



//=====================================
//		Methods to move characters
//=====================================

var newLifeSpan = 255;

function assignLifeSpan(value){	
	for(var i = 0; i < layers.length; i++){
		if(layers[i].sustain == true){
			for(var f = 0; f < layers[i].elements.length; f++){
				newLifeSpan = 255 * value;
				layers[i].elements[f].lifespan = newLifeSpan;
			}
		}
	}
}

var newEase = 0.2;

function assignEase(value){	
	for(var i = 0; i < layers.length; i++){
		for(var f = 0; f < layers[i].elements.length; f++){
			newEase = 1 - value;
			newEase = newEase  == 0 ? 0.1 : newEase;
			layers[i].elements[f].ease = newEase;
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
				// array[i].ease = velocity / 128;
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
				// array[i].ease = velocity / 128;
				// check bounds. this also assigns the values to the right object properites
				array[i].rotation = array[i].targetRotation;
				// array[i].targetRotation += angle * randomDirection;
				array[i].targetRotation += 90;


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
				// array[i].ease = velocity / 128;
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

function updateLifeDecay(value){		
	if(layer1.elements.length > 0){
		for(var i = 0; i < layer1.elements.length; i++){
			layer1.elements[i].lifeDecay = (1.01 - value) * 255;
		}
	}
	if(layer2.elements.length > 0){
		for(var i = 0; i < layer2.elements.length; i++){
			layer2.elements[i].lifeDecay = (1.01 - value) * 255;
		}
	}
	if(layer3.elements.length > 0){
		for(var i = 0; i < layer3.elements.length; i++){
			layer3.elements[i].lifeDecay = (1.01 - value) * 255;
		}
	}
	if(layer4.elements.length > 0){
		for(var i = 0; i < layer4.elements.length; i++){
			layer4.elements[i].lifeDecay = (1.01 - value) * 255;
		}
	}
}

