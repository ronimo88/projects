let color, closestColor, ctx, pointWidth, pointHeight, step, xAxis, yAxis, dragging, filterColorNames, colors, canvasX, canvasY;

function load() {

    color = new colorObj(0, 0, 0, 1);
    red_input.value = red_range.value;
    green_input.value = green_range.value;
    blue_input.value = blue_range.value;
    ctx = canvas.getContext("2d");
    canvas.width = 300;
    canvas.height = 300;
    step = 1;
    xAxis = "red";
    yAxis = "green";
    filterColorNames = false;

    canvas.onmousedown = function (e) {
        dragging = true;
        canvas.style.cursor = "none";
        canvasClicked(e.clientX, e.clientY);
    }

    document.onmousemove = function (e) {
        if (dragging) {
            canvas.style.cursor = "none";
            canvasClicked(e.clientX, e.clientY);
        }
    }

    document.onmouseup = function (e) {
        dragging = false;
        canvas.style.cursor = "crosshair";
    }

    document.addEventListener('keydown', function (event) {
        if (document.activeElement === canvas) {

            var _step = step;
            var xMax = 255;
            var yMax = 255;

            if (xAxis == "hue") {
                xMax = 359;
                _step = 1;
            }
            if (xAxis == "saturation") {
                xMax = 100;
                _step = 1;
            }
            if (xAxis == "lightness") {
                xMax = 100;
                _step = 1;
            }

            if (yAxis == "hue") {
                yMax = 359;
                _step = 1;
            }
            if (yAxis == "saturation") {
                yMax = 100;
                _step = 1
            }
            if (yAxis == "lightness") {
                yMax = 100;
                _step = 1;
            }

            if (event.key === "ArrowLeft") {

                canvasX -= _step * canvas.width / xMax;
                canvasClicked(canvasX, canvasY);
                event.preventDefault();
            }

            if (event.key === "ArrowRight") {

                canvasX += _step * canvas.width / xMax;
                canvasClicked(canvasX, canvasY);
                event.preventDefault();
            }

            if (event.key === "ArrowUp") {

                canvasY -= _step * canvas.width / xMax;
                canvasClicked(canvasX, canvasY);
                event.preventDefault();
            }

            if (event.key === "ArrowDown") {

                canvasY += _step * canvas.width / xMax;
                canvasClicked(canvasX, canvasY);
                event.preventDefault();
            }
        }

    });

    colors = [];

    ntc.names.forEach(color => {
        colors.push(color);
    });

    colors.sort((a, b) => {
        const nameA = a[1].toLowerCase();
        const nameB = b[1].toLowerCase();

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0; // names are equal
    });

    colors.forEach(color => {
        var option = document.createElement("option");
        option.innerHTML = color[1];
        color_select.appendChild(option);

    });

    color_select.selectedIndex = -1;
    color_select.title = "Select Color";


    colorUpdate();
}

const toRGBArray = rgbStr => rgbStr.match(/\d+/g).map(Number);

function canvasClicked(xPos, yPos) {
    const rect = canvas.getBoundingClientRect();
    const x = xPos - rect.left;
    const y = yPos - rect.top;

    canvasX = xPos;
    canvasY = yPos;
    console.log(canvasX);

    var xMax = 255;
    var yMax = 255;
    var mode = "rgb";

    var _step = step;

    if (xAxis == "hue") {
        xMax = 359;
        mode = "hsl";
        _step = 1;
    }
    if (xAxis == "saturation") {
        xMax = 100;
        _step = 1;
        mode = "hsl";
    }
    if (xAxis == "lightness") {
        xMax = 100;
        _step = 1;
        mode = "hsl";
    }

    if (yAxis == "hue") {
        yMax = 359;
        _step = 1;
        mode = "hsl";
    }
    if (yAxis == "saturation") {
        yMax = 100;
        _step = 1
        mode = "hsl";
    }
    if (yAxis == "lightness") {
        yMax = 100;
        _step = 1;
        mode = "hsl";
    }

    var xColor = Math.round(x * xMax / canvas.width / _step) * _step;
    var yColor = Math.round(y * yMax / canvas.height / _step) * _step;

    xColor = Math.round(Math.min(Math.max(xColor, 0), xMax));
    yColor = yMax - (Math.round(Math.min(Math.max(yColor, 0), yMax)));

    if (xAxis == "red") color.red = xColor;
    if (xAxis == "green") color.green = xColor;
    if (xAxis == "blue") color.blue = xColor;

    if (yAxis == "red") color.red = yColor;
    if (yAxis == "green") color.green = yColor;
    if (yAxis == "blue") color.blue = yColor;

    if (xAxis == "hue") color.hue = xColor;
    if (xAxis == "saturation") color.saturation = xColor;
    if (xAxis == "lightness") color.lightness = xColor;

    if (yAxis == "hue") color.hue = yColor;
    if (yAxis == "saturation") color.saturation = yColor;
    if (yAxis == "lightness") color.lightness = yColor;

    if (mode == "rgb") color.rgbToHsl();
    else color.hslToRgb();

    colorUpdate();
}

