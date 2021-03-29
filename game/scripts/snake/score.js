"use strict";
class Score {
	constructor(score) {
		this.value = score?score.value:0;
		this.playerName = score?score.playerName:"PLAYER";
		this.gameDuration = score?score.gameDuration:0;
		this.startTime = score?score.startTime:new Date();
		this.length = score?score.length:0;
	}
}