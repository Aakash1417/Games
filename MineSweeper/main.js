const num_cols = 10;
const num_rows = 10;
const num_bomb = prompt("Number of bombs (2-15):");
initGraphics(num_rows * 60, num_cols * 60);
const mine = document.getElementById('mine');
const dimension = cnv.height / num_cols;
let grid = [];
let possibilities = [];
let position = 0;
for (let col = 0; col < num_cols; col++) {
    for (let row = 0; row < num_rows; row++) {
        grid.push(new Cell(row * dimension, col * dimension, position));
        possibilities.push(position);
        position++;
    }
}

for (let i = 0; i < num_bomb; i++) {
    let rand = Math.randomElement(possibilities);
    grid[rand].bomb = true;
    possibilities.splice(rand, 1);
}
let count = 0
for (let i = 0; i < grid.length; i++) {
    grid[i].checkNeighbors();
}

requestAnimationFrame(draw);
function draw() {
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    count = 0
    for (let i = 0; i < grid.length; i++) {
        grid[i].show();
        if (grid[i].reveal) {
            count++
        }
    }
    if (count == num_cols * num_rows - num_bomb) {
        endscreen("You Win!!")
    } else if (count >= num_cols * num_rows - num_bomb) {
        endscreen("You Lose!!")
    } else {
        requestAnimationFrame(draw);
    }
};
function endscreen(text) {
    setTimeout(() => {
        // ctx.fillStyle = "black";
        // ctx.fillRect(0, 0, cnv.width, cnv.height);
        ctx.fillStyle = "black"
        ctx.font = "70px Arial"
        ctx.fillText(text, (cnv.width / 2) - (ctx.measureText(text).width / 2), cnv.height / 2)
    }, 1000)
}
function Cell(x, y, i) {
    this.bomb = false;
    this.reveal = false;
    this.x = x;
    this.y = y;
    this.i = i;
    this.neighbor_count = 0;
    this.show = function () {
        if (this.reveal) {
            if (this.bomb) {
                ctx.drawImage(mine, this.x + 1, this.y + 1, dimension - 2, dimension - 2)
            } else {
                ctx.fillStyle = "#C0C0C0";
                ctx.fillRect(this.x, this.y, dimension, dimension);
                if (this.neighbor_count > 0) {
                    ctx.fillStyle = "black";
                    ctx.font = "30px Arial"
                    ctx.fillText(this.neighbor_count, this.x + (dimension / 2) - (30 / 4), this.y + (dimension / 2) + (30 / 4));
                }
            }
        }
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.x, this.y, dimension, dimension);
    }
    this.floodFill = function () {
        for (let cols = -1; cols <= 1; cols++) {
            for (let rows = -1; rows <= 1; rows++) {
                let indexX = this.i % num_cols;
                let indexY = Math.floor((this.i) / num_cols);
                if (indexX + cols > -1 && indexX + cols < num_cols && indexY + rows > -1 && indexY + rows < num_rows) {
                    let neighbot = grid[this.i + cols + (rows * num_cols)];
                    if (!this.bomb && !neighbot.reveal) {
                        neighbot.revelaed();
                    }
                }
            }
        }
    }
    this.checkNeighbors = function () {
        if (this.bomb) {
            this.neighbor_count = 0;
            return;
        }
        let total = 0;
        for (let cols = -1; cols <= 1; cols++) {
            for (let rows = -1; rows <= 1; rows++) {
                let indexX = this.i % num_cols;
                let indexY = Math.floor((this.i) / num_cols);
                if (indexX + cols > -1 && indexX + cols < num_cols && indexY + rows > -1 && indexY + rows < num_rows) {
                    let neighbot = grid[this.i + cols + (rows * num_cols)]
                    if (neighbot.bomb) {
                        total++;
                    }
                }
            }
        }
        this.neighbor_count = total;
    }
    this.revelaed = function () {
        this.reveal = true;
        if (this.neighbor_count == 0) {
            this.floodFill();
        }
    }
}

function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < cols; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

document.addEventListener("click", clicked);

function clicked() {
    for (let i = 0; i < grid.length; i++) {
        if (mouseX > grid[i].x && mouseX < grid[i].x + dimension) {
            if (mouseY > grid[i].y && mouseY < grid[i].y + dimension) {
                grid[i].reveal = true;
                if (grid[i].neighbor_count == 0) {
                    grid[i].floodFill();
                }
                if (grid[i].bomb) {
                    revelaAll();
                }
            }
        }
    }
}
function revelaAll() {
    for (let i = 0; i < grid.length; i++) {
        grid[i].reveal = true;
    }
}