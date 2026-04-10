let canvas, ctx, defaultCanvasSize, centerX, centerY, preset, number, circleSize, outlineSize, circleColor, outlineColor, imageName, angle, distance, separation, numCircles, numStep, valueArray, undoIndex, speed, runInterval, presetArray;

function load() {

    valueArray = [];
    undoIndex = 0;
    canvas = document.getElementById("canvas");
    defaultCanvasSize = 800;
    canvas.width = defaultCanvasSize;
    canvas.height = defaultCanvasSize;
    ctx = canvas.getContext("2d");
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
    angle = 0;
    distance = 0;

    setDefaults();
    setPresets();

    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {

            canvas.width = entry.contentRect.width - 4;
            canvas.height = entry.contentRect.height - 4;
            centerX = canvas.width / 2;
            centerY = canvas.height / 2;
            var min = Math.min(...[canvas.width, canvas.height]);
            scale = min / defaultCanvasSize;
            draw();
        }
    });

    var canvas_wrapper = document.getElementById("canvas_wrapper");
    resizeObserver.observe(canvas_wrapper);

    document.getElementById("number").title = "Enter a number or math expression";
    document.getElementById("number_label").title = "Enter a number or math expression";

    const fileInput = document.getElementById('file_upload');

    fileInput.addEventListener('change', (event) => {
        var file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                try {
                    const values = JSON.parse(e.target.result);
                    imageName = values.imageName;
                    number = values.number;
                    separation = values.separation;
                    circleSize = values.circleSize;
                    outlineSize = values.outlineSize;
                    numCircles = values.numCircles;
                    circleColor = values.circleColor;
                    outlineColor = values.outlineColor;
                    backgroundColor = values.backgroundColor;
                    preset = "None";

                    setInputs();
                    draw();

                    fileInput.value = null;

                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            };

            reader.readAsText(file); // Read the file content as text
        }

    });
}

function setDefaults() {

    preset = "None";
    number = 0;
    separation = 1;
    numCircles = 300;
    circleSize = 15;
    outlineSize = 2;
    circleColor = "#0000ff";
    outlineColor = "#000000";
    backgroundColor = "#f8f8f8";
    speed = 2;
    imageName = "";
    numStep = 0.0005;
    scale = 1;

    addValues();
    setInputs();
    clearInterval(runInterval);
    runInterval = null;
    document.getElementById("run_button").innerHTML = "Run";
}

function setInputs() {

    document.getElementById("preset").value = preset;
    document.getElementById("number").value = number;
    document.getElementById("number").step = numStep;
    document.getElementById("separation").value = separation;
    document.getElementById("circle_size").value = circleSize;
    document.getElementById("outline_size").value = outlineSize;
    document.getElementById("num_circles").value = numCircles;
    document.getElementById("circle_color").value = circleColor;
    document.getElementById("outline_color").value = outlineColor;
    document.getElementById("background_color").value = backgroundColor;
    document.getElementById("run_step").value = Math.round(speed);
    document.getElementById("image_name").value = imageName;

    draw();
}

