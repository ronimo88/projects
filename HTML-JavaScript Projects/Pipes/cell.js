    class Cell {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.up = false;
            this.down = false;
            this.left = false;
            this.right = false;
            this.source = 0;
            this.filled = 0;
            this.connected = false;
            game.cells.push(this);
            this.checkCells();
        }
        getNum() {
            return this.up + this.down + this.left + this.right;
        }
        checkCells() {

            let cellLeft = false;
            let cellRight = false;
            let cellUp = false;
            let cellDown = false;

            if (game.sourceNum1 == game.cells.indexOf(this)) {
                this.source = 1;
            }

            if (game.sourceNum2 == game.cells.indexOf(this)) {
                this.source = 2;
            }

            if (game.sourceNum3 == game.cells.indexOf(this)) {
                this.source = 3;
            }

            if (game.sourceNum4 == game.cells.indexOf(this)) {
                this.source = 4;
            }

            if (game.sourceNum5 == game.cells.indexOf(this)) {
                this.source = 5;
            }


            this.filled = this.source;

            if (this.source != 0) {
                const dirs = ["left", "right", "up", "down"];
                let dir = dirs[Math.floor(game.rand() * dirs.length)];
                if (this.x == 0 && dir == "left") dir = "right";
                if (this.y == 0 && dir == "up") dir = "down";
                if (this.x == game.canvas.width - game.cellSize && dir == "right") dir = "left";
                if (this.y == game.canvas.height - game.cellSize && dir == "down") dir = "up";
                if (dir == "left") this.left = true;
                if (dir == "right") this.right = true;
                if (dir == "up") this.up = true;
                if (dir == "down") this.down = true;
                game.cells.forEach(other => {

                    other.checkFilled();
                    if (this.x == other.x + game.cellSize && this.y == other.y) {
                        if (this.left && (this.source == other.filled || other.filled == 0)) {
                            other.right = true;
                            this.connected = true;
                        }
                        else {
                            this.left = false;
                            other.right = false;
                        }
                    }

                    other.checkFilled();
                    if (this.x == other.x - game.cellSize && this.y == other.y) {
                        if (this.right && (this.source == other.filled || other.filled == 0)) {
                            other.left = true;
                            this.connected = true;
                        }
                        else {
                            this.right = false;
                            other.left = false;
                        }
                    }

                    other.checkFilled();
                    if (this.y == other.y + game.cellSize && this.x == other.x) {


                        if (this.up && (this.source == other.filled || other.filled == 0)) {
                            other.down = true;
                            this.connected = true;
                        }
                        else {
                            this.up = false;
                            other.down = false;
                        }
                    }

                    other.checkFilled();
                    if (this.y == other.y - game.cellSize && this.x == other.x) {
                        if (this.down && (this.source == other.filled || other.filled == 0)) {
                            other.up = true;
                            this.connected = true;


                        }
                        else {
                            this.down = false;
                            other.up = false;
                        }
                    }
                });
            } else {

                game.cells.forEach(other => {

                    this.checkFilled();

                    if (this.x == other.x + game.cellSize && this.y == other.y) {

                        cellLeft = true;
                        if (other.right) {
                            if (this.filled == 0) {
                                this.left = true;
                                this.connected = true;
                            } else {
                                other.right = false;
                            }
                        }
                    }

                    this.checkFilled();

                    if (this.x == other.x - game.cellSize && this.y == other.y) {

                        cellRight = true;
                        if (other.left) {
                            if (this.filled == 0) {
                                this.right = true;
                                this.connected = true;
                            } else {
                                other.left = false;
                            }
                        }
                    }

                    this.checkFilled();

                    if (this.y == other.y + game.cellSize && this.x == other.x) {
                        cellUp = true;
                        if (other.down) {
                            if (this.filled == 0) {
                                this.up = true;
                                this.connected = true;
                            } else {
                                other.down = false;
                            }
                        }
                    }

                    this.checkFilled();

                    if (this.y == other.y - game.cellSize && this.x == other.x) {
                        cellDown = true;
                        if (other.up) {
                            if (this.filled == 0) {
                                this.down = true;
                                this.connected = true;
                            } else {
                                other.up = false;

                            }
                        }
                    }


                });

                if (!cellLeft && this.x != 0 && this.getNum() < 3) {
                    this.left = game.rand() < 0.5;
                }
                if (!cellRight && this.x != game.canvas.width - game.cellSize && this.getNum() < 3) {
                    this.right = game.rand() < 0.5;
                }
                if (!cellUp && this.y != 0 && this.getNum() < 3) {
                    this.up = game.rand() < 0.5;
                }
                if (!cellDown && this.y != game.canvas.height - game.cellSize && this.getNum() < 3) {
                    this.down = game.rand() < 0.5;
                }
            }
            this.checkFilled();
        }
        click(button) {

            if (!game.win && !this.locked && !game.paused) {

                if (button == 1) {
                    let temp = this.up;
                    this.up = this.left;
                    this.left = this.down;
                    this.down = this.right;
                    this.right = temp;
                }

                if (button == 3) {
                    let temp = this.up;
                    this.up = this.right;
                    this.right = this.down;
                    this.down = this.left;
                    this.left = temp;
                }

                game.cells.forEach(cell => {
                    cell.filled = 0;
                });
                game.cells.forEach(cell => {
                    cell.checkFilled();
                });

                if (game.start) {
                    game.checkWin();
                    console.log("start");
                }
            }
        }
        checkFilled() {

            const currentFilled = this.filled;
            if (this.x != 0 || this.y != 0) this.filled = 0;
            if (this.source != 0) this.filled = this.source;
            game.cells.forEach(cell => {
                if (!this.filled && this.left && this.x == cell.x + game.cellSize && this.y == cell.y) {
                    if (cell.right) this.filled = cell.filled;
                }
                if (!this.filled && this.right && this.x == cell.x - game.cellSize && this.y == cell.y) {
                    if (cell.left) this.filled = cell.filled;
                }
                if (!this.filled && this.up && this.y == cell.y + game.cellSize && this.x == cell.x) {
                    if (cell.down) this.filled = cell.filled;
                }
                if (!this.filled && this.down && this.y == cell.y - game.cellSize && this.x == cell.x) {
                    if (cell.up) this.filled = cell.filled;
                }
            });
            if (this.filled != 0 && !currentFilled) {
                game.cells.forEach(cell => {
                    cell.checkFilled();
                })
            }
            this.draw();
        }
        shuffle() {
            const max = Math.floor(Math.random() * 3);
            for (var i = 0; i <= max; i++) {
                this.click(1);
            }
        }
        draw() {
            game.ctx.clearRect(this.x, this.y, game.cellSize, game.cellSize);
            if (this.locked) {
                game.ctx.fillStyle = "yellow";
                game.ctx.fillRect(this.x, this.y, game.cellSize, game.cellSize);
            }
            if (game.win) {
                game.ctx.fillStyle = "#ccffcc";
                game.ctx.fillRect(this.x, this.y, game.cellSize, game.cellSize);
            }

            if (!game.win) {
                game.ctx.strokeStyle = "black";
                game.ctx.lineWidth = 2;
                game.ctx.strokeRect(this.x + 1, this.y + 1, game.cellSize - 2, game.cellSize - 2);
            }

            game.ctx.fillStyle = "#555";

            if (this.filled == 1) game.ctx.fillStyle = "#0060ff";
            if (this.filled == 2) game.ctx.fillStyle = "#008800";
            if (this.filled == 3) game.ctx.fillStyle = "red";
            if (this.filled == 4) game.ctx.fillStyle = "orange";
            if (this.filled == 5) game.ctx.fillStyle = "purple";

            if (this.getNum() == 1 && this.source == 0) {
                game.ctx.beginPath();
                game.ctx.arc(this.x + game.cellSize / 2, this.y + game.cellSize / 2, game.pipeSize * 1 / 2, 0, 2 * Math.PI);
                game.ctx.fill();
            }
            if (this.getNum() > 1) {
                game.ctx.beginPath();
                game.ctx.arc(this.x + game.cellSize / 2, this.y + game.cellSize / 2, game.pipeSize / 2, 0, 2 * Math.PI);
                game.ctx.fill();
            }
            if (this.up) {
                game.ctx.fillRect(this.x + game.cellSize / 2 - game.pipeSize / 2, this.y, game.pipeSize, game.cellSize / 2);
            }
            if (this.down) {
                game.ctx.fillRect(this.x + game.cellSize / 2 - game.pipeSize / 2, this.y + game.cellSize / 2, game.pipeSize, game.cellSize / 2);
            }
            if (this.left) {
                game.ctx.fillRect(this.x, this.y + game.cellSize / 2 - game.pipeSize / 2, game.cellSize / 2, game.pipeSize);
            }
            if (this.right) {
                game.ctx.fillRect(this.x + game.cellSize / 2, this.y + game.cellSize / 2 - game.pipeSize / 2, game.cellSize / 2, game.pipeSize);
            }
            if (this.source != 0) {
                game.ctx.beginPath();
                game.ctx.arc(this.x + game.cellSize / 2, this.y + game.cellSize / 2, game.sourceSize, 0, 2 * Math.PI);
                game.ctx.fill();
            }

            /*
            if (game.win) {
                game.ctx.textAlign = "center";
                game.ctx.textBaseline = "middle";
                game.ctx.font = "64px Arial ";
                game.ctx.fillStyle = "#222";
                game.ctx.fillText("YOU WIN!", game.canvas.width / 2, game.canvas.height / 2);
                game.ctx.textAlign = "left";
                game.ctx.textBaseline = "top"
            }
                */
        }
    }