function colorRangeRGBChange() {

    color.red = Math.round(Math.min(Math.max(red_range.value, 0), 255));
    color.green = Math.round(Math.min(Math.max(green_range.value, 0), 255));
    color.blue = Math.round(Math.min(Math.max(blue_range.value, 0), 255));

    color.rgbToHsl();
    colorUpdate();
}

function colorInputRGBChange() {

    color.red = Math.round(Math.min(Math.max(red_input.value, 0), 255));
    color.green = Math.round(Math.min(Math.max(green_input.value, 0), 255));
    color.blue = Math.round(Math.min(Math.max(blue_input.value, 0), 255));
    color.rgbToHsl();
    colorUpdate();
}

function colorRangeHSLChange() {

    color.hue = Math.round(Math.min(Math.max(hue_range.value, 0), 359));
    color.saturation = Math.round(Math.min(Math.max(saturation_range.value, 0), 100));
    color.lightness = Math.round(Math.min(Math.max(lightness_range.value, 0), 100));

    color.hslToRgb();
    colorUpdate();
}

function colorInputHSLChange() {

    color.hue = Math.round(Math.min(Math.max(hue_input.value, 0), 359));
    color.saturation = Math.round(Math.min(Math.max(saturation_input.value, 0), 100));
    color.lightness = Math.round(Math.min(Math.max(lightness_input.value, 0), 100));
    color.hslToRgb();
    colorUpdate();
}

function colorUpdate() {

    hex_input.value = color.toHexString();
    rgb_display.innerHTML = color.toRGBString();
    var col = color.toRGBString();
    color_display.style.backgroundColor = col;

    red_input.value = color.red;
    green_input.value = color.green;
    blue_input.value = color.blue;

    red_range.value = color.red;
    green_range.value = color.green;
    blue_range.value = color.blue;

    hue_input.value = color.hue;
    saturation_input.value = color.saturation;
    lightness_input.value = color.lightness;

    hue_range.value = color.hue;
    saturation_range.value = color.saturation;
    lightness_range.value = color.lightness;

    document.documentElement.style.setProperty("--red_range_color", color.redRGB());
    document.documentElement.style.setProperty("--green_range_color", color.greenRGB());
    document.documentElement.style.setProperty("--blue_range_color", color.blueRGB());
    document.documentElement.style.setProperty("--hue_range_color", color.hueHSL());
    document.documentElement.style.setProperty("--saturation_range_color", color.saturationHSL());
    document.documentElement.style.setProperty("--lightness_range_color", color.lightnessHSL());

    var col = new colorObj();
    col.setHSL(color.hue, 100, 50);
    document.documentElement.style.setProperty("--max_saturation_color", col.toRGBString());

    col.setHSL(color.hue, 100, 50);
    document.documentElement.style.setProperty("--mid_lightness_color", col.toRGBString());


    red_range.step = step;
    green_range.step = step;
    blue_range.step = step;

    red_input.step = step;
    green_input.step = step;
    blue_input.step = step;

    setColorName();
    setCanvas();
}

