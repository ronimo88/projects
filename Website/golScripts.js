
let canvas;
let ctx;
let cellSize = 15;
let numVerticalCells;
let numHorizontalCells;
let cells = [];
let mouseX = 0;
let mouseY = 0;
let runInterval;
let gameRunning = false;
let runFPS = 4;
let cellColor = "#2196F3";


document.onmousemove = function(e) {
	mouseX = e.clientX;
	mouseY = e.clientY;

}


function loadGOL() {
	canvas = document.getElementById("golCanvas")
	ctx = canvas.getContext("2d");	
	drawGridLines();
	
	var themeSlider = document.getElementById("themeSlider");
	//alert(themeSlider);
	themeSlider.onclick = "changeTheme(); drawGridLines()";
}

function newButtonPressed() {
	cells = [];
	drawObjects();
	if (gameRunning) runButtonPressed();
	
}

function runButtonPressed() {
	
	gameRunning = !gameRunning;
	var runButton = document.getElementById("runButton");
	
	if (gameRunning) {
		runInterval = setInterval(advanceFrame, 1000/runFPS);
		runButton.innerHTML = "STOP"
		
	} else {
		clearInterval(runInterval);
		runButton.innerHTML = "RUN"
	}
}

function fpsChange() {
	
	let items = document.getElementById("fpsSelect");


	for (var i=0; i<items.length; i++) {

		if (items[i].selected) {
		
			runFPS = parseFloat(items[i].innerHTML);
			//alert(runFPS);
			
			if (gameRunning) {
				clearInterval(runInterval);
				runInterval = setInterval(advanceFrame, 1000/runFPS);
			}
		}
		
	}
	
}



function cell(x,y,alive) {
	this.x = x;
	this.y = y;
	this.alive = alive;
	this.changeState = false;
	this.destroyCount = 2;
	this.neighbors = 0;
	this.created = true;
}

function advanceFrame() {
	
	
	cells.forEach(function(cell) {
		
		cell.neighbors = 0;
		cell.created = false;
		cell.destroy = false;
	
		var checkCell = cellAt(cell.x+cellSize, cell.y); 
		if (checkCell != null) if (checkCell.alive) cell.neighbors++;
		
		var checkCell = cellAt(cell.x+cellSize, cell.y+cellSize); 
		if (checkCell != null) if (checkCell.alive) cell.neighbors++;
		
		var checkCell = cellAt(cell.x, cell.y+cellSize); 
		if (checkCell != null) if (checkCell.alive) cell.neighbors++;
		
		var checkCell = cellAt(cell.x-cellSize, cell.y+cellSize); 
		if (checkCell != null) if (checkCell.alive) cell.neighbors++;
		
		var checkCell = cellAt(cell.x-cellSize, cell.y); 
		if (checkCell != null) if (checkCell.alive) cell.neighbors++;
		
		var checkCell = cellAt(cell.x-cellSize, cell.y-cellSize); 
		if (checkCell != null) if (checkCell.alive) cell.neighbors++;
		
		var checkCell = cellAt(cell.x, cell.y-cellSize); 
		if (checkCell != null) if (checkCell.alive) cell.neighbors++;
		
		var checkCell = cellAt(cell.x+cellSize, cell.y-cellSize); 
		if (checkCell != null) if (checkCell.alive) cell.neighbors++;
		
		if (cell.alive) {
			if (cell.neighbors < 2 || cell.neighbors > 3) {
				cell.changeState = true;	
				cell.destroyCount = 2;
			}
		} else {
			if (cell.neighbors == 3) {
				cell.destroyCount = 2;
				cell.changeState = true;
				createDeadCells(cell);
			}
			
			if (cell.neighbors == 0) cell.destroyCount--;
		}  
			
			
		
		
		
		//alert(cell.neighbors);
		
	});
	
	
	cells.forEach(function(cell) {
		if (cell.changeState) cell.alive = !cell.alive;
		cell.changeState = false;
		
	});
	
	let newCells = cells;
	
	cells.forEach(function(checkCell) {
		
	
		if (checkCell.destroyCount <= 0) {
		
			let tempCells = newCells;
			//alert(tempCells.length);
			var index = tempCells.indexOf(checkCell)
			//alert(index);
			tempCells.splice(index,1);
			//alert(tempCells.length);
			newCells = tempCells;	
		}	
	});
	
	cells = newCells;
	

	drawObjects();
	
	cells.forEach(function(cell) {
		ctx.fillStyle = "black";
		ctx.font = "20px Arial";
		//if (cell.destroy) ctx.fillText("d", cell.x, cell.y+20);
		//ctx.fillText(cell.neighbors, cell.x, cell.y+20);
	});
	
	
	
	//alert(cells.length);
}


function windowResize() {
	
	var menu = document.getElementById("golMenuWrapper");
	var box = document.getElementById("golBox");
	
	
	if (window.innerWidth > window.innerHeight) {
		
		canvas.height = window.innerHeight-250;
		
		box.style.setProperty("display","flex");
		
		menu.style.setProperty("height","revert");
		menu.style.setProperty("width","130px");

	
		var menuWidth = parseFloat(window.getComputedStyle(menu).width);
		
		
		canvas.width = window.innerWidth-menuWidth-200;
		//if (canvas.width > 1500) canvas.width = 1500;
		
		var mainInner = document.getElementById("mainInnerGOL");
		var rect = mainInner.getBoundingClientRect();
	
		//alert(rect.left);
		//canvas.width -= rect.left;
		
		
	} else {
		
		canvas.width = window.innerWidth-25;
		
		box.style.setProperty("display","revert");
		
		menu.style.setProperty("width","revert");
		menu.style.setProperty("height","fit-content");
	
	
		var menuHeight = parseFloat(window.getComputedStyle(menu).height);
		
		canvas.height = window.innerHeight-menuHeight-250;
		
		var mainInner = document.getElementById("mainInnerGOL");
		var rect = mainInner.getBoundingClientRect();
	
		//alert(rect.left);
		canvas.width -= rect.left;
	}
	

	
	
	drawObjects();
	
}




