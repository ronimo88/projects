
const game = {

    init() {
        this.canvas = document.getElementById("canvas");
        this.canvas.style.backgroundColor = "#f0f0f0";
        this.canvas.style.borderStyle = "solid";
        this.canvas.width = 550;
        this.canvas.height = 550;
        this.ctx = this.canvas.getContext("2d");
        this.start = false;

        this.boardSize = 5;
        this.numSources = 1;

        this.random();

        // this.custom(386787, 5, 5);
        //this.custom(488237, 8, 3);
    },

    random() {
        const seed = Math.floor(Math.random() * 1000000);
        // this.new(seed);

        this.new(seed);

    },

    new(seed) {

        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.font = "40px Arial ";
        this.ctx.fillStyle = "black";
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillText("LOADING", this.canvas.width / 2, this.canvas.height / 2);

        setTimeout(() => {

            this.start = false;
            this.seed = seed;
            //this.seed = 902221;
            //this.seed = 876661;
            //this.seed = 778535;
            //this.seed = 562036;

            this.rand = this.mulberry32(this.seed);
            this.cells = [];
            this.win = false;
            this.cellSize = Math.floor(this.canvas.width / this.boardSize);
            this.pipeSize = Math.floor(this.cellSize * 0.3);
            this.sourceSize = game.cellSize * 0.25;
            this.canvas.width = Math.floor(this.canvas.width / this.boardSize) * this.boardSize;
            this.canvas.height = Math.floor(this.canvas.height / this.boardSize) * this.boardSize;
            this.autoSolve = false;

            document.getElementById("seed_input").value = this.seed;
            document.getElementById("seed_display").innerHTML = "SEED: " + this.seed;
            document.getElementById("size").value = this.boardSize;
            document.getElementById("sources").value = this.numSources;

            const max = this.boardSize * this.boardSize;
            const nums = new Set();

            while (nums.size < this.numSources) {
                nums.add(Math.floor(this.rand() * max));
            }

            [this.sourceNum1, this.sourceNum2, this.sourceNum3, this.sourceNum4, this.sourceNum5] = [...nums];

            this.paused = false;

            for (i = 0; i <= this.boardSize - 1; i++) {
                for (j = 0; j <= this.boardSize - 1; j++) {
                    this.cell = new Cell(this.cellSize * i, this.cellSize * j);
                }
            }
            this.cells.forEach(cell => {
                cell.checkFilled();
            });

            this.repeatNum = 0;

            this.checkAllFilledCreate();

            game.cells.forEach(cell => {
                cell.leftStart = cell.left;
                cell.rightStart = cell.right;
                cell.upStart = cell.up;
                cell.downStart = cell.down;
            });

            this.cells.forEach(cell => {
                cell.shuffle();
                cell.draw();
            });

            this.canvas.addEventListener('contextmenu', (event) => {
                event.preventDefault();
            });

            this.canvas.onmousedown = e => {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                if (e.which == 1 || e.which == 3) {
                    this.cells.forEach(cell => {
                        if (x >= cell.x && x <= cell.x + game.cellSize && y >= cell.y && y <= cell.y + game.cellSize) {
                            cell.click(e.which);
                        }
                    });
                }
                if (e.which == 2) {
                    this.cells.forEach(cell => {
                        if (x >= cell.x && x <= cell.x + game.cellSize && y >= cell.y && y <= cell.y + game.cellSize) {
                            cell.locked = !cell.locked;
                            cell.draw();
                        }
                    });
                }
            }

            this.start = true;
            this.startTimer();
            //this.auto();

        }, 100);


    },

    reset() {
        this.start = false;
        this.win = false;
        this.paused = false;
        document.getElementById("pause").innerHTML = "PAUSE";
        this.cells.forEach(cell => {
            cell.left = cell.leftStart;
            cell.right = cell.rightStart;
            cell.up = cell.upStart;
            cell.down = cell.downStart;
            cell.locked = false;
        });
        this.cells.forEach(cell => {
            cell.shuffle();
            cell.checkFilled();
            cell.draw();
        });

        this.start = true;
        this.startTimer();

    },

    startTimer() {
        clearInterval(this.timeInterval);
        this.timeInterval = null;
        this.time = 0;
        document.getElementById("timer").innerHTML = "TIME: 0.00";

        if (!this.win) {
            this.timeInterval = setInterval(() => {
                if (!game.paused) this.time += .01;

                const totalSeconds = this.time;

                // 1. Extract units using Floor and Modulo
                const min = Math.floor(totalSeconds / 60);
                const sec = Math.floor(totalSeconds % 60);
                const rem = Math.floor((totalSeconds % 1) * 100);

                // 2. Format with padStart (ensures 2 digits with a leading zero)
                const displayMin = String(min).padStart(2, '0');
                const displaySec = String(sec).padStart(2, '0');
                const displayRem = String(rem).padStart(2, '0');

                // 3. Update UI using Template Literals
                document.getElementById("timer").innerHTML = `TIME: ${displayMin}:${displaySec}.${displayRem}`;

            }, 10);
        }
    },

    mulberry32(a) {
        return function () {
            var t = a += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
    },

    checkAllFilledCreate() {

        let allfilled = true;
        this.cells.forEach(cell => {
            this.cells.forEach(other => {
                if (cell.filled == 0) {
                    allfilled = 0;
                    if (other.filled != 0 && (other.source == 0 || other.getNum() == 0) && other.getNum() < 3 && cell.x == other.x + this.cellSize && cell.y == other.y) {
                        cell.left = true;
                        other.right = true;
                    }
                    else if (other.filled != 0 && (other.source == 0 || other.getNum() == 0) && other.getNum() < 3 && cell.x == other.x - this.cellSize && cell.y == other.y) {
                        cell.right = true;
                        other.left = true;
                    }
                    else if (other.filled != 0 && (other.source == 0 || other.getNum() == 0) && other.getNum() < 3 && cell.y == other.y + this.cellSize && cell.x == other.x) {
                        cell.up = true;
                        other.down = true;
                    }
                    else if (other.filled != 0 && (other.source == 0 || other.getNum() == 0) && other.getNum() < 3 && cell.y == other.y - this.cellSize && cell.x == other.x) {
                        cell.down = true;
                        other.up = true;
                    }
                    this.cells.forEach(c => {
                        c.checkFilled();
                    });
                }
            });
            this.cells.forEach(c => {
                c.checkFilled();
            });
        });

        this.repeatNum++;
        if (!allfilled) {
            if (this.repeatNum < 100) {
                this.checkAllFilledCreate();
            } else {
                //console.log("Impossible");
                //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        }
    },

    checkWin() {

        let win = true;

        this.cells.forEach(cell => {
            if (cell.filled == 0 && cell.getNum() > 0) win = false;
            this.cells.forEach(other => {
                if (cell.left && !other.right && cell.x == other.x + this.cellSize && cell.y == other.y) {
                    win = false;
                }
                if (cell.right && !other.left && cell.x == other.x - this.cellSize && cell.y == other.y) {
                    win = false;
                }
                if (cell.up && !other.down && cell.x == other.x && cell.y == other.y + this.cellSize) {
                    win = false;
                }
                if (cell.down && !other.up && cell.x == other.x && cell.y == other.y - this.cellSize) {
                    win = false;
                }
            })

            if (cell.x == 0 && cell.left || cell.y == 0 && cell.up || cell.x == this.canvas.width - this.cellSize && cell.right || cell.y == this.canvas.height - this.cellsize) win = false;
        });

        if (win) {
            this.win = true;
            this.cells.forEach(cell => {
                cell.draw();
            });
            clearInterval(this.timeInterval);
            this.timeInterval = null;
        }
    },

    pause() {
        if (!this.win) {
            this.paused = !this.paused;
            if (this.paused) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                document.getElementById("pause").innerHTML = "RESUME";

                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "middle";
                this.ctx.font = "40px Arial ";
                this.ctx.fillStyle = "black";
                this.ctx.fillText("PAUSED", this.canvas.width / 2, this.canvas.height / 2);
                this.ctx.textAlign = "left";
                this.ctx.textBaseline = "top"
            } else {
                this.cells.forEach(cell => {
                    cell.draw();
                    document.getElementById("pause").innerHTML = "PAUSE";
                });
            }
        }
    },

    boardSizeChange(val) {
        this.boardSize = val;
        this.new(game.seed);
    },

    numSourcesChange(val) {
        this.numSources = val;
        this.new(game.seed);
    },

    seedSelect() {

        let seed = document.getElementById("seed_input").value;
        seed = Math.round(seed);

        if (seed > 0 && seed < 1000000000) this.new(seed);
    },

    custom(seed, size, sources) {
        this.boardSize = size;
        this.numSources = sources;

        this.new(seed);
    },

    solve() {
        if (this.autoSolve) {
            this.cells.forEach(cell => {

                if (cell.x == 0 && cell.y != 0 && cell.y != this.canvas.height - this.cellSize) {
                    if (cell.getNum() == 3) {
                        cell.up = true;
                        cell.right = true;
                        cell.down = true;
                        cell.left = false;
                    }

                    if (cell.getNum() == 2 && (this.up && this.down || this.left && this.right)) {
                        cell.up = true;
                        cell.down = true;
                        cell.left = false;
                        cell.right = false;
                    }
                }

                cell.draw();
                this.checkWin();
            });

            if (!this.win) {
                setTimeout(() => {
                    console.log("test");
                    this.solve();

                }, 250);
            }
        }
    }
}

game.init();
