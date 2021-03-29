"use strict";
class Persistence {
	static saveScore(score, callback) {
		throw "saveScore is not implemented";
	}

	static getScores(callback) {
		$.ajax({
			type: "GET",
            crossDomain: true,
			beforeSend: function(request) {
				request.setRequestHeader("Content-Type", "application/json");
			},
			url: Persistence.baseUrl + Persistence.getScoresPath,
			processData: false,
			success: function(msg) {
				if(callback) {
					callback(msg);
				}
			}
		});
	}
}
Persistence.baseUrl = "http://localhost/snakeserver";
Persistence.getScoresPath = "/scores";
Persistence.saveScorePath = "/score";