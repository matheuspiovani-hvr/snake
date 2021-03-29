"use strict";
class Snake {
	constructor(containerId, settings) {
		this.gameContainer = document.getElementById(containerId);		

		this.settings = {
			pointSize: 10,
			initialSpeedX: 1,
			initialSpeedY: 0,
			initialPositionX: 4,
			initialPositionY: 4,
			width: 400,
			height: 300,
			moveInterval: 100,
			minMoveInterval: 20,
			foodPoints: 10,
			rockChance: 0.005
		};
		Object.assign(this.settings, settings);

		this.canvas = document.createElement("canvas");
		this.canvas.width = this.settings.width;
		this.canvas.height = this.settings.height;
		this.canvas.className = "game-canvas";
		this.gameContainer.appendChild(this.canvas);

		this.context = this.canvas.getContext("2d");
		this.scoreEl = document.createElement("p");
		this.scoreEl.className = "score";
		this.gameContainer.appendChild(this.scoreEl);

		this.initButton = document.createElement("button");
		this.initButton.className = "snake-button";
		this.initButton.innerText = "START";
		this.initButton.onclick = function() {
			snake.init();
		};
		this.gameContainer.appendChild(this.initButton);

		this.score = new Score();

		let snake = this;
		document.body.onkeydown = function(e) {
			snake.keyPressed(e.keyCode);
		};
		snake.clear();
	}
}

Snake.prototype.init = function() {
	this.head = new Point(this.settings.initialPositionX, this.settings.initialPositionY);
	this.body = [new Point((this.settings.initialPositionX - 1), this.settings.initialPositionY)];
	this.speed = new Point(this.settings.initialSpeedX, this.settings.initialSpeedY);
	this.newSpeed = this.speed;
	this.food = new Point();
	this.rocks = [];
	this.currentMoveInterval = this.settings.moveInterval;
	this.score = new Score();
	this.scoreEl.innerText = "0";
	this.updateMoveInterval();
	this.spawnFood();
	this.initButton.style.display = "none";
	this.gameContainer.focus();	
	this.playing = true;
}

Snake.prototype.keyPressed = function(keyCode) {
	if(!this.playing) {return;}

	this.newSpeed = new Point(this.speed.x, this.speed.y);
	switch(keyCode) {
		case 37: 	//Arrow Left
		case 65: 	//A
			if(this.speed.x === 0) {
				this.newSpeed.x = -1;
				this.newSpeed.y = 0;
			}
			break;
		case 38: 	//Arrow Up
		case 87: 	//W
			if(this.speed.y === 0) {
				this.newSpeed.x = 0;
				this.newSpeed.y = -1;
			}
			break;
		case 39: 	//Arrow Right
		case 68: 	//D
			if(this.speed.x === 0) {
				this.newSpeed.x = 1;
				this.newSpeed.y = 0;
			}
			break;
		case 40: 	//Arrow Down
		case 83: 	//S
			if(this.speed.y === 0) {
				this.newSpeed.x = 0;
				this.newSpeed.y = 1;
			}
			break;
	}
};

Snake.prototype.move = function() {
	this.speed = this.newSpeed;
	this.head.add(new Point(this.speed.x,
		this.speed.y));

	if(this.isGameOver()) {
		this.gameOver();
	}

	if(this.head.equal(this.food)) {
		this.eat();
	};

	this.draw();
	this.body.unshift(new Point(this.head.x, this.head.y));
	this.body.pop();

	this.spawnRock();

	this.newSpeed = this.speed;
}

Snake.prototype.clear = function() {
	//Clear
	this.context.fillStyle = "rgba(150, 150, 150, 1)";
	this.context.strokeStyle = "black";
	this.context.fillRect(0, 0, this.settings.width, this.settings.height);
	this.context.strokeRect(0, 0, this.settings.width, this.settings.height);
}

