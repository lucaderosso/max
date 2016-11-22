// Luca De Rosso
// http://www.lucaderosso.com/

// Instagram: @lucaderosso
// Twitter: @lucaderosso
// Facebook: facebook.com/derossoluca
// Pinterest: pinterest.com/lucaderosso


var rects = [];

// PLANE'S CONSTRUCTOR

function Plane(xPos, yPos, w, h){
	this.easing = false;

	this.width = w;
	this.height = h;
	this.rotation = 0;

	this.acceleration = Object.create(Vector);
	this.velocity = Object.create(Vector);
	this.location = Object.create(Vector);
	this.location.x = xPos;
	this.location.y = yPos;

	this.target = Object.create(Vector);

	this.initialLocation = xPos;

	this.color = Object.create(Color);
	this.color.r = 1;
	this.color.g = 1;
	this.color.b = 1;
}



// PLANE'S METHODS

Plane.prototype.run = function(){
	if (this.easing){
		this.easeTo(this.location, this.target, ease);
	}
	this.display();
}

Plane.prototype.display = function(){
	mySketch.glpushmatrix();
	mySketch.glcolor(this.color.r, this.color.g, this.color.b, this.color.a);
	// From OpenGL Red Book:
	// If you rotate the object first and then translate it, the rotated object appears on the x-axis.
	// If you translate it down the x-axis first, and then rotate about the origin, the object is on the line y=x. 
	// In general, the order of transformations is critical.
	mySketch.gltranslate(this.location.x, this.location.y, 0);
	mySketch.glrotate(this.rotation, 0, 0, 1);
	mySketch.glscale(this.width, this.height, 1);
	mySketch.plane(1, 1, 1, 1);
	mySketch.glpopmatrix();
}

Plane.prototype.easeTo = function(location, target){
	var ease = 0.2;
	var dx = target.x - location.x;
	var dy = target.y - location.y;
	
	location.x += dx * ease;
	location.y += dy * ease;

	if(Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
		location.x = target.x;
		location.y = target.y;
		this.easing = false;
	} else {
		this.easing = true;
	}
}



// METHODS
function makeGridOfPlanes(w, h, xPosGr, yPosGr, columns, rows){
	var width = w;
	var height = h;
	var xPosGrid = xPosGr;
	var yPosGrid = yPosGr;
	//clear elements array
	rects = [];
	// calculate increments to position elements in rows and columns
	var incrementForCol = width / Math.abs(columns);
	var incrementForRow = height / Math.abs(rows);
	// calculate outer gutters
	var xCorection = incrementForCol / 2;
	var yCorrection =  incrementForRow / 2;
	// correct stating point subtracting outer gutters
	var xPos = xPosGrid - xCorection;
	var yPos = yPosGrid - yCorrection;

	for(var i = 0; i < rows; i++){
		// create coordinates for row elements
		yPos += incrementForRow;
		for(var f = 0; f < columns; f++){
			// create coordinates for column elements
			xPos += incrementForCol;
			// add new element to array
			rects.push(new Plane(xPos, yPos, 0.001, 0.001, 0.96, 0.96, 0.96));				
		}
		// reset xPos for next loop
		xPos = xPosGrid - xCorection;
	}
}




function addNumberAtPosition(arrangement, numberOfDots, size, type){

	rects = [];

	for(var i = 0; i < numberOfDots; i++){
		
		if (arrangement == "random"){
			var xPos = positions[Math.floor((Math.random() * 7))];
			var yPos = positions[Math.floor((Math.random() * 7))];			
		}

		if (arrangement == "organized"){	
	// 		var xElements = ;
	// 		var yElements = ;

			var xElements = Math.floor(Math.sqrt(numberOfDots));
			var yElements = Math.ceil(Math.sqrt(numberOfDots));

	// 		// for(){
	// 		// 	// increment y
	// 		// 	for(){
	// 		// 		// increment x
	// 		// 	}
	// 		// }
		}
		addDotsToArray(xPos, yPos, size, type);		
	}

	post(numberOfDots + " should be " + xElements + " x " + yElements + "\n");
	post("\n");
}

function addDotsToArray(x, y, s, t){
	var size = s;
	// given that having a size of zero would make the shape invisible and therefore resul useless, I'm using 0 to enable randomization of size
	if(size == 0){
		// sizes should be externally accessible by all methods and populated by utilities.js
		var sizes = [0.125, 0.0625, 0.03125];
		var size = sizes[Math.floor((Math.random() * 3))];		
	}

	rects.push(new Dot(x, y, size, t));
}
