
class Game {

    constructor() {
        window.game = this;
        this.resetIntervals();
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.preview = document.getElementById("preview");
        this.pCtx = this.preview.getContext("2d");
        this.blockSize = 50;
        this.canvas.width = this.blockSize * 6;
        this.canvas.height = this.blockSize * 13;
        this.preview.width = this.blockSize;
        this.preview.height = this.blockSize * 3;
        this.column = null;
        this.previewColumn = null;
        this.blocks = [];
        this.downHold = false;
        this.gameOver = false;
        this.mult = 1;
        this.gameOverY = this.canvas.height;
        this.levelUpNum = 500;
        this.magicMatch = false;
        this.isFocused = true;

        this.getGemImages();
        this.setLevel(1);
        this.setDifficulty(0);
        this.setScore(0);
        this.setMult(1);
        this.createPreview();

        setTimeout(() => this.column = this.previewColumn, 1000);

        this.draw();

        window.onkeydown = (e) => {
            if (!this.gameOver) {
                switch (e.code) {
                    case "ArrowLeft":
                        this.column?.columnLeft();
                        break;
                    case "ArrowRight":
                        this.column?.columnRight();
                        break;
                    case "ArrowDown":
                        this.column?.columnDown();
                        break;
                    case "ArrowUp":
                        this.column?.shuffle();
                        break;
                    case "Space":
                        this.column?.shuffle();
                        break;
                }
            }

            switch (e.code) {
                case "Escape":
                    window.menu.quitGame();
                    break;
                case "KeyR":
                    window.menu.startGame();
                    break;
            }

        }

        window.onkeyup = (e) => {
            if (!this.gameOver) {
                switch (e.code) {

                    case "ArrowDown":
                        this.downHold = false;
                        clearInterval(this.columnFallInterval);
                        this.columnFallInterval = setInterval(this.columnFall, this.speed);

                }
            }
        }
    }

    getGemImages() {
        this.gemImages = [];

        var img = new Image();
        img.src = "images/block1.png";
        this.gemImages.push(img);

        var img = new Image();
        img.src = "images/block2.png";
        this.gemImages.push(img);

        var img = new Image();
        img.src = "images/block3.png";
        this.gemImages.push(img);

        var img = new Image();
        img.src = "images/block4.png";
        this.gemImages.push(img);

        var img = new Image();
        img.src = "images/block5.png";
        this.gemImages.push(img);

        var img = new Image();
        img.src = "images/block6.png";
        this.gemImages.push(img);

        var img = new Image();
        img.src = "images/block_magic.png";
        this.gemImages.push(img);
    }

    resetIntervals() {
        clearInterval(this.columnFallInterval);
        this.columnFallInterval = null;
        clearTimeout(this.createBlocksTimeout);
        this.createBlocksTimeout = null;
        clearTimeout(this.createColumnTimeout);
        this.createColumnTimeout = null;
        clearInterval(this.flashInterval);
        this.flashInterval = null;
    }

    setLevel(level) {
        this.level = level;
        this.speed = 500 / level;
        if (this.speed < 20) this.speed = 15;
        document.getElementById("level").innerHTML = "LEVEL: " + level;
        clearInterval(this.columnFallInterval);

        if (window.game.downHold) {
            this.columnFallInterval = setInterval(this.columnFall, 15);
        } else {
            this.columnFallInterval = setInterval(this.columnFall, this.speed);
        }
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;

        switch (this.difficulty) {
            case 0:
                // this.colors = ["red", "green", "blue", "yellow"];
                this.gems = [this.gemImages[0], this.gemImages[1], this.gemImages[2], this.gemImages[3]]
                break;
            case 1:
                // this.colors = ["red", "green", "blue", "yellow", "orange"];
                this.gems = [this.gemImages[0], this.gemImages[1], this.gemImages[2], this.gemImages[3], this.gemImages[4]];
                break;
            case 2:
                // this.colors = ["red", "green", "blue", "yellow", "orange", "magenta"];
                this.gems = [this.gemImages[0], this.gemImages[1], this.gemImages[2], this.gemImages[3], this.gemImages[4], this.gemImages[5]];
                break;
        }
    }

