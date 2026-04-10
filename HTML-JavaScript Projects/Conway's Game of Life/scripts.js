
let canvas, ctx, cells, cellSize, defaultCellSize, defaultCellColor, defaultBackgroundColor, playInterval, positionArray, cellColor, backgroundColor, lineColor, speed, presetName, origin, leftClicked, middleClicked, canvasScroll, clickPos, scrollOrigin, scrollOffset, sizeOffset, screenOffset, presets, currentPreset, multiColorMode, canvasDefaultWidth, canvasDefaultHeight, generation, isMouseInside;

let frameCount = 0;
let lastTime = performance.now(); // Use performance.now() for higher precision
let fps = 0;

class cell {
    constructor(x, y, alive, color) {
        this.x = x;
        this.y = y;
        this.alive = alive;
        this.delete = false;
        this.changeState = false;
        this.color = color;
        if (!this.alive) this.color = null;
        this.text = 1;
        cells.push(this);
        setCellPosition(this);
    }
}

function load() {
    clearInterval(playInterval);
    playInterval = null;
    canvas = document.getElementById("canvas");
    canvasDefaultWidth = 1000;
    canvasDefaultHeight = 800;
    ctx = canvas.getContext("2d");
    cells = [];
    positionArray = [];
    //positionArray = new Map();
    presets = ["None"];
    generation = 0;

    defaultCellSize = 20;
    cellSize = defaultCellSize;
    defaultCellColor = "#ffff00";
    cellColor = defaultCellColor;
    defaultBackgroundColor = "#808080";
    backgroundColor = defaultBackgroundColor;
    lineColor = "#bbbbbb";
    speed = 15;
    presetName = "";
    multiColorMode = false;
    currentPreset = null;

    loadPresets();
    setNextButtonsDisabled(true);
    setResetButtonDisabled(true);

    origin = {
        x: 0,
        y: 0
    }

    scrollOffset = {
        x: 0,
        y: 0,
    }

    sizeOffset = {
        x: 0,
        y: 0
    }

    screenOffset = {
        x: 0,
        y: 0
    }

    setInputs();
    draw();

    const fileInput = document.getElementById('file_upload');

    fileInput.addEventListener('change', (event) => {
        var file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            var error = false;

            reader.onload = function (e) {
                try {

                    const values = JSON.parse(e.target.result);
                    if (values.cellSize) cellSize = values.cellSize; else console.warn("No cell size");
                    if (values.cellColor) cellColor = values.cellColor; else console.warn("No cell color");
                    if (values.backgroundColor) backgroundColor = values.backgroundColor; else console.warn("No background color");
                    if (values.cells) cells = structuredClone(values.cells); else console.warn("No cells");
                    if (values.presetName) presetName = values.presetName; else console.warn("No preset name");
                    if (values.scrollOffset) scrollOffset = values.scrollOffset; else console.warn("No scroll offset");

                    currentPreset = null;


                    clearPositionArray();

                    cells.forEach(cell => {
                        setCellPosition(cell);
                    });

                    cells.forEach(cell => {
                        createDeadCells(cell.x, cell.y);
                    });

                    setNextButtonsDisabled(false);
                    document.getElementById("reset_button").innerHTML = "Clear";
                    setResetButtonDisabled(false);

                    setOrigin();
                    setInputs();
                    draw();

                    fileInput.value = null;

                    document.getElementById("preset_select").selectedIndex = 0;

                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    alert('Invalid JSON File');
                    error = true;
                }
            };

            reader.readAsText(file); // Read the file content as text
        }

    });

    canvas.addEventListener('mouseover', () => {
        isMouseInside = true;
    });

    canvas.addEventListener('mouseout', () => {
        isMouseInside = false;
    });


    canvas.onmousedown = function (e) {

        if (e.button == 0) {

            leftClicked = true;

            const rect = canvas.getBoundingClientRect(); // Get the size and position of the canvas relative to the viewport

            var posX = e.clientX - rect.left;
            var posY = e.clientY - rect.top;

            clickPos = {
                x: posX,
                y: posY
            };

            scrollOrigin = {
                x: scrollOffset.x,
                y: scrollOffset.y
            }

        }

    }

    document.onmouseup = function (e) {
        // Only handle left mouse button
        if (e.button !== 0) return;

        if (leftClicked && !canvasScroll) {
            makeCell(e);
        }

        leftClicked = false;

        if (canvasScroll) {
            canvasScroll = false;
            canvas.style.cursor = "default";

            scrollOffset.x = Math.round(scrollOffset.x);
            scrollOffset.y = Math.round(scrollOffset.y);

            setInputs();
            setOrigin();
        }

        draw();
    };

    document.onmousemove = function (e) {

        const rect = canvas.getBoundingClientRect(); // Get the size and position of the canvas relative to the viewport

        var posX = e.clientX - rect.left;
        var posY = e.clientY - rect.top;

        if (!canvasScroll) {

            if (leftClicked) {
                if (Math.abs(clickPos.x - posX) >= 10 || Math.abs(clickPos.y - posY) >= 10) {
                    canvasScroll = true;
                    leftClicked = false;
                }
            }
        }

        if (canvasScroll) {

            canvas.style.cursor = "grab";

            //scrollOffset.x = scrollOrigin.x + Math.floor((clickPos.x - posX) / cellSize);
            //scrollOffset.y = scrollOrigin.y + Math.floor((clickPos.y - posY) / cellSize);
            scrollOffset.x = scrollOrigin.x + (clickPos.x - posX) / cellSize;
            scrollOffset.y = scrollOrigin.y + (clickPos.y - posY) / cellSize;
            setOrigin();
            setInputs();
            draw();
        }
    }

    const container = document.getElementById('canvas_wrapper');

    function resizeCanvas() {
        // Get the current dimensions of the parent div
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Set the canvas dimensions to match the parent div

        canvas.width = containerWidth - 5;
        canvas.height = containerHeight - 5;

        screenOffset.x = Math.round((canvasDefaultWidth - canvas.width) / (defaultCellSize * 2));
        screenOffset.y = Math.round((canvasDefaultHeight - canvas.height) / (defaultCellSize * 2));

        setOrigin();
        draw();
    }

    // Initial resize when the page loads
    resizeCanvas();

    window.onresize = function () {
        canvas.width = 0;
        canvas.height = 0;
        resizeCanvas();
    }
}