function drawObjects() {
	
	ctx.clearRect(0,0,canvas.width,canvas.height);
	
	
	cells.forEach(function(cell) {
		if (cell.alive) {
			ctx.fillStyle = cellColor;
			ctx.fillRect(cell.x, cell.y ,cellSize, cellSize);
		} else {
			//ctx.fillStyle = "red";
			//ctx.fillRect(cell.x, cell.y ,cellSize, cellSize);
			
		}
	});
	
	drawGridLines();
}


function drawGridLines() {
	
	var r = document.querySelector(':root');
	
	ctx.strokeStyle = r.style.getPropertyValue("--border-color");
	//ctx.fillStyle = "white";
	//ctx.fillRect(100, 100, 100, 100);
	
	numVerticalCells = canvas.width/cellSize;
	numHorizontalCells = canvas.height/cellSize;
	
	
	for (var i=1; i<=numVerticalCells; i++) {
		
		ctx.strokeWidth = 1;
		ctx.beginPath();
		ctx.moveTo(cellSize*i, 0);
		ctx.lineTo(cellSize*i, canvas.height);
		ctx.stroke();
		ctx.closePath();
	}
	
	for (var i=1; i<=numHorizontalCells; i++) {
		
		ctx.strokeWidth = 1;
		ctx.beginPath();
		ctx.moveTo(0, cellSize*i);
		ctx.lineTo(canvas.width, cellSize*i);
		ctx.stroke();
		ctx.closePath();
		
		
		
	}
	
	
	
	var mainInner = document.getElementById("mainInnerGOL");
	var rect = mainInner.getBoundingClientRect();
	


	
	ctx.font = "30px Arial";
	ctx.fillStyle = "white";
	var test = rect.left;
	//ctx.fillText(test,30,30);
		
}

function cellAt(x,y) {
	
	var returnCell = null;
	
	cells.forEach(function(cell) {
		
		if (cell.x == x && cell.y == y) {
			
			returnCell = cell;	
		}	
	});
	
	return returnCell;
}

function createDeadCells(newCell) {
	
	if (!cellAt(newCell.x+cellSize, newCell.y)) cells.push(new cell(newCell.x+cellSize, newCell.y, false));
	if (!cellAt(newCell.x+cellSize, newCell.y+cellSize)) cells.push(new cell(newCell.x+cellSize, newCell.y+cellSize, false));
	if (!cellAt(newCell.x, newCell.y+cellSize)) cells.push(new cell(newCell.x, newCell.y+cellSize, false));
	if (!cellAt(newCell.x-cellSize, newCell.y+cellSize)) cells.push(new cell(newCell.x-cellSize, newCell.y+cellSize, false));
	if (!cellAt(newCell.x-cellSize, newCell.y)) cells.push(new cell(newCell.x-cellSize, newCell.y, false));
	if (!cellAt(newCell.x-cellSize, newCell.y-cellSize)) cells.push(new cell(newCell.x-cellSize, newCell.y-cellSize, false));
	if (!cellAt(newCell.x, newCell.y-cellSize)) cells.push(new cell(newCell.x, newCell.y-cellSize, false));
	if (!cellAt(newCell.x+cellSize, newCell.y-cellSize)) cells.push(new cell(newCell.x+cellSize, newCell.y-cellSize, false));
}

function canvasClicked() {
	
	var rect = canvas.getBoundingClientRect();	
	var cellX = Math.floor((mouseX-rect.left)/cellSize)*cellSize;
	var cellY = Math.floor((mouseY-rect.top)/cellSize)*cellSize;
	//var createCell = false;
	var checkCell = cellAt(cellX, cellY);
	
	//start
	
	/**
	
	numVerticalCells = canvas.width/cellSize;
	numHorizontalCells = canvas.height/cellSize;
	
	
	
	for (var i=numVerticalCells/4; i<=numVerticalCells*3/4; i++) {
		for (var j=numHorizontalCells/4; j<=numHorizontalCells*3/4; j++) {
			
			
			var create = Math.floor(Math.random()*4);

			if (create == 1) {
				var newCell = new cell(Math.floor(i)*cellSize, Math.floor(j)*cellSize, true)
				cells.push(newCell);
				createDeadCells(newCell);
			}
		}
	}
	
	var newCell = new cell(i*cellSize, j*cellSize, true)
	cells.push(newCell);
	createDeadCells(newCell);
	
	**/
	//stop

	
	
	if (checkCell == null) {
		
		var newCell = new cell(cellX, cellY, true)
		cells.push(newCell);
		createDeadCells(newCell);
		
	} else {
		
		checkCell.alive = !checkCell.alive;
		if (checkCell.alive) createDeadCells(checkCell);
	}
	
	drawObjects();
	
	//alert(cells.length);

}