function setColorName() {

    var nameArray = ntc.name(color.toHexString());
    var hex = nameArray[0];
    var name = nameArray[1];

    if (color.toHexString() == hex) {
        color_name.innerHTML = "";
        color_name.style.textDecoration = "none";
        color_name.style.cursor = "revert";
        color_name.onClick = ""
        closestColor = color;
        color_select.value = name;

    } else {
        color_name.innerHTML = "Closest Name:<br>" + name;
        color_name.style.textDecoration = "underline";
        color_name.style.cursor = "pointer";
        color_name.onclick = clickClosestColor;
        closestColor = hexToColor(hex);
        color_select.selectedIndex = -1;
    }
}

function hexChange() {
    var col = hexToRgb(hex_input.value);

    if (col != null) {

        var rgbArray = toRGBArray(col);
        color.red = rgbArray[0];
        color.green = rgbArray[1];
        color.blue = rgbArray[2];
        color.rgbToHsl();
        colorUpdate();

    } else {

        hex_input.value = rgbToHex(color.toRGBString());
    }
}

function checkHexInput() {
    if (!hex_input.value.includes("#")) hex_input.value = "#" + hex_input.value;
}

function rgbToHex(colorString) {
    let r, g, b, a;

    const rgbMatch = colorString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    const rgbaMatch = colorString.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/);

    if (rgbMatch) {
        r = parseInt(rgbMatch[1]);
        g = parseInt(rgbMatch[2]);
        b = parseInt(rgbMatch[3]);
        a = 1;
    } else if (rgbaMatch) {
        r = parseInt(rgbaMatch[1]);
        g = parseInt(rgbaMatch[2]);
        b = parseInt(rgbaMatch[3]);
        a = parseFloat(rgbaMatch[4]);
    } else {
        return null; // Invalid color string format
    }

    function componentToHex(c) {
        const hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }

    const hexR = componentToHex(r);
    const hexG = componentToHex(g);
    const hexB = componentToHex(b);

    let hexA = '';
    if (a !== undefined && a !== 1) {
        const alphaInt = Math.round(a * 255);
        hexA = componentToHex(alphaInt);
    }

    return `#${hexR}${hexG}${hexB}${hexA}`.toUpperCase();
}

function hexToRgb(hex) {
    let r = 0, g = 0, b = 0;

    // Handle 3-digit shorthand hex (e.g., #F00)
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    }
    // Handle 6-digit hex (e.g., #FF0000)
    else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    } else {
        // Handle invalid hex input or other formats
        console.warn("Invalid hex color format. Please use #RGB or #RRGGBB.");
        return null;
    }

    return `rgb(${r}, ${g}, ${b})`;
}

function hexToColor(hex) {
    let r = 0, g = 0, b = 0;

    // Handle 3-digit shorthand hex (e.g., #F00)
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    }
    // Handle 6-digit hex (e.g., #FF0000)
    else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    } else {
        // Handle invalid hex input or other formats
        console.warn("Invalid hex color format. Please use #RGB or #RRGGBB.");
        return null;
    }

    return new colorObj(r, g, b, 1);
}

function rgbToColor(colorString) {
    let r, g, b, a;

    const rgbMatch = colorString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    const rgbaMatch = colorString.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/);

    if (rgbMatch) {
        r = parseInt(rgbMatch[1]);
        g = parseInt(rgbMatch[2]);
        b = parseInt(rgbMatch[3]);
        a = 1;
    } else if (rgbaMatch) {
        r = parseInt(rgbaMatch[1]);
        g = parseInt(rgbaMatch[2]);
        b = parseInt(rgbaMatch[3]);
        a = parseFloat(rgbaMatch[4]);
    } else {
        return null; // Invalid color string format
    }

    return new colorObj(r, g, b, 1);
}