async function loadPresets() {

    try {
        const resp = await fetch('get_file.php', { method: 'POST' });
        const text = await resp.text();
        const files = JSON.parse(text);

        files.forEach(file => {
            var preset = JSON.parse(file);

            presets.push({
                cellSize: preset.cellSize,
                cellColor: preset.cellColor,
                backgroundColor: preset.backgroundColor,
                scrollOffset: preset.scrollOffset,
                cells: preset.cells
            });

            var presetSelect = document.getElementById("preset_select");
            var option = document.createElement("option");
            presetSelect.appendChild(option);
            option.innerHTML = preset.presetName;
        });

        setOrigin();
        setInputs();
        draw();


    } catch (err) {
        console.error('Error:', err);
    }
}

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var aliveCells = cells.filter(cell => cell.alive === true);

    aliveCells.forEach(cell => {

        if (multiColorMode) {
            if (cell.color) ctx.fillStyle = cell.color;
            else ctx.fillStyle = cellColor;
        } else {
            ctx.fillStyle = cellColor;
        }

        ctx.fillRect((cell.x - origin.x) * cellSize, (cell.y - origin.y) * cellSize, cellSize, cellSize);
    });

    if (aliveCells.length > 0) {
        setNextButtonsDisabled(false);
        setResetButtonDisabled(false);
    } else {


        if (!currentPreset)
            setResetButtonDisabled(true);

        if (playInterval) togglePlay();

        setNextButtonsDisabled(true);
    }

    //drawDeadCells();

    drawGridLines();
}

