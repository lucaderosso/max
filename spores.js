// Luca De Rosso
// http://www.lucaderosso.com/

// Instagram: @lucaderosso
// Twitter: @lucaderosso
// Facebook: facebook.com/derossoluca
// Pinterest: pinterest.com/lucaderosso



// GENERAL

var plane = new Plane();
var aging = 2000; 
var particles = [];
var speed = 0.01;
var size = 0.002;
var direction = 1;



// Plane

function Plane(startX, startY){
	this.speed = speed;
	this.size = size;
	this.location = Object.create(Vector);
	this.velocity = Object.create(Vector);
	this.location.x = startX;
	this.location.y = startY;
	this.velocity.x = randomValueInRange(-0.001, 0.001);
	this.velocity.y = randomValueInRange(0.2, 0.5) * this.speed * direction;
	this.lifespan = 255;
}

Plane.prototype.display = function(){
	mySecondSketch.moveto(this.location.x, this.location.y, 0);	
	var alpha = this.lifespan / 255.0;
	mySecondSketch.glcolor(1, 1, 1, alpha);
	mySecondSketch.shapeslice(60);
	mySecondSketch.gllinewidth(1);
	mySecondSketch.plane(this.size);
}

Plane.prototype.update = function(){
	this.location.add(this.velocity);      
	this.lifespan -= Math.abs(aging * this.velocity.y);
	
	if (this.isDead()){
		this.location.x = randomValueInRange(winL, winR);
		this.location.y = randomValueInRange(-1, 1);
		this.lifespan = 255;
		this.size = size;
		this.relocate();
	} 
}

Plane.prototype.relocate = function(){
	this.velocity.x = randomValueInRange(-0.001, 0.001);
	this.velocity.y = randomValueInRange(0.2, 0.5) * this.speed * direction;
	this.size = randomValueInRange(0.002, 0.01);
}

Plane.prototype.run = function(){
	this.update();
	this.display();
}

Plane.prototype.isDead = function(){
	if(this.lifespan < 0.0){
		return true;
	} else {
		return false;
	}
}



// METHODS

function decaySpeed(agingSpeed){
	// assing value from Max patch to aging
	aging = agingSpeed;
}

function randomValueInRange(min, max){
	// return a random number within the desired range of values
	return Math.random() * (max - min) + min;
}

function generate(numberOfSpores){
	for(var i = 0; i < numberOfSpores; i++){
		// calculate initial coordinates for spore 
		var xPos = randomValueInRange(-1, 1);
		var yPos = randomValueInRange(-1, 1);
		// create new spore with coordinates specified above and add it to array 
		particles.splice(i, 1, (new Plane(xPos, yPos)));
	}
}