function setCanvas() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var r, b, g, h, s, l, xPos, yPos;

    var minStep = step;
    if (minStep < 2) minStep = 2;

    var xMax = 255;
    var yMax = 255;

    if (xAxis == "hue") {
        xMax = 359;
        minStep = 2;
    }
    if (xAxis == "saturation") {
        xMax = 100;
        minStep = 2;
    }
    if (xAxis == "lightness") {
        xMax = 100;
        minStep = 2;
    }

    if (yAxis == "hue") {
        yMax = 359;
        minStep = 2;
    }
    if (yAxis == "saturation") {
        yMax = 100;
        minStep = 2;
    }
    if (yAxis == "lightness") {
        yMax = 100;
        minStep = 2;
    }

    pointWidth = canvas.width / xMax;
    pointHeight = canvas.height / yMax;

    for (var i = 0; i < xMax + minStep; i += minStep) {

        for (var j = 0; j < yMax + minStep; j += minStep) {

            if (xAxis == "red") {
                r = i;
                xPos = color.red;

                if (yAxis == "green") {
                    g = j;
                    b = color.blue;
                    yPos = color.green;
                }

                if (yAxis == "blue") {
                    b = j;
                    g = color.green;
                    yPos = color.blue;
                }
            }

            if (xAxis == "green") {
                g = i;
                xPos = color.green;

                if (yAxis == "red") {
                    r = j;
                    b = color.blue;
                    yPos = color.red;
                }

                if (yAxis == "blue") {
                    b = j;
                    r = color.red;
                    yPos = color.blue;
                }
            }

            if (xAxis == "blue") {
                b = i;
                xPos = color.blue;

                if (yAxis == "red") {
                    r = j;
                    g = color.green;
                    yPos = color.red;
                }

                if (yAxis == "green") {
                    g = j;
                    r = color.red;
                    yPos = color.green;
                }
            }

            if (xAxis == "hue") {
                h = i;
                xPos = color.hue;

                if (yAxis == "saturation") {
                    s = j;
                    l = color.lightness;
                    yPos = color.saturation;
                }

                if (yAxis == "lightness") {
                    l = j;
                    s = color.saturation;
                    yPos = color.lightness;
                }
            }


            if (xAxis == "saturation") {
                s = i;
                xPos = color.saturation;

                if (yAxis == "hue") {
                    h = j;
                    l = color.lightness;
                    yPos = color.hue;
                }

                if (yAxis == "lightness") {
                    l = j;
                    h = color.hue;
                    yPos = color.lightness;
                }
            }


            if (xAxis == "lightness") {
                l = i;
                xPos = color.lightness;

                if (yAxis == "hue") {
                    h = j;
                    s = color.saturation;
                    yPos = color.hue;
                }

                if (yAxis == "saturation") {
                    s = j;
                    h = color.hue;
                    yPos = color.saturation;
                }
            }

            if (filterColorNames) {
                if (xAxis == "red" || xAxis == "green" || xAxis == "blue") {
                    var col = "rgb(" + r + "," + g + "," + b + ")";
                } else {
                    var c = new color();
                    c.setHSL(h, s, l);
                    var col = c.toHexString();
                }

                col = rgbToHex(col);

                var closest = hexToRgb(ntc.name(col)[0]);
                ctx.fillStyle = closest;
            } else {
                if (xAxis == "red" || xAxis == "green" || xAxis == "blue") {
                    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                } else {
                    var c = new colorObj();
                    c.setHSL(h, s, l);
                    var col = c.toHexString();
                    ctx.fillStyle = col;
                }
            }

            var xOffset = minStep * (canvas.width / xMax);
            var yOffset = minStep * (canvas.height / yMax);
            var x = i * pointWidth - xOffset / 2;
            var y = canvas.height - yOffset - (j * pointHeight - yOffset / 2);
            var w = Math.ceil(pointWidth * minStep);
            var h = Math.ceil(pointHeight * minStep);

            ctx.fillRect(x, y, w, h);

        }
    }

    var circleX = xPos * canvas.width / xMax;
    var circleY = canvas.height - (yPos * canvas.height / yMax);

    if (filterColorNames) {
        col = color.toHexString();
        var closest = hexToRgb(ntc.name(col)[0]);

        if (color.toRGBString() != closest) {
            color = rgbToColor(closest);
            //var fillColor = color.toRGBString();
            //drawCircle(fillColor, circleX, circleY);
            color.rgbToHsl();
            colorUpdate();
        } else {
            var fillColor = closest;
            drawCircle(fillColor, circleX, circleY);
        }

    } else {
        var fillColor = color.toRGBString();
        drawCircle(fillColor, circleX, circleY);
    }
}