    columnFall() {

        if (window.game.isFocused) {
            const game = window.game;
            game.column?.fall();
            game.draw();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (var i = this.blockSize; i <= this.canvas.width - this.blockSize; i += this.blockSize) {
            this.ctx.strokeStyle = "lightgray";
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canvas.height);
            this.ctx.closePath();
            this.ctx.stroke();
        }

        for (var i = this.blockSize; i <= this.canvas.height - this.blockSize; i += this.blockSize) {
            this.ctx.strokeStyle = "lightgray";
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.canvas.width, i);
            this.ctx.closePath();
            this.ctx.stroke();
        }

        this.column?.draw();
        this.blocks.forEach(b => b.draw());
    }

    createPreview() {
        const game = window.game;
        var magic = false;
        if (Math.floor(Math.random() * 30) == 0) {
            magic = true;
            var block1 = game.gemImages[6];
            var block2 = game.gemImages[6];
            var block3 = game.gemImages[6];
        } else {
            //var block1 = game.colors[Math.floor(Math.random() * game.colors.length)];
            //var block2 = game.colors[Math.floor(Math.random() * game.colors.length)];
            //var block3 = game.colors[Math.floor(Math.random() * game.colors.length)];
            var block1 = game.gemImages[Math.floor(Math.random() * game.gems.length)];
            var block2 = game.gemImages[Math.floor(Math.random() * game.gems.length)];
            var block3 = game.gemImages[Math.floor(Math.random() * game.gems.length)];

        }
        game.previewColumn = new column(150, game.blockSize * -3, block1, block2, block3);
        if (magic) game.previewColumn.magic = true;

        setTimeout(() => this.drawPreview(), 50);
    }

    drawPreview() {
        const game = window.game;
        const block1 = game.previewColumn.block1;
        const block2 = game.previewColumn.block2;
        const block3 = game.previewColumn.block3;

        /*
        game.pCtx.fillStyle = block1;
        if (block1 == "magic") game.pCtx.fillStyle = "white";
        game.pCtx.fillRect(0, 0, this.blockSize, this.blockSize);
        game.pCtx.fillStyle = block2;
        if (block2 == "magic") game.pCtx.fillStyle = "white";
        game.pCtx.fillRect(0, this.blockSize, this.blockSize, this.blockSize);
        game.pCtx.fillStyle = block3;
        if (block3 == "magic") game.pCtx.fillStyle = "white";
        game.pCtx.fillRect(0, this.blockSize * 2, this.blockSize, this.blockSize);
        game.strokeStyle = "gray";
        game.pCtx.strokeRect(0, 0, this.blockSize, this.blockSize);
        game.pCtx.strokeRect(0, this.blockSize, this.blockSize, this.blockSize);
        game.pCtx.strokeRect(0, this.blockSize * 2, this.blockSize, this.blockSize);
        */

        game.pCtx.clearRect(0, 0, game.preview.width, game.preview.height);
        game.pCtx.drawImage(block1, 0, 0);
        game.pCtx.drawImage(block2, 0, game.blockSize);
        game.pCtx.drawImage(block3, 0, game.blockSize * 2);
    }

    createColumn() {
        const game = window.game;
        game.column = game.previewColumn;
        game.setMult(1);
        game.magicMatch = false;
    }

    endGame() {
        clearInterval(this.columnFallInterval);
        this.columnFallInterval = null;
        this.gameOver = true;
        window.menu.gameMusic1.pause();
        window.menu.gameMusic2.pause();
        window.menu.gameMusic3.pause();
        setTimeout(this.gameOverDestroy, 50);
    }

    gameOverDestroy() {
        const g = window.game;

        g.blocks.forEach(block => {
            if (block.y >= g.gameOverY) block.delete = true;
        });

        g.blocks = g.blocks.filter(block => !block.delete);

        g.draw();
        g.gameOverY -= g.blockSize;
        window.menu.destroySound.currentTime = 0;
        window.menu.destroySound.play();

        if (g.gameOverY >= 0) {
            setTimeout(g.gameOverDestroy, 50);
        } else {
            const game = window.game;
            game.ctx.fillStyle = "white";
            game.ctx.font = "30px Arial";
            game.ctx.textAlign = "center";
            game.ctx.textBaseline = "middle";
            game.ctx.fillText("GAME OVER", game.canvas.width / 2, game.canvas.height / 2);
            window.menu.gameOverSound.play();
        }
    }

    checkBlocks() {
        const game = window.game;
        const column = game.column;

        var match = false;

        game.blocks.forEach(block => {
            var m = block.checkBlocks();
            if (m) match = m;
        });

        game.column = null;
        game.draw();

        if (match) {
            game.flashInterval = setInterval(game.flash, 100);
            setTimeout(game.startFall, 500);
        } else {

            var overflow = false;
            game.blocks.forEach(block => {
                if (block.y < 0) {
                    overflow = true;
                    return;
                }
            });

            if (overflow) {
                game.endGame();
            } else {
                setTimeout(game.createColumn, 500);
            }
        }
    }

    flash() {
        const game = window.game;
        game.blocks.forEach(block => {
            if (block.delete) {
                block.flash = !block.flash;
            }
        });

        game.draw();
    }

    startFall() {

        const game = window.game;

        game.blocks.forEach(block => {
            if (block.delete) game.setScore(game.score + 10 * game.mult * game.level);
        });

        //var amount = (game.level * (game.level + 1)) / 2 * num;

        const s = game.score;
        var newLevel = (-1 + Math.sqrt(1 + 8 * s / game.levelUpNum)) / 2;
        newLevel = Math.ceil(newLevel);




        game.blocks = game.blocks.filter(block => !block.delete);

        game.blocks.forEach(block => {
            block.getFallY();
        });

        if (newLevel != game.level) {
            window.menu.levelUpSound.play();
            game.setLevel(newLevel);
        } else if (game.magicMatch) {
            window.menu.magicSound.play();
        } else {
            window.menu.matchSound.play();
        }

        setTimeout(game.blockFall, 5);
    }

    blockFall() {

        const game = window.game;
        var falling = false;

        game.blocks.forEach(block => {
            if (block.y < block.yTo) {
                block.y += game.blockSize / 8;
                falling = true;
            }
        });

        if (falling) {
            setTimeout(game.blockFall, 5);
        } else {

            game.draw();

            setTimeout(game.checkBlocks, 250);
            clearInterval(game.flashInterval);
            game.flashInterval = null;
            game.setMult(game.mult + 1);
        }
    }

    createBlocks() {

        const game = window.game;
        const column = game.column;

        window.menu.landSound.play();

        if (column.magic) {

            var blockColor = null;
            game.blocks.forEach(b => {

                if (b.x == column.x && b.y == column.y + game.blockSize * 3) {
                    blockColor = b.block;
                }
            });

            if (blockColor) {
                game.blocks.forEach(b => {
                    if (b.block == blockColor) {
                        b.delete = true;
                    }
                });
            }

            game.magicMatch = true;

        }

        var b = new block(column.x, column.y, column.block1);
        game.blocks.push(b);
        b = new block(column.x, column.y + game.blockSize, column.block2);
        game.blocks.push(b);
        b = new block(column.x, column.y + game.blockSize * 2, column.block3);
        game.blocks.push(b);

        if (game.column === game.previewColumn) {

            game.createPreview();
        }

        game.draw();

        game.checkBlocks();
    }

    setScore(score) {
        this.score = score;
        document.getElementById("score").innerHTML = "SCORE: " + score;
    }

    setMult(mult) {
        this.mult = mult;
    }
}

