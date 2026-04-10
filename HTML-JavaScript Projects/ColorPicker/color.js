class colorObj {
    constructor(red, green, blue, alpha) {

        this.setRGB(red, green, blue);
        this.alpha = alpha;
    }

    setRGB(r, g, b) {
        if (r) this.red = r;
        else this.red = 0;

        if (g) this.green = g;
        else this.green = 0;

        if (b) this.blue = b;
        else this.blue = 0;

        this.rgbToHsl();
    }

    setHSL(h, s, l) {

        if (h) this.hue = h;
        else this.hue = 0;

        if (s) this.saturation = s;
        else this.saturation = 0;

        if (l) this.lightness = l;
        else this.lightness = 0;


        this.hslToRgb();
    }

    toRGBString = function () {
        return "rgb(" + this.red + ", " + this.green + ", " + this.blue + ")";
    }

    redRGB = function () {
        return "rgb(" + this.red + ",0,0)";
    }

    greenRGB = function () {
        return "rgb(0," + this.green + ",0)";
    }

    blueRGB = function () {
        return "rgb(0,0," + this.blue + ")";
    }

    hueHSL() {
        var col = new colorObj();
        col.setHSL(this.hue, 100, 50);
        return col.toRGBString();
    }

    saturationHSL = function () {
        var col = new colorObj();
        col.setHSL(this.hue, this.saturation, 50);
        return col.toRGBString();
    }

    lightnessHSL = function () {
        var col = new colorObj();
        col.setHSL(this.hue, 100, this.lightness);
        return col.toRGBString();
    }

    toHexString = function () {
        return ("#" + parseInt(this.red).toString(16).padStart(2, '0')
            + parseInt(this.green).toString(16).padStart(2, '0')
            + parseInt(this.blue).toString(16).padStart(2, '0')).toUpperCase();
    }

    getOutlineColor() {

        if (this.lightness > 30) {
            return "black";
        } else {
            return "white";
        }
    }

    rgbToHsl() {

        let r = this.red / 255;
        let g = this.green / 255;
        let b = this.blue / 255;

        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        this.hue = Math.round(h * 360);
        this.saturation = Math.round(s * 100);
        this.lightness = Math.round(l * 100);
    }

    hslToRgb() {
        // Convert saturation and lightness to a decimal scale (0-1)
        let h = this.hue;
        let s = this.saturation / 100;
        let l = this.lightness / 100;

        let c = (1 - Math.abs(2 * l - 1)) * s; // Chroma
        let x = c * (1 - Math.abs((h / 60) % 2 - 1)); // Second largest component
        let m = l - c / 2; // Adjustment value
        let r = 0;
        let g = 0;
        let b = 0;

        if (0 <= h && h < 60) {
            r = c;
            g = x;
            b = 0;
        } else if (60 <= h && h < 120) {
            r = x;
            g = c;
            b = 0;
        } else if (120 <= h && h < 180) {
            r = 0;
            g = c;
            b = x;
        } else if (180 <= h && h < 240) {
            r = 0;
            g = x;
            b = c;
        } else if (240 <= h && h < 300) {
            r = x;
            g = 0;
            b = c;
        } else if (300 <= h && h < 360) {
            r = c;
            g = 0;
            b = x;
        }

        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        this.red = r;
        this.green = g;
        this.blue = b;
    }
}