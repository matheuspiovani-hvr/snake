<?php
	header('Content-Type: application/json');
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, POST');
	header("Access-Control-Allow-Headers: Content-Type");


	if($_SERVER['REQUEST_METHOD'] == "POST") {
		$json = file_get_contents('php://input');
		$score = json_decode($json);

		if(!isset($score->value)) {
			echo '{ "message": "Bad request: missing value attribute in Score"}';
			exit(400);
			return;
		}
		if(!isset($score->playerName)) {
			echo '{ "message": "Bad request: missing playerName attribute in Score"}';
			exit(400);
		}
		if(!isset($score->gameDuration)) {
			echo '{ "message": "Bad request: missing gameDuration attribute in Score"}';
			exit(400);
		}
		if(!isset($score->startTime)) {
			echo '{ "message": "Bad request: missing startTime attribute in Score"}';
			exit(400);
		}
		if(!isset($score->length)) {
			echo '{ "message": "Bad request: missing length attribute in Score"}';
			exit(400);
		}

		$scoreFile = fopen("scores.json", "r");
		$scores = fread($scoreFile, filesize("scores.json"));
		$scores = json_decode($scores);
		fclose($scoreFile);


		$newUser = json_decode('{"value": "' 			. $score->value .
								'", "playerName": "' 	. $score->playerName .
								'", "gameDuration": "' 	. $score->gameDuration .
								'", "startTime": "' 	. $score->startTime .
								'", "length": "' 		. $score->length .
								'"}');


		array_push($scores, $newUser);


		$scoreFile = fopen("scores.json", "w");
		$strScore = json_encode($scores);


		fwrite($scoreFile, $strScore);
		fclose($scoreFile);

		$logs = fopen("log.txt", "a");
		$log = "create score: " . $strScore;
		$curTime = date('Y-m-d H:i:s');;
		$agent = get_current_user();
		$agent = $_SERVER['REMOTE_ADDR'];
		$agentName = get_current_user();
		$agentEnvName = getenv("username");
		fwrite($logs, "\n" . $curTime . " " . $agentName . "-" . $agent . "---" . $log);
		fclose($logs);


		echo $json;
		exit(200);
	}

	echo '{ "message": "Method Not Allowed"}';
	exit(405);	
?>