class column {
    constructor(x, y, block1, block2, block3) {
        this.x = x;
        this.y = y;
        this.block1 = block1;
        this.block2 = block2;
        this.block3 = block3;
        this.magic = false;
    }

    fall() {
        const game = window.game;

        var contact = false;

        game.blocks.forEach(block => {
            if (this.x == block.x && this.y + game.blockSize * 3 == block.y) {
                contact = true;
                return;
            }
        });

        if (this.y >= game.canvas.height - game.blockSize * 3) contact = true;

        if (contact) {
            if (game.downHold) {
                game.createBlocks();
                clearTimeout(game.createBlocksTimeout);
                game.createBlocksTimeout = null;
            } else if (!game.createBlocksTimeout) {
                game.createBlocksTimeout = setTimeout(game.createBlocks, 500);
            }

        } else {
            clearTimeout(game.createBlocksTimeout);
            game.createBlocksTimeout = null;
            this.y += window.game.blockSize / 2;
            if (game.downHold) game.setScore(game.score + 1);
            if (this.y == 0) game.createPreview();
        }
    }

    shuffle() {
        const game = window.game;

        [this.block1, this.block2, this.block3] = [this.block3, this.block1, this.block2];
        if (game.column.y < 0) {
            [game.previewColumn.block1, game.previewColumn.block2, game.previewColumn.block3] = [game.previewColumn.block3, game.previewColumn.block1, game.previewColumn.block2];
        }
        game.draw();
        game.drawPreview();

        window.menu.shuffleSound.currentTime = 0;
        window.menu.shuffleSound.play();
    }