Snake.prototype.draw = function() {
	this.clear();

	//Draw Head
	this.context.fillStyle = "darkgreen";
	this.context.strokestyle = "darkgreen";
	this.context.fillRect(this.head.x * this.settings.pointSize,
							this.head.y * this.settings.pointSize,
							this.settings.pointSize,
							this.settings.pointSize);

	//Draw body
	for(let i = 0; i < this.body.length; i++) {
		this.context.fillStyle = "lightgreen";
		this.context.strokestyle = "darkgreen";
		this.context.fillRect(this.body[i].x * this.settings.pointSize,
								this.body[i].y * this.settings.pointSize,
								this.settings.pointSize,
								this.settings.pointSize);		
	}

	//Draw food
	this.context.fillStyle = "red";
	this.context.strokestyle = "red";
	this.context.fillRect(this.food.x * this.settings.pointSize,
							this.food.y * this.settings.pointSize,
							this.settings.pointSize,
							this.settings.pointSize);

	//Draw rocks
	this.context.fillStyle = "rgba(60, 60, 60, 1)";
	this.context.strokestyle = "rgba(60, 60, 60, 1)";
	for(let i = 0; i < this.rocks.length; i++) {
		this.context.fillRect(this.rocks[i].x * this.settings.pointSize,
								this.rocks[i].y * this.settings.pointSize,
								this.settings.pointSize,
								this.settings.pointSize);
	}
}

Snake.prototype.eat = function() {
	this.body.push(new Point(this.food.x - this.speed.x, this.food.y - this.speed.y));
	this.food = null;

	let newMoveInterval = this.currentMoveInterval; //Change this interval to change snake speed
	this.currentMoveInterval = (newMoveInterval > this.settings.minMoveInterval)?newMoveInterval:this.settings.minMoveInterval;
	this.updateMoveInterval();

	this.score.value += this.settings.foodPoints;
	this.scoreEl.innerText = this.score.value;
	this.spawnFood();
}

Snake.prototype.spawnFood = function() {
    this.food = this.getRandomAvailableSquare();
}

Snake.prototype.spawnRock = function() {
	if(1 - Math.random() < this.settings.rockChance) {
		let newRock = this.getRandomAvailableSquare();
		this.rocks.push(newRock);
	}	
}

Snake.prototype.getRandomAvailableSquare = function() {
	let x = Math.floor(Math.random() * this.settings.width / this.settings.pointSize);
    let y = Math.floor(Math.random() * this.settings.height / this.settings.pointSize);

    let newPoint = new Point(x, y); 
    while(this.checkBodyCollision(newPoint) || this.head.equal(newPoint)) {
		x = Math.floor(Math.random() * this.settings.width / this.settings.pointSize);
	    y = Math.floor(Math.random() * this.settings.height / this.settings.pointSize);

	    newPoint = new Point(x, y); 
    }

    return newPoint;
}

Snake.prototype.checkBodyCollision = function(point) {
	for(let i = 0; i < this.body.length; i++) {
		if(this.body[i].equal(point)) {
			return true;
		}
	}
	return false;
}

Snake.prototype.isGameOver = function() {
	if(this.checkBodyCollision(this.head)) {
		return true;
	};

	for(let i = 0; i < this.rocks.length; i++) {
		if(this.rocks[i].equal(this.head)) {
			return true;
		}
	};

	if(this.head.x >= this.settings.width / this.settings.pointSize ||
		this.head.x < 0  ||
		this.head.y >= this.settings.height / this.settings.pointSize ||
		this.head.y < 0) {
		return true;
	}
	return false;
}

Snake.prototype.gameOver = function() {
	clearInterval(this.update);
	let score = this.score;
	let snake = this;
	this.playing = false;

	score.gameDuration = new Date() - score.startTime;
	score.length = this.body.length + 1;
	bootbox.alert({
		title: "GAME OVER",
		message: '<div class="fullwidth-align-center">' +
				'<span>Nome: </span><input id="playerName" type="text" placeholder=""/>' +
			'</div><br>' +
			'<div class="fullwidth-align-center"><p>Pontuação: ' + this.score.value + '</p></div>',
		callback: function(e) {
			score.playerName = document.getElementById("playerName").value;
			Persistence.saveScore(score, function() {
				snake.initButton.style.display = "inline";
			});
		}
	});
}

Snake.prototype.updateMoveInterval = function() {
	let snake = this;
	clearInterval(this.update);
	this.update = setInterval(function(e) {
		snake.move();
	}, this.currentMoveInterval);
}