function drawDeadCells() {
    var deadCells = cells.filter(cell => cell.alive === false);

    deadCells.forEach(cell => {
        if (cell.color && multiColorMode) {
            ctx.fillStyle = cell.color;
            ctx.fillRect((cell.x - origin.x) * cellSize, (cell.y - origin.y) * cellSize, cellSize, cellSize);
        }

        ctx.fillStyle = "black";
        ctx.fillText("X", (cell.x - origin.x) * cellSize + cellSize / 2, (cell.y - origin.y) * cellSize + cellSize / 2)
    });
}

function drawGridLines() {
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 0.5;

    var offsetX = (Math.round(scrollOffset.x) - scrollOffset.x) * cellSize;
    var offsetY = (Math.round(scrollOffset.y) - scrollOffset.y) * cellSize;

    if (cellSize > 4) {

        for (var i = offsetX; i < canvas.width; i += cellSize) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }

        for (var i = offsetY; i < canvas.height; i += cellSize) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }
    }
}

function setInputs() {
    document.getElementById("zoom").value = cellSize * 100 / defaultCellSize;
    document.getElementById("cell_color").value = cellColor;
    document.getElementById("background_color").value = backgroundColor;
    document.getElementById("preset_name").value = presetName;
    document.getElementById("speed").value = speed;
    document.getElementById("generation").innerHTML = "Generation: " + generation;
    document.getElementById("view_pos").innerHTML = "(" + Math.round(scrollOffset.x) + "," + Math.round(scrollOffset.y) + ")";
}

function changeInput(input) {

    if (input.id == "zoom") {
        value = minMax(input.value, input.min, input.max);
        cellSize = parseInt(defaultCellSize * value / 100);

        setOrigin();
        setInputs();
        draw();
    }

    if (input.id == "cell_color") {
        cellColor = input.value;
        draw();
    }

    if (input.id == "multi_color_mode") {
        multiColorMode = input.checked;

        draw();
    }

    if (input.id == "background_color") {
        backgroundColor = input.value;
        draw();
    }

    if (input.id == "speed") {
        value = minMax(input.value, input.min, input.max);
        speed = value;

        setInputs();

        if (playInterval) {
            togglePlay();
            togglePlay();
        }
    }

    if (input.id == "origin_x") {
        origin.x = parseInt(input.value);
        setInputs();
        draw();
    }

    if (input.id == "origin_y") {
        origin.y = parseInt(input.value);
        setInputs();
        draw();
    }

    if (input.id == "preset_select") {
        if (input.selectedIndex == 0) {
            clearCells();
            resetView();
            presetName = "";

        } else {

            var preset = presets[input.selectedIndex];
            cellSize = preset.cellSize;
            cellColor = preset.cellColor;
            backgroundColor = preset.backgroundColor;
            scrollOffset.x = preset.scrollOffset.x;
            scrollOffset.y = preset.scrollOffset.y;
            cells = structuredClone(preset.cells);

            currentPreset = null;

            clearPositionArray();

            cells.forEach(cell => {
                setCellPosition(cell);
                if (!cell.alive) cell.color = null;
            });


            cells.forEach(cell => {
                createDeadCells(cell.x, cell.y);
            });

            if (playInterval) togglePlay();

            setNextButtonsDisabled(true);
            document.getElementById("reset_button").innerHTML = "Clear";
            setResetButtonDisabled(false);

            setOrigin();
            setInputs();
            draw();
            //draw();
        }
    }
}