    columnLeft() {
        const game = window.game;
        var contact = false;

        game.blocks.forEach(block => {
            if (this.x - game.blockSize == block.x && this.y + game.blockSize * 3 > block.y && this.y < block.y + game.blockSize) {
                contact = true;
                return;
            }
        });

        if (!contact) this.x -= game.blockSize;
        if (this.x < 0) this.x = 0;

        game.draw();
    }

    columnRight() {
        const game = window.game;
        var contact = false;

        game.blocks.forEach(block => {
            if (this.x + game.blockSize == block.x && this.y + game.blockSize * 3 > block.y && this.y < block.y + game.blockSize) {
                contact = true;
                return;
            }
        });

        if (!contact) this.x += game.blockSize;

        if (this.x > game.canvas.width - game.blockSize) {
            this.x = game.canvas.width - game.blockSize;
        }

        game.draw();
    }

    columnDown() {

        const game = window.game;
        if (!game.downHold) {
            game.downHold = true;
            clearInterval(game.columnFallInterval);
            game.columnFallInterval = setInterval(game.columnFall, 15);
            game.column?.fall();
        }
    }

    draw() {
        const game = window.game;
        game.ctx.strokeStyle = "gray";

        /*
        game.ctx.fillStyle = this.block1;
        if (this.block1 == "magic") game.ctx.fillStyle = "white";
        game.ctx.fillRect(this.x, this.y, game.blockSize, game.blockSize);
        game.ctx.strokeRect(this.x, this.y, game.blockSize, game.blockSize);

        game.ctx.fillStyle = this.block2;
        if (this.block2 == "magic") game.ctx.fillStyle = "white";
        game.ctx.fillRect(this.x, this.y + game.blockSize, game.blockSize, game.blockSize);
        game.ctx.strokeRect(this.x, this.y + game.blockSize, game.blockSize, game.blockSize);

        game.ctx.fillStyle = this.block3;
        if (this.block3 == "magic") game.ctx.fillStyle = "white";
        game.ctx.fillRect(this.x, this.y + game.blockSize * 2, game.blockSize, game.blockSize);
        game.ctx.strokeRect(this.x, this.y + game.blockSize * 2, game.blockSize, game.blockSize);
        */

        game.ctx.drawImage(this.block1, this.x, this.y);
        game.ctx.drawImage(this.block2, this.x, this.y + game.blockSize);
        game.ctx.drawImage(this.block3, this.x, this.y + game.blockSize * 2);

        game.ctx.lineWidth = 2;
        game.ctx.strokeStyle = "white";
        game.ctx.strokeRect(this.x, this.y, game.blockSize, game.blockSize * 3);
    }
}