function draw() {

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    distance = 0;
    angle = 0;


    for (var i = 0; i <= numCircles; i++) {

        ctx.fillStyle = circleColor;
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = outlineSize;

        distance += separation * scale;

        x = centerX + distance * Math.cos(angle);
        y = centerY + distance * Math.sin(angle);

        ctx.beginPath();
        ctx.arc(x, y, circleSize * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        angle += Math.PI * 2 * number;


        if (number == 0.67 || number == 67) {
            ctx.font = "20px Arial";
            ctx.fillText("67 lol", 10, 20);
        }

        if (number == 0.69 || number == 69) {
            ctx.font = "20px Arial";
            ctx.fillText("NICE!", 10, 20);
        }
    }
}

function setPresets() {
    presetArray = [];

    presetArray.push({
        preset: "Golden Ratio",
        number: (Math.sqrt(5) + 1) / 2,
        separation: 0.2,
        numCircles: 1800,
        circleSize: 12,
        outlineSize: 2,
        circleColor: "#ffd700",
        outlineColor: "#000000",
        backgroundColor: "#c4c4c4"
    });

    presetArray.push({
        preset: "1/PI",
        number: 1 / Math.PI,
        separation: 1,
        numCircles: 350,
        circleSize: 10,
        outlineSize: 2,
        circleColor: "#00ff00",
        outlineColor: "#000000",
        backgroundColor: "#98f8ff"
    });

    presetArray.push({
        preset: "Square root of 2",
        number: Math.sqrt(2),
        separation: 3,
        numCircles: 110,
        circleSize: 25,
        outlineSize: 2,
        circleColor: "#ff0000",
        outlineColor: "#000000",
        backgroundColor: "#222222"
    });

    var preset_select = document.getElementById("preset");

    presetArray.forEach(p => {
        var option = document.createElement("option");
        preset_select.append(option);
        option.value = p.preset;
        option.innerHTML = p.preset;
    });
}

function getPreset(preset_name) {

    if (preset_name == "None") {
        setDefaults();
    } else {
        var values = presetArray.find(p => p.preset === preset_name);

        preset = values.preset;
        number = values.number;
        separation = values.separation;
        numCircles = values.numCircles;
        circleSize = values.circleSize;
        outlineSize = values.outlineSize;
        circleColor = values.circleColor;
        outlineColor = values.outlineColor;
        backgroundColor = values.backgroundColor;
    }

}

function presetChange(value) {

    preset = value;
    getPreset(value);
    draw();
    setInputs();
}

function numChange(value) {

    try {
        let expression = value;
        number = math.evaluate(expression);
    } catch (error) {
        number = parseFloat(value);
        if (isNaN(number)) {
            number = 0;
        }
    }

    resetPreset();
    draw();
}

function separationChange(value) {

    separation = parseFloat(value);
    resetPreset();
    draw();
}

function circleSizeChange(value) {
    circleSize = parseFloat(value);
    resetPreset();
    draw();
}

function outlineSizeChange(value) {
    outlineSize = parseFloat(value);
    resetPreset();
    draw();
}

function circleColorChange(value) {
    circleColor = value;
    resetPreset();
    draw();
}

function outlineColorChange(value) {
    outlineColor = value;
    resetPreset();
    draw();
}

function numCirclesChange(value) {
    numCircles = parseInt(value);
    resetPreset();
    draw();
}

function backgroundColorChange(value) {
    backgroundColor = value;
    resetPreset();
    draw();
}

function speedChange(value) {
    speed = parseFloat(value);
}

function imageNameChange(value) {
    imageName = value;
}

function undo() {
    if (undoIndex > 0) {

        undoIndex--;

        getValues();
        setInputs();
        setButtons();
    }
}

function redo() {
    if (undoIndex < valueArray.length - 1) {
        undoIndex++;

        getValues();
        setInputs();
        setButtons();
    }
}

function resetPreset() {

    preset = "None";
    document.getElementById("preset").value = preset;
}

function addValues() {

    valueArray.splice(undoIndex + 1, valueArray.length - undoIndex + 1);

    valueArray.push({
        preset: preset,
        number: number,
        separation: separation,
        circleSize: circleSize,
        outlineSize: outlineSize,
        numCircles: numCircles,
        circleColor: circleColor,
        outlineColor: outlineColor,
        backgroundColor: backgroundColor,
        speed: speed
    });

    undoIndex = valueArray.length - 1;

    setButtons();


    if (valueArray.length > 100) {
        valueArray.splice(0, 1);
    }
}

function setButtons() {
    if (undoIndex > 0) {
        document.getElementById("undo_button").disabled = false;
    } else {
        document.getElementById("undo_button").disabled = true;
    }

    if (undoIndex < valueArray.length - 1) {
        document.getElementById("redo_button").disabled = false;
    } else {
        document.getElementById("redo_button").disabled = true;
    }
}

function getValues() {
    var values = valueArray[undoIndex];
    preset = values.preset;
    number = values.number;
    separation = values.separation;
    circleSize = values.circleSize;
    outlineSize = values.outlineSize;
    numCircles = values.numCircles;
    circleColor = values.circleColor;
    outlineColor = values.outlineColor;
    backgroundColor = values.backgroundColor;
    speed = values.speed
}

function run() {

    if (!runInterval) {

        runInterval = setInterval(
            function () {
                number += speed / 100000;
                number = Math.round(number * 100000) / 100000;

                draw();
                document.getElementById("number").value = number;
                addValues();

            }, 1000 / 60
        );
        document.getElementById("run_button").innerHTML = "Stop";

    } else {
        clearInterval(runInterval);
        runInterval = null;
        document.getElementById("run_button").innerHTML = "Run";
    }
}

function saveImage() {
    let imageDataURL = canvas.toDataURL('image/png');
    let downloadLink = document.createElement('a');
    downloadLink.href = imageDataURL;
    downloadLink.download = document.getElementById("image_name").value;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function setNumber() {
    document.getElementById("number").value = number;
}

function downloadValues() {
    let values = { imageName, number, separation, circleSize, outlineSize, numCircles, circleColor, outlineColor, backgroundColor };
    const jsonString = JSON.stringify(values, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;

    var name = document.getElementById("image_name").value;
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

function randomValues() {

    number = Math.random();
    separation = Math.round(Math.random() * 20);
    numCircles = Math.round(Math.random() * 1000);
    circleSize = Math.round(Math.random() * 100);
    outlineSize = Math.round(Math.random() * 8);

    const letters = '0123456789ABCDEF';

    circleColor = '#';
    for (let i = 0; i < 6; i++) {
        circleColor += letters[Math.floor(Math.random() * 16)];
    }

    outlineColor = '#';
    for (let i = 0; i < 6; i++) {
        outlineColor += letters[Math.floor(Math.random() * 16)];
    }

    backgroundColor = '#';
    for (let i = 0; i < 6; i++) {
        backgroundColor += letters[Math.floor(Math.random() * 16)];
    }

    addValues();
    setInputs();
    draw();
}

document.addEventListener('keydown', function (event) {

    if ((event.ctrlKey || event.metaKey) && event.key === 'z') {

        event.preventDefault();
        undo();
    }
});

document.addEventListener('keydown', function (event) {

    if ((event.ctrlKey || event.metaKey) && event.key === 'y') {

        event.preventDefault();
        redo();
    }
});





