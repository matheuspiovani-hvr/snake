"use strict";
class Point {
	constructor(x, y) {
		this.x = x?x:0;
		this.y = y?y:0;
	}
}

Point.prototype.add = function(point) {
	this.x += point.x;
	this.y += point.y;
}

Point.prototype.equal = function(point) {
	if(this.x === point.x && this.y === point.y) {
		return true;
	}
	return false;
}