class block {
    constructor(x, y, block) {
        this.x = x;
        this.y = y;
        this.yTo = this.y;
        this.block = block;
        this.delete = false;
        this.flash = false;
    }

    draw() {
        if (!this.flash) {
            const game = window.game;

            /*
            game.ctx.lineWidth = 2;
            game.ctx.fillStyle = this.block;
            if (this.block == "magic") game.ctx.fillStyle = "white";
            game.ctx.fillRect(this.x, this.y, game.blockSize, game.blockSize);
            game.ctx.strokeStyle = "gray";
            game.ctx.strokeRect(this.x, this.y, game.blockSize, game.blockSize);
            */

            game.ctx.drawImage(this.block, this.x, this.y);


        }
    }

    checkBlocks() {
        const game = window.game;
        const size = game.blockSize;
        var r = false;
        var r2 = false;
        var rd = false;
        var rd2 = false;
        var d = false;
        var d2 = false;
        var ld = false;
        var ld2 = false;
        var l = false;
        var l2 = false;
        var lu = false;
        var lu2 = false;
        var u = false;
        var u2 = false;
        var ru = false;
        var ru2 = false;

        game.blocks.forEach(other => {

            if (this != other && this.block == other.block) {
                if (other.x == this.x + size && other.y == this.y) r = true;
                if (other.x == this.x + size * 2 && other.y == this.y) r2 = true;

                if (other.x == this.x + size && other.y == this.y + size) rd = true;
                if (other.x == this.x + size * 2 && other.y == this.y + size * 2) rd2 = true;

                if (other.x == this.x && other.y == this.y + size) d = true;
                if (other.x == this.x && other.y == this.y + size * 2) d2 = true;

                if (other.x == this.x - size && other.y == this.y + size) ld = true;
                if (other.x == this.x - size * 2 && other.y == this.y + size * 2) ld2 = true;

                if (other.x == this.x - size && other.y == this.y) l = true;
                if (other.x == this.x - size * 2 && other.y == this.y) l2 = true;

                if (other.x == this.x - size && other.y == this.y - size) lu = true;
                if (other.x == this.x - size * 2 && other.y == this.y - size * 2) lu2 = true;

                if (other.x == this.x && other.y == this.y - size) u = true;
                if (other.x == this.x && other.y == this.y - size * 2) u2 = true;

                if (other.x == this.x + size && other.y == this.y - size) ru = true;
                if (other.x == this.x + size * 2 && other.y == this.y - size * 2) ru2 = true;
            }
        });

        if (r && r2 || rd && rd2 || d && d2 || ld && ld2 || l && l2 || lu && lu2 || u && u2 || ru && ru2 || l & r || u && d || lu && rd || ru && ld) {
            this.delete = true;

            return true;
        } else return false;
    }

    getFallY() {
        const game = window.game;
        this.yTo = this.y;



        for (var i = this.y + game.blockSize; i < canvas.height; i += game.blockSize) {
            var contact = false;
            game.blocks.forEach(block => {
                if (this.x == block.x && i == block.y) {
                    contact = true;
                    return;
                }
            });

            if (!contact) {
                this.yTo += game.blockSize;
            }
        }
    }
}

class Menu {