function minMax(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function createDeadCells(x, y) {

    createDeadCell(x + 1, y);
    createDeadCell(x + 1, y + 1);
    createDeadCell(x, y + 1,);
    createDeadCell(x - 1, y + 1);
    createDeadCell(x - 1, y);
    createDeadCell(x - 1, y - 1);
    createDeadCell(x, y - 1);
    createDeadCell(x + 1, y - 1);
}

function createDeadCell(x, y) {
    var c = getCellAtPosition(x, y);

    if (c) {
        if (c.delete) {
            c.delete = false;
            c.alive = false;
        }
    } else {
        new cell(x, y, false, cellColor);
    }
}


function setCell(x, y, alive) {
    var c = getCellAtPosition(x, y);

    if (c) {
        c.alive = alive;
    } else {
        new cell(x, y, alive, cellColor);
    }

    if (alive) createDeadCells(x, y);
}


function getCellAtPosition(x, y, alive) {

    if (alive == null) {

        if (positionArray[x]) {
            var c = positionArray[x][y];
            return c;
        }
        //return cells.find(cell => cell.x === x && cell.y === y);

    } else {

        if (positionArray[x]) {
            var c = positionArray[x][y];
            if (c) {
                if (c.alive) return c;
                else return null;
            } else return null;
        }
        //return cells.find(cell => cell.x === x && cell.y === y && cell.alive === alive);

    }
}

function getCellAtPositionTest(x, y, alive) {

    const key = getKey(x, y);

    if (alive == null) {

        return positionArray.get(key);

    } else {


        var c = positionArray.get(key);

        if (c) {
            if (c.alive) return c;
            else return null;
        } else return null;

    }
}

function changeCell(x, y) {

    var c = getCellAtPosition(x, y);

    if (c) {
        c.alive = !c.alive;

        if (c.alive) {
            createDeadCells(x, y);
            c.color = cellColor;
        } else {
            c.color = null;
        }

    } else {
        setCell(x, y, true);
    }

}

function next() {

    if (cells.length > 0) {

        if (!currentPreset) {
            currentPreset = {
                cells: structuredClone(cells),
                cellColor: cellColor,
                backgroundColor: backgroundColor,
                scrollOffset: scrollOffset,
            }

            document.getElementById("reset_button").innerHTML = "Reset";
        }

        cells.forEach(cell => {

            var neighbors = 0;
            var c;
            var colors = [];
            var newColor = "";

            c = getCellAtPosition(cell.x + 1, cell.y, true);
            if (c) { neighbors++; if (c.color) colors.push(c.color) }

            c = getCellAtPosition(cell.x + 1, cell.y + 1, true);
            if (c) { neighbors++; if (c.color) colors.push(c.color) }

            c = getCellAtPosition(cell.x, cell.y + 1, true);
            if (c) { neighbors++; if (c.color) colors.push(c.color) }

            c = getCellAtPosition(cell.x - 1, cell.y + 1, true);
            if (c) { neighbors++; if (c.color) colors.push(c.color) }

            c = getCellAtPosition(cell.x - 1, cell.y, true);
            if (c) { neighbors++; if (c.color) colors.push(c.color) }

            c = getCellAtPosition(cell.x - 1, cell.y - 1, true);
            if (c) { neighbors++; if (c.color) colors.push(c.color) }

            c = getCellAtPosition(cell.x, cell.y - 1, true);
            if (c) { neighbors++; if (c.color) colors.push(c.color) }

            c = getCellAtPosition(cell.x + 1, cell.y - 1, true);
            if (c) { neighbors++; if (c.color) colors.push(c.color) }

            if (neighbors == 0) {
                cell.delete = true;
            } else if (cell.alive) {
                if (neighbors > 3) cell.changeState = true;
                if (neighbors < 2) cell.changeState = true;
            } else if (neighbors == 3) {
                cell.changeState = true;

                if (multiColorMode && colors.length == 3) {
                    newColor = mixColors(colors[0], colors[1], colors[2]);
                    cell.color = newColor;
                }
            }

        });

        cells.forEach(cell => {

            if (cell.delete) {
                //positionArray[cell.x][cell.y] = null;
                setPositionValue(cell.x, cell.y, null);


            } else {

                if (cell.changeState) {
                    cell.alive = !cell.alive;
                    cell.changeState = false;
                }

                if (cell.alive) {
                    createDeadCells(cell.x, cell.y);
                } else {
                    cell.color = null;
                }
            }
        });

        cells = cells.filter(cell => cell.delete === false);



        setResetButtonDisabled(false);

        generation++;
        document.getElementById("generation").innerHTML = "Generation: " + generation;
        draw();
    }
}

function setPositionValue(x, y, value) {
    positionArray[x][y] = null;
}

function setPositionValueTest(x, y, value) {
    const key = getKey(x, y);
    positionArray.set(key, value);
}


function mixColors(col1, col2, col3) {
    var color;

    color = hexToRgbArray(col1);
    var r1 = color[0];
    var g1 = color[1];
    var b1 = color[2];

    color = hexToRgbArray(col2);
    var r2 = color[0];
    var g2 = color[1];
    var b2 = color[2];

    color = hexToRgbArray(col3);
    var r3 = color[0];
    var g3 = color[1];
    var b3 = color[2];

    /*
    var r = Math.round((r1 + r2 + r3) / 3);
    var g = Math.round((g1 + g2 + g3) / 3);
    var b = Math.round((b1 + b2 + b3) / 3);
    */


    var r = Math.round(r1 + r2 + r3);
    var g = Math.round(g1 + g2 + g3);
    var b = Math.round(b1 + b2 + b3);

    if (r > 255) {
        var ratio = r / 255;
        r = 255;
        g = Math.floor(g / ratio);
        b = Math.floor(b / ratio);
    }

    if (g > 255) {
        var ratio = g / 255;
        g = 255;
        r = Math.floor(r / ratio);
        b = Math.floor(b / ratio);
    }

    if (b > 255) {
        var ratio = b / 255;
        b = 255;
        r = Math.floor(r / ratio);
        g = Math.floor(g / ratio);
    }


    if (r > 255) console.warn(r);

    var newColor = "#" + r.toString(16).padStart(2, "0") + g.toString(16).padStart(2, "0") + b.toString(16).padStart(2, "0");

    return newColor;


}

function hexToRgbArray(hex) {

    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}

function togglePlay() {
    var playButton = document.getElementById("play_button");

    if (playInterval) {
        clearInterval(playInterval);
        playInterval = null;
        document.getElementById("fps").innerHTML = "";
    } else {
        playInterval = setInterval(() => {

            const currentTime = performance.now();
            const deltaTime = currentTime - lastTime; // Time in milliseconds since last frame

            // Calculate instantaneous FPS
            // fps = 1000 / deltaTime; // This gives instantaneous FPS, which can fluctuate

            // Calculate average FPS over a period for a more stable reading
            frameCount++;
            if (deltaTime >= 1000) { // Check if at least 1 second has passed
                fps = (frameCount / deltaTime) * 1000; // Calculate average FPS for this second
                document.getElementById("fps").innerHTML = `FPS: ${fps.toFixed(2)}`;
                frameCount = 0;
                lastTime = currentTime;
            }

            next();

        }, 1000 / speed
        );
    }

    setPlayResetButtons();
}

function makeCell(e) {
    if (e.button == 0) {
        const rect = canvas.getBoundingClientRect(); // Get the size and position of the canvas relative to the viewport

        var posX = Math.floor((e.clientX - rect.left) / cellSize) + origin.x;
        var posY = Math.floor((e.clientY - rect.top) / cellSize) + origin.y;

        changeCell(posX, posY);

        draw();
    }

    currentPreset = null;
    document.getElementById("reset_button").innerHTML = "Clear";
    document.getElementById("preset_select").selectedIndex = 0;

    generation = 0;
    setInputs();
}

function setCellPosition(cell) {

    if (positionArray[cell.x] == null) {
        positionArray[cell.x] = [];
    }

    if (positionArray[cell.x][cell.y] == null) {
        positionArray[cell.x][cell.y] = cell;
    }
}


function setCellPositionTest(cell) {

    const key = getKey(cell.x, cell.y);
    if (positionArray.get(key) == null) {
        positionArray.set((key), cell);
    }
}


function createRandomCells() {


    for (var i = 0; i < (canvas.width * canvas.height) / (cellSize * cellSize * 4); i++) {
        var x = Math.floor(Math.random() * canvas.width / cellSize) + origin.x;
        var y = Math.floor(Math.random() * canvas.height / cellSize) + origin.y;

        changeCell(x, y);
        var c = getCellAtPosition(x, y);
        if (c) {
            var r = (Math.round(Math.random() * 255)).toString(16).padStart(2, "0");
            var g = (Math.round(Math.random() * 255)).toString(16).padStart(2, "0");
            var b = (Math.round(Math.random() * 255)).toString(16).padStart(2, "0");
            c.color = "#" + r + g + b;
        }
    }


    currentPreset = null;
    document.getElementById("reset_button").innerHTML = "Clear";
    document.getElementById("preset_select").selectedIndex = 0;
    setNextButtonsDisabled(false);
    generation = 0;
    setInputs();
    draw();
}



function download() {
    presetName = document.getElementById("preset_name").value;

    var tempCells = structuredClone(cells);
    cells = cells.filter(cell => cell.alive === true);
    let values = { presetName, cellSize, cellColor, backgroundColor, scrollOffset, cells };
    cells = structuredClone(tempCells);

    const jsonString = JSON.stringify(values, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;

    var name = presetName;
    if (name == "") name = "download";
    a.download = name + ".json";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function fileUpload() {

    var file_upload = document.getElementById('file_upload');
    file_upload.click();
}

function setOrigin() {

    sizeOffset.x = Math.round(((canvas.width / defaultCellSize) - (canvas.width / cellSize)) / 2);
    sizeOffset.y = Math.round(((canvas.height / defaultCellSize) - (canvas.height / cellSize)) / 2);

    origin.x = scrollOffset.x + sizeOffset.x + screenOffset.x;
    origin.y = scrollOffset.y + sizeOffset.y + screenOffset.y;

}

window.addEventListener('wheel', (event) => {

    if (isMouseInside) {

        if (event.deltaY > 0) {

            changeInput({
                id: "zoom",
                value: (cellSize - 1) * 100 / defaultCellSize,
                min: document.getElementById("zoom").min,
                max: document.getElementById("zoom").max
            });

        } else if (event.deltaY < 0) {

            changeInput({
                id: "zoom",
                value: (cellSize + 1) * 100 / defaultCellSize,
                min: document.getElementById("zoom").min,
                max: document.getElementById("zoom").max
            });
        }
    }
});

document.onkeydown = function (e) {


    if (e.ctrlKey || e.metaKey) {

        if (e.key == "ArrowUp") {
            clearPositionArray();
            cells.forEach(cell => {
                cell.y--;
                setCellPosition(cell);
            });
            draw();
        }

        if (e.key == "ArrowDown") {
            clearPositionArray();
            cells.forEach(cell => {
                cell.y++;
                setCellPosition(cell);
            });
            draw();
        }

        if (e.key == "ArrowLeft") {
            clearPositionArray();
            cells.forEach(cell => {
                cell.x--;
                setCellPosition(cell);
            });
            draw();
        }

        if (e.key == "ArrowRight") {
            clearPositionArray();
            cells.forEach(cell => {
                cell.x++;
                setCellPosition(cell);
            });
            draw();
        }

    } else {

        if (e.key == "ArrowUp") {
            scrollOffset.y--;
            setOrigin();
            setInputs();
            draw();
        }

        if (e.key == "ArrowDown") {
            scrollOffset.y++;
            setOrigin();
            setInputs();
            draw();
        }

        if (e.key == "ArrowLeft") {
            scrollOffset.x--;
            setOrigin();
            setInputs();
            draw();
        }

        if (e.key == "ArrowRight") {
            scrollOffset.x++;
            setOrigin();
            setInputs();
            draw();
        }
    }
}

function resetView() {
    cellSize = defaultCellSize;
    origin.x = 0;
    origin.y = 0;
    sizeOffset.x = 0;
    sizeOffset.y = 0;
    scrollOffset.x = 0;
    scrollOffset.y = 0;

    setOrigin();
    setInputs();
    draw();
}


function reset() {
    if (currentPreset) {

        cells = structuredClone(currentPreset.cells);
        cellColor = currentPreset.cellColor;
        backgroundColor = currentPreset.backgroundColor;
        scrollOffset = currentPreset.scrollOffset;
        if (currentPreset.presetName) presetName = currentPreset.presetName;

        currentPreset = null;

        clearPositionArray();

        cells.forEach(cell => {
            setCellPosition(cell);
        });

        if (playInterval) togglePlay();

        setNextButtonsDisabled(false);

        setOrigin();
        draw();


    } else {
        clearCells();
    }

    generation = 0;
    document.getElementById("reset_button").innerHTML = "Clear";
    setInputs();
}

function clearCells() {
    presetName = "";
    cells = [];
    currentPreset = null;
    clearPositionArray();
    document.getElementById("preset_select").selectedIndex = 0;
    document.getElementById("preset_name").value = "";
    draw();

    generation = 0;
    setInputs();

    setNextButtonsDisabled(true);

    if (playInterval) togglePlay();

    setResetButtonDisabled(true);
}

function defaultColors() {
    cellColor = defaultCellColor;
    backgroundColor = defaultBackgroundColor;
    setInputs();
    draw();
}

function setNextButtonsDisabled(value) {

    document.getElementById("next_button").disabled = value;
    document.getElementById("play_button").disabled = value;
    setPlayResetButtons();
}

function setPlayResetButtons() {

    var nextButton = document.getElementById("next_button");
    var nextButtonIcon = document.getElementById("next_button_icon");
    var playButton = document.getElementById("play_button");
    var playButtonText = document.getElementById("play_button_text");
    var playButtonIcon = document.getElementById("play_button_icon");
    var resetButton = document.getElementById("reset_button");

    if (nextButton.disabled) {
        nextButton.style.color = "#00000080";
        nextButton.style.backgroundColor = "#e0e0e080";
        nextButtonIcon.style.color = "#00000080";
    } else {
        nextButton.style.color = "#000000";
        nextButton.style.backgroundColor = "var(--default-button-color";
        nextButtonIcon.style.color = "#000080";
    }

    if (playButton.disabled) {
        playButton.style.backgroundColor = "#e0e0e080";
        playButton.style.color = "#00000080";
        playButtonIcon.style.color = "#00000080";

        if (playInterval) {
            playButtonText.innerHTML = "Stop";
            playButtonIcon.innerHTML = "&#9209;";
        } else {
            playButtonText.innerHTML = "Play"
            playButtonIcon.innerHTML = "&#9658;";
        }

        //Play &#9658;
        //Stop &#9209;
    } else {
        playButton.style.backgroundColor = "var(--default-button-color";
        playButton.style.color = "#000000";

        if (playInterval) {
            playButtonText.innerHTML = "Stop";
            playButtonIcon.innerHTML = "&#9209;";
            playButtonIcon.style.color = "#800000";
        } else {
            playButtonText.innerHTML = "Play";
            playButtonIcon.innerHTML = "&#9658;";
            playButtonIcon.style.color = "#008000";
        }
    }

    if (resetButton.disabled) {
        resetButton.style.backgroundColor = "#e0e0e080";
        resetButton.style.color = "#00000080";
    } else {
        resetButton.style.backgroundColor = "var(--default-button-color";
        resetButton.style.color = "#000000";
    }
}

function setResetButtonDisabled(value) {

    document.getElementById("reset_button").disabled = value
    setPlayResetButtons();
}

function helpClicked() {
    document.getElementById("overlay").style.display = "revert";
    document.getElementById("help_div").style.display = "revert";
    if (playInterval) togglePlay();
}

function closeHelp() {

    document.getElementById("overlay").style.display = "none";
    document.getElementById("help_div").style.display = "none";
}

function clearPositionArray() {
    //positionArray.clear();
    positionArray = [];
}

function getKey(x, y) {
    return `${x},${y}`;
}