function drawCircle(fillColor, circleX, circleY) {

    ctx.fillStyle = fillColor;
    ctx.strokeStyle = color.getOutlineColor();
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.arc(circleX, circleY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

function canvasXSelect(obj) {

    if (obj.id == "red_x") {
        xAxis = "red";

        if (yAxis == "red" || yAxis == "hue" || yAxis == "saturation" || yAxis == "lightness") {
            yAxis = "green";
            green_y.checked = true;
        }
    }

    if (obj.id == "green_x") {
        xAxis = "green";

        if (yAxis == "green" || yAxis == "hue" || yAxis == "saturation" || yAxis == "lightness") {
            yAxis = "red";
            red_y.checked = true;
        }
    }

    if (obj.id == "blue_x") {
        xAxis = "blue";

        if (yAxis == "blue" || yAxis == "hue" || yAxis == "saturation" || yAxis == "lightness") {
            yAxis = "red";
            red_y.checked = true;
        }
    }

    if (obj.id == "hue_x") {
        xAxis = "hue";

        if (yAxis == "hue" || yAxis == "red" || yAxis == "green" || yAxis == "blue") {
            yAxis = "saturation";
            saturation_y.checked = true;
        }
    }

    if (obj.id == "saturation_x") {
        xAxis = "saturation";

        if (yAxis == "saturation" || yAxis == "red" || yAxis == "green" || yAxis == "blue") {
            yAxis = "hue";
            hue_y.checked = true;
        }
    }

    if (obj.id == "lightness_x") {
        xAxis = "lightness";

        if (yAxis == "lightness" || yAxis == "red" || yAxis == "green" || yAxis == "blue") {
            yAxis = "hue";
            hue_y.checked = true;

        }
    }

    setCanvas();
}

function canvasYSelect(obj) {

    if (obj.id == "red_y") {
        yAxis = "red";

        if (xAxis == "red" || xAxis == "hue" || xAxis == "saturation" || xAxis == "lightness") {
            xAxis = "green";
            green_x.checked = true;
        }
    }

    if (obj.id == "green_y") {
        yAxis = "green";

        if (xAxis == "green" || xAxis == "hue" || xAxis == "saturation" || xAxis == "lightness") {
            xAxis = "red";
            red_x.checked = true;
        }
    }

    if (obj.id == "blue_y") {
        yAxis = "blue";


        if (xAxis == "blue" || xAxis == "hue" || xAxis == "saturation" || xAxis == "lightness") {
            xAxis = "red";
            red_x.checked = true;
        }
    }

    if (obj.id == "hue_y") {
        yAxis = "hue";

        if (xAxis == "hue" || xAxis == "red" || xAxis == "green" || xAxis == "blue") {
            xAxis = "saturation";
            saturation_x.checked = true;
        }
    }

    if (obj.id == "saturation_y") {
        yAxis = "saturation";

        if (xAxis == "saturation" || xAxis == "red" || xAxis == "green" || xAxis == "blue") {
            xAxis = "hue";
            hue_x.checked = true;

        }
    }

    if (obj.id == "lightness_y") {
        yAxis = "lightness";

        if (xAxis == "lightness" || xAxis == "red" || xAxis == "green" || xAxis == "blue") {
            xAxis = "hue";
            hue_x.checked = true;
        }
    }

    setCanvas();
}

function stepChange() {

    step = parseInt(step_input.value);

    if (step < 1) step = 1;
    if (step > 255) step = 255;

    step_input.value = step;

    setCanvas();
}

async function copyHexCode() {
    try {
        // Create a new ClipboardItem with both plain text and HTML content
        await navigator.clipboard.write([
            new ClipboardItem({
                'text/plain': new Blob([hex_input.value], { type: 'text/plain' })
            })
        ]);
        alert('Hex code copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy HTML: ', err);
        alert('Failed to copy hex code to clipboard.');
    }
}

function clickClosestColor() {
    color = closestColor;
    color.rgbToHsl();
    colorUpdate();
}

function colorSelectChange() {
    var index = color_select.selectedIndex;
    var hex = "#" + colors[index][0];

    color = hexToColor(hex);
    color.rgbToHsl();
    colorUpdate();
}