    constructor() {
        window.menu = this;
        this.audioArray = [];
        this.titleMusic = this.addAudio("audio/title.mp3");
        this.titleMusic.loop = true;
        this.gameMusic1 = this.addAudio("audio/game1.mp3");
        this.gameMusic1.loop = true;
        this.gameMusic2 = this.addAudio("audio/game2.mp3");
        this.gameMusic2.loop = true;
        this.gameMusic3 = this.addAudio("audio/game3.mp3");
        this.gameMusic3.loop = true;
        this.landSound = this.addAudio("audio/land.wav");
        this.shuffleSound = this.addAudio("audio/shuffle.wav");
        this.matchSound = this.addAudio("audio/match.wav");
        this.magicSound = this.addAudio("audio/magic.wav");
        this.levelUpSound = this.addAudio("audio/level_up.wav");
        this.gameOverSound = this.addAudio("audio/game_over.mp3");
        this.destroySound = this.addAudio("audio/destroy.wav");
        this.maxVolume = 0.5;
        this.globalVolume = this.maxVolume;

        this.audioArray.forEach(audio => {
            audio.volume = this.globalVolume;
        });
        this.playMusic();

        window.onfocus = () => {
            this.playMusic();
            window.game.isFocused = true;
        }

        window.onblur = () => {
            window.game.isFocused = false;
            this.titleMusic.pause();
            this.gameMusic1.pause();
            this.gameMusic2.pause();
            this.gameMusic3.pause();
        }
    }

    playMusic() {
        if (window.room == "menu") this.titleMusic.play();

        if (window.room == "game") {
            if (!window.game.gameOver) {
                if (window.game.difficulty == 0) this.gameMusic1.play();
                if (window.game.difficulty == 1) this.gameMusic2.play();
                if (window.game.difficulty == 2) this.gameMusic3.play();
            }
        }
    }

    mute() {
        if (this.globalVolume == 0) this.globalVolume = this.maxVolume; else this.globalVolume = 0;

        this.audioArray.forEach(audio => {
            audio.volume = this.globalVolume;
        });

        const muteButton = document.getElementById("mute_button");
        if (this.globalVolume == 0) muteButton.innerHTML = "&#128263;";
        else muteButton.innerHTML = "&#128266;";

        this.playMusic();
        muteButton.blur();

    }

    addAudio(src) {
        const a = new Audio(src);
        this.audioArray.push(a);
        return a;
    }

    startGame() {
        if (window.game) window.game.resetIntervals();
        new Game();
        document.getElementById("menu_div").style.display = "none";
        document.getElementById("game_div").style.display = "grid";
        const difficulty = document.getElementById("difficulty_select").selectedIndex;
        const level = document.getElementById("level_select").value;
        window.game.setDifficulty(difficulty);
        window.game.setLevel(level);
        window.game.setScore(Math.floor((level - 1) * (level) / 2) * window.game.levelUpNum);
        const gameDiv = document.getElementById("game_div");

        if (window.game.difficulty == 0) gameDiv.style.backgroundImage = "url('images/bg1.png')";
        if (window.game.difficulty == 1) gameDiv.style.backgroundImage = "url('images/bg2.png')";
        if (window.game.difficulty == 2) gameDiv.style.backgroundImage = "url('images/bg3.png')";

        document.getElementById("new_game_button").blur();

        window.menu.audioArray.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });

        /*
        window.menu.titleMusic.pause();
        window.menu.titleMusic.currentTime = 0;
        window.menu.gameMusic1.currentTime = 0;
        window.menu.gameMusic2.currentTime = 0;
        window.menu.gameMusic3.currentTime = 0;
        */
       
        window.room = "game";
        this.playMusic();
    }

    quitGame() {
        document.getElementById("menu_div").style.display = "grid";
        document.getElementById("game_div").style.display = "none";
        window.game.resetIntervals();

        /*
        window.menu.gameMusic1.pause();
        window.menu.gameMusic1.currentTime = 0;
        window.menu.gameMusic2.pause();
        window.menu.gameMusic2.currentTime = 0;
        window.menu.gameMusic3.pause();
        window.menu.gameMusic3.currentTime = 0;
        */

        this.audioArray.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });

        this.titleMusic.play();

        window.room = "menu";
    }
}

window.onload = () => {

    window.room = "start";

    window.onclick = () => {
        if (window.room == "start") {
            window.room = "menu";
            document.getElementById("start_text").style.display = "none";
            document.getElementById("menu_wrapper").style.display = "revert";
            document.getElementById("mute_button").style.display = "revert";
            window.menu = new Menu();
        }
    }

}





