
let canvas;
let ctx;
let gameLoopVar;
let moveBallVar;
let playerPaddle;
let cpuPaddle;
let ball;
let paddleWidth = 15;
let paddleHeight = 100;
let ballSize = 8;
let ballSpeed;
let ballSpeedIncrease = 0.1;
let maxBallSpeed = 8;
let ballBounceVal = 8
let moveUp = false;
let moveDown = false;
let arrowUp = false;
let arrowDown = false;
let playerPaddleSpeed = 5;
let cpuPaddleSpeed = 2;
let fps = 120;
let score1 = 0;
let score2 = 0;
let winScore = 5;
let gameOverText = "";
let ballToX;
let ballToY;
let paddleOffset;
let playerTurn = false;
let mouseX = 0;
let mouseY = 0;
let controls = "keyboard";
let mouseYOffset
let loseAudio = new Audio("audio/loser.mp3");


document.onkeydown = function(e) {
	
	if (e.keyCode == 40) {
		moveDown = true;
		controls = "keyboard";
	}

	if (e.keyCode == 38) {
		moveUp = true;
		controls = "keyboard";
	}
}


document.onkeyup = function(e) {
	
  if (e.keyCode == 40) {
		moveDown = false;
	}

	if (e.keyCode == 38) {
		moveUp = false;
	}
}


document.onmousemove = function(e) {
	mouseX = e.clientX;
	mouseY = e.clientY;

}


function setMouseControls() {
	
	controls = "mouse";
	moveUp = false;
	moveDown = false;
}

function upPressed() {

	arrowUp = true;
	controls = "arrows"
}

function downPressed() {
	arrowDown = true;
	controls = "arrows"
}

function upReleased() {

	arrowUp = false;

}

function downReleased() {
	arrowDown = false;
	
}




function loadPongGame() {
	menuResize();
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	playerPaddle = {
		x: 10,
		y: Math.round(canvas.height/2.0 - paddleHeight/2.0)
	}

	cpuPaddle = {
		x: canvas.width - paddleWidth - 10,
		y: Math.round(canvas.height/2.0 - paddleHeight/2.0)
	}
	
	drawObjects();
}

function startGame() {
	clearInterval(gameLoopVar);
	gameLoopVar = setInterval(gameLoop, 1000/fps);
	moveBallVar = setTimeout(moveBall, 1000);
	score1 = 0;
	score2 = 0;
	gameOverText = "";
	loseAudio.pause();
	loseAudio.currentTime = 0;
	
	defaultPositions();
}

function endGame() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	drawObjects();
	clearInterval(gameLoopVar);
}

function defaultPositions() {
	
	playerPaddle = {
		x: 10,
		y: Math.round(canvas.height/2.0 - paddleHeight/2.0)
	}

	cpuPaddle = {
		x: canvas.width - paddleWidth - 10,
		y: Math.round(canvas.height/2.0 - paddleHeight/2.0)
	}

	if (playerTurn) ballOffset = -20;
	else ballOffset = 20;

	ball = {
		x: Math.round(canvas.width/2.0) + ballOffset,
		y: Math.round(canvas.height/2.0),
		hSpeed: 0,
		vSpeed: 0
	}
	
	ballSpeed = 5;
}


function gameLoop() {
	
	ctx.clearRect(0,0,canvas.width,canvas.height);
	
	playerLoop();
	cpuLoop();
	ballLoop();
	drawObjects();
	
	
	
}



function playerLoop() {
	
	if (moveDown) {
		playerPaddle.y += playerPaddleSpeed;
	}
	
	if (moveUp) {
		playerPaddle.y -= playerPaddleSpeed;	
	}
	
	if (arrowDown) {
		playerPaddle.y += playerPaddleSpeed;
		arrowDown = false;
	}
	
	if (arrowUp) {
		playerPaddle.y -= playerPaddleSpeed;
		arrowUp = false;
	}
	
	
	
	
	if (controls == "mouse") {
		
		
		var rect = canvas.getBoundingClientRect();
		if (canvas.style.height == "") mouseYOffset = 1;
		else mouseYOffset = canvas.height/parseFloat(canvas.style.height);
		
		//alert(canvas.style.height);
		
		if (playerPaddle.y + paddleHeight/2.0 < (mouseY- rect.top)*mouseYOffset) playerPaddle.y += playerPaddleSpeed;
		if (playerPaddle.y + paddleHeight/2.0 > (mouseY - rect.top)*mouseYOffset) playerPaddle.y -= playerPaddleSpeed;
		
	}
	
	if (playerPaddle.y < 0) playerPaddle.y = 0;
	if (playerPaddle.y > canvas.height-paddleHeight) playerPaddle.y = canvas.height-paddleHeight;

	
}


function cpuLoop() {
	
	if (ball.hSpeed > 0) {
	
		if (cpuPaddle.y < ballToY - paddleHeight/2.0 - paddleOffset) cpuPaddle.y += cpuPaddleSpeed;
		if (cpuPaddle.y > ballToY - paddleHeight/2.0 - paddleOffset) cpuPaddle.y -= cpuPaddleSpeed;
		
		if (cpuPaddle.y < 0) cpuPaddle.y = 0;
		if (cpuPaddle.y > canvas.height-paddleHeight) cpuPaddle.y = canvas.height-paddleHeight;
	}

}


