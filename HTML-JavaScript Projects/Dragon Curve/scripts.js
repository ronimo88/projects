let canvas, ctx, lines, lineLength, lineWidth, repeat, lineColor, backgroundColor, minPadding, preset, offset, rotation, startRotation;

class line {
    constructor(rotation) {

        this.rotation = rotation;

        this.position = {
            x: 0,
            y: 0
        };
    }
}

function load() {

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = 1200;
    canvas.height = 800;

    setDefaults();
    calculate();
}

function setDefaults() {

    preset = 3;

    lineColor = "#000000";
    backgroundColor = "#e0e0e0";

    inputChange({
        id: "preset",
        value: preset
    })

    minPadding = 10;

    setInputs();
}

function setInputs() {

    document.getElementById("preset").value = preset;
    document.getElementById("repeat").value = repeat;
    document.getElementById("lineLength").value = lineLength;
    document.getElementById("lineWidth").value = lineWidth;
    document.getElementById("lineColor").value = lineColor;
    document.getElementById("backgroundColor").value = backgroundColor;
    document.getElementById("rotation").value = startRotation;
}

function inputChange(input) {

    var id = input.id;

    if (id == "preset") {
        preset = input.value;

        if (preset == 1) {
            lineLength = 64;
            lineWidth = 16;
            repeat = 8;
            startRotation = 45;
        }

        if (preset == 2) {
            lineLength = 16;
            lineWidth = 4;
            repeat = 12;
            startRotation = 45;
        }

        if (preset == 3) {
            lineLength = 4;
            lineWidth = 2;
            repeat = 16;
            startRotation = 45;
        }

        if (preset == 4) {
            lineLength = 1;
            lineWidth = 1;
            repeat = 20;
            startRotation = 45;
        }

        setInputs();
        calculate();
    }

    if (id == "repeat") {
        var min = input.min;
        var max = input.max;
        repeat = Math.min(Math.max(input.value, min), max);
        input.value = repeat;
        calculate();
    }

    if (id == "lineLength") {
        var min = input.min;
        var max = input.max;
        lineLength = Math.min(Math.max(input.value, min), max);
        input.value = lineLength;
        calculate();
    }

    if (id == "lineWidth") {
        var min = input.min;
        var max = input.max;
        lineWidth = Math.min(Math.max(input.value, min), max);
        input.value = lineWidth;
        calculate();
    }

    if (id == "rotation") {
        startRotation = parseInt(input.value);
        rotation = startRotation;
        calculate();
    }

    if (id == "lineColor") {
        lineColor = input.value;
        draw();
    }

    if (id == "backgroundColor") {
        backgroundColor = input.value;
        draw();
    }
}

function calculate() {

    rotation = startRotation;

    lines = [];
    lines.push(new line(rotation));

    for (var i = 0; i < repeat - 1; i++) {

        var newLines = structuredClone(lines);

        for (var j = 0; j < newLines.length; j++) {

            newLines[j].rotation += 90;
            if (newLines[j].rotation >= 360 + startRotation) newLines[j].rotation = startRotation;
        }

        newLines.reverse();

        for (var k = 0; k < newLines.length; k++) {
            lines.push(newLines[k]);
        }
    }

    var x = 0;
    var y = 0;

    var xMax = 0;
    var yMax = 0;
    var xMin = 0;
    var yMin = 0;

    lines.forEach(line => {

        const radians = line.rotation * Math.PI / 180;

        x += Math.cos(radians) * lineLength;
        y -= Math.sin(radians) * lineLength;

        line.position = { x, y };

        if (line.position.x > xMax) xMax = line.position.x;
        if (line.position.y > yMax) yMax = line.position.y;
        if (line.position.x < xMin) xMin = line.position.x;
        if (line.position.y < yMin) yMin = line.position.y;
    });

    const padding = minPadding + lineWidth;

    canvas.width = xMax - xMin + padding * 2;
    canvas.height = yMax - yMin + padding * 2;

    offset = {
        x: padding - xMin,
        y: padding - yMin
    }

    draw();
}

function draw() {

    ctx.fillStyle = backgroundColor;
    ctx.lineWidth = lineWidth;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.moveTo(offset.x, offset.y);

    lines.forEach(line => {
        ctx.lineTo(line.position.x + offset.x, line.position.y + offset.y);
    });

    ctx.strokeStyle = lineColor;
    ctx.stroke();
}

function downloadImage() {
    const canvas = document.getElementById('canvas');

    canvas.toBlob((blob) => {
        if (blob) {
            download(blob);
        }
    });
}

async function download(blob) {

    try {
        const options = {
            suggestedName: 'Dragon Curve',
            startIn: "downloads",
            types: [
                {
                    description: 'PNG Image',
                    accept: {
                        'image/png': ['.png'],
                    },
                },
                {
                    description: 'JPG Image',
                    accept: {
                        'image/jpg': ['.jpg'],
                    },
                },
                {
                    description: 'All Image Files',
                    accept: {
                        'image/*': ['.png', '.jpeg', '.jpg', '.gif'],
                    },
                },
            ],
        };

        const handle = await window.showSaveFilePicker(options);
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        alert('Image saved successfully!');

    } catch (err) {
        
        console.error('Image save failed or was cancelled:', err);
    }
}


