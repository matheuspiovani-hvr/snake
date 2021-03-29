<?php
	header('Content-Type: application/json');
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, POST');
	header("Access-Control-Allow-Headers: Content-Type");

	if($_SERVER['REQUEST_METHOD'] == "GET") {
		$scoreFile = fopen("scores.json", "r");
		$scores = fread($scoreFile, filesize("scores.json"));
		fclose($scoreFile);

		echo $scores;
		exit(200);
	}

	echo '{ "message": "Method Not Allowed"}';
	exit(405);	
?>