function ballLoop() {
	
	/* Collide CPU Paddle */
	if ( ball.hSpeed > 0
	&& ball.x + ball.hSpeed > cpuPaddle.x 
	&& ball.x + ball.hSpeed < canvas.width
	&& ball.y > cpuPaddle.y - ballSize
	&& ball.y < cpuPaddle.y + paddleHeight + ballSize) {
		if (ballSpeed < maxBallSpeed - ballSpeedIncrease) ballSpeed += ballSpeedIncrease;
		ball.hSpeed = -ballSpeed;
		ball.vSpeed = (ball.y - (cpuPaddle.y + paddleHeight/2.0))/ballBounceVal;
		//ball.vSpeed = 0;
	}
	
	
	/* Collide Player Paddle */
	if ( ball.hSpeed < 0
	&& ball.x + ball.hSpeed < playerPaddle.x + paddleWidth
	&& ball.x + ball.hSpeed > 0
	&& ball.y > playerPaddle.y - ballSize
	&& ball.y < playerPaddle.y + paddleHeight + ballSize) {
		if (ballSpeed < maxBallSpeed - ballSpeedIncrease) ballSpeed += ballSpeedIncrease;
		ball.hSpeed = ballSpeed
		ball.vSpeed = (ball.y - (playerPaddle.y + paddleHeight/2.0))/ballBounceVal;
		getBallToY();
	}
	
	/* Ball score on left */
	if (ball.x < -ballSize) {
		score2++;
		
		if (score1 >= winScore || score2 >= winScore) {
			
			gameOverText = "YOU LOSE!"
			endGame();
			loseAudio.play();
			return;
		}
		
		playerTurn = true;
		defaultPositions();
		moveBallVar = setTimeout(moveBall, 1000);
		
	
	}
	
	/* Ball score on right */
	if (ball.x > canvas.width+ballSize) {
		score1++;	
		
		if (score1 >= winScore || score2 >= winScore) {
			
			gameOverText = "YOU WIN!"
			endGame();
			return;
		}
		
		playerTurn = false;
		defaultPositions();
		moveBallVar = setTimeout(moveBall, 1000);
		
	}
	
	/* Ball hit top or bottom of screen */
	if (ball.y > canvas.height - ballSize
	|| ball.y < ballSize) {
		ball.vSpeed = -ball.vSpeed;
	}
	
	
	ball.x += ball.hSpeed;
	ball.y += ball.vSpeed;
}

function drawObjects() {
	
	drawOverlay();
	drawPlayer();
	drawCPU();
	drawBall();
	
	/* Ball Path Test
	ctx.beginPath();
	ctx.fillStyle = "yellow";
	ctx.arc(ballToX, ballToY, ballSize, 0, Math.PI*2);
	ctx.fill();
	ctx.closePath();
	*/
}


function drawOverlay() {
	
	ctx.beginPath();
	ctx.strokeStyle = "white";
	ctx.lineWidth = 2;
	ctx.moveTo(canvas.width/2.0,0);
	ctx.lineTo(canvas.width/2.0,canvas.height);
	ctx.stroke();
	ctx.closePath();
	
	var x = canvas.width/2.0-10;
	var y = 10;

	ctx.font = "40px Arial";
	ctx.fillStyle = "white";
	ctx.textBaseline = "top";
	ctx.textAlign = "right";
	ctx.fillText(score1, x, y);

	x = canvas.width/2.0+10;
	ctx.textAlign = "left";
	ctx.fillText(score2, x, y);	
	
	x = canvas.width/2.0;
	y = canvas.height/2.0;
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";
	ctx.fillText(gameOverText, x, y);
	
	var rect = canvas.getBoundingClientRect();
	
	
	/* Test **/
	x = canvas.width/2.0;
	y = canvas.height - 10
	ctx.textBaseline = "bottom";
	ctx.textAlign = "center";
	//ctx.fillText(arrowUp, x, y);
	
}



function drawPlayer() {
	ctx.fillStyle = "blue";
	ctx.fillRect(playerPaddle.x, playerPaddle.y, paddleWidth, paddleHeight);	
}


function drawCPU() {
	ctx.fillStyle = "red";
	ctx.fillRect(cpuPaddle.x, cpuPaddle.y, paddleWidth, paddleHeight);
	
}

function drawBall() {
	if (ball != null) {
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.arc(ball.x, ball.y, ballSize, 0, Math.PI*2);
		ctx.fill();
		ctx.closePath();
	}	
}


function moveBall() {

	if (playerTurn) {
		ball.hSpeed = -ballSpeed;
	} else {
		
		ball.hSpeed = ballSpeed;
		getBallToY();
	}
	
}

function getBallToY() {

	
	var tempX = ball.x;
	var tempY = ball.y;
	var tempHSpeed = ball.hSpeed;
	var tempVSpeed = ball.vSpeed;
	
	paddleOffset =  (Math.random()*2-1) * paddleHeight*0.5;
	//paddleOffset = paddleHeight*-0.5;
	//paddleOffset = 0;

	while (tempX + ballSize < cpuPaddle.x) {

		
		
		if (tempY > canvas.height - ballSize
		|| tempY < ballSize) {
			tempVSpeed = -tempVSpeed;
		}
		
		tempX += tempHSpeed;
		tempY += tempVSpeed;
			
		ballToX = tempX;
		ballToY = tempY;
	}
	
	
}



