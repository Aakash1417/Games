initGraphics(600, 600);
const dimension = 30;
const num_column = Math.floor(cnv.width / dimension);
const num_row = Math.floor(cnv.height / dimension);
let grid = [];
let stack = [];
let playercell;
let playerindex = 0;
let mazefinish = false;
for (let col = 0; col < num_column; col++) {
    for (let row = 0; row < num_row; row++) {
        let thiscell = new Cell(row, col);
        grid.push(thiscell);
    }
}
let current = grid[0];
requestAnimationFrame(draw);
// setInterval(draw, 5000);
function draw() {
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    if (stack.length == 0) {
        ctx.fillStyle = "purple";
    } else {
        ctx.fillStyle = "black";
    }
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    ctx.fillStyle = "white";
    current.visited = true;
    let nextCell = current.checkneighbors();
    if (nextCell) {
        removeWall(current, nextCell);
        nextCell.visited = true;
        stack.push(current);
        current = nextCell;
    } else if (stack.length > 0) {
        current = stack.pop();
    } else if (stack.length == 0) {
        playercell = grid[playerindex];
        playercell.playershow = true;
    }

    for (let i = 0; i < grid.length; i++) {
        grid[i].show();
    }

    if (playerindex == (num_column*num_row)-1){
        ctx.fillStyle = "white";
        ctx.font = "48px Arial"
        ctx.fillText("You win!", cnv.width / 2 - 48 * 2, cnv.height / 2);
        return
    }
    requestAnimationFrame(draw);
}

function index(row, col) {
    if (row < 0 || col < 0 || row > num_row - 1 || col > num_column - 1) {
        return -1;
    }
    return row + col * num_column;
}

function Cell(row, col) {
    this.row = row;
    this.col = col;
    this.walls = [true, true, true, true];
    this.visited = false;
    this.playershow = false;

    this.checkneighbors = function () {
        let neighbors = [];

        let top = grid[index(this.row, this.col - 1)];
        let right = grid[index(this.row + 1, this.col)];
        let bottom = grid[index(this.row, this.col + 1)];
        let left = grid[index(this.row - 1, this.col)];

        if (top && !top.visited) {
            neighbors.push(top);
        }
        if (right && !right.visited) {
            neighbors.push(right);
        }
        if (bottom && !bottom.visited) {
            neighbors.push(bottom);
        }
        if (left && !left.visited) {
            neighbors.push(left);
        }
        if (neighbors.length > 0) {
            return Math.randomElement(neighbors);
        } else {
            return undefined;
        }
    }
    this.show = function () {
        let x = this.row * dimension;
        let y = this.col * dimension;
        ctx.lineWidth = 1;
        ctx.strokeStyle = "white";
        if (this.walls[0]) {
            ctx.line(x, y, x + dimension, y);
        }
        if (this.walls[1]) {
            ctx.line(x + dimension, y, x + dimension, y + dimension);
        }
        if (this.walls[2]) {
            ctx.line(x + dimension, y + dimension, x, y + dimension);
        }
        if (this.walls[3]) {
            ctx.line(x, y + dimension, x, y);
        }
        if (this.visited) {
            ctx.fillStyle = "grey";
            ctx.fillRect(x, y, dimension, dimension);
        }
        if (this.playershow) {
            ctx.fillStyle = "red";
            ctx.fillRect(x + 5, y + 5, dimension - 10, dimension - 10);
        }
    }
}

function removeWall(a, b) {
    let change_in_x = a.row - b.row;
    if (change_in_x == 1) {
        a.walls[3] = false;
        b.walls[1] = false;
    } else if (change_in_x == -1) {
        a.walls[1] = false;
        b.walls[3] = false;
    }
    let change_in_y = a.col - b.col;
    if (change_in_y == 1) {
        a.walls[0] = false;
        b.walls[2] = false;
    } else if (change_in_y == -1) {
        a.walls[2] = false;
        b.walls[0] = false;
    }
}

function keydown(event) {
    if (event.code == "ArrowRight" && playercell.row < num_row - 1 && playercell.walls[1] == false) {
        playercell.playershow = false;
        playerindex++;
    } else if (event.code == "ArrowLeft" && playercell.row > 0 && playercell.walls[3] == false) {
        playercell.playershow = false;
        playerindex--;
    } else if (event.code == "ArrowUp" && playercell.col > 0 && playercell.walls[0] == false) {
        playercell.playershow = false;
        playerindex -= num_row;
    } else if (event.code == "ArrowDown" && playercell.col < num_column - 1 && playercell.walls[2] == false) {
        playercell.playershow = false;
        playerindex += num_row;
    }
}

document.addEventListener("keydown", keydown);