function Cell(x, y, position, col, row) {
    this.x = x;
    this.row = row;
    this.col = col;
    this.position = position;
    this.y = y;
    this.w = dimension;
    this.number = 0;
    this.highlight = false;

    this.show = function () {
        if (this.highlight) {
            ctx.fillStyle = "blue";
        } else if (currentIndex == this.position - 1) {
            if (start) {
                ctx.fillStyle = "green";
            } else {
                ctx.fillStyle = "white";
            }
        } else {
            ctx.fillStyle = "white";
        }
        ctx.lineWidth = "1";
        ctx.strokeStyle = "black";
        ctx.font = "40px Arial";
        ctx.fillRect(this.x, this.y, this.w, this.w);
        ctx.strokeRect(this.x, this.y, this.w, this.w);
        ctx.fillStyle = "black";
        if (this.number > 0) {
            ctx.fillText(this.number, this.x + (1 * dimension / 4), this.y + (3 * dimension / 4));
        }
    }
    this.rectCollide = function () {
        if (mouseX > this.x && mouseX < this.x + dimension) {
            if (mouseY > this.y && mouseY < this.y + dimension) {
                return true;
            }
        }
    }
}

document.addEventListener("click", clicked);
document.addEventListener("keydown", keyPress);

function keyPress(event) {
    if (event.keyCode >= 49 && event.keyCode <= 57) {
        for (let i = 0; i < board.length; i++) {
            if (board[i].highlight) {
                let temp = event.code;
                let tempar = temp.split("");
                let num = parseInt(tempar[tempar.length - 1])
                board[i].number = num;
            }
        }
    }
}

function clicked() {
    if (!start) {
        for (let i = 0; i < board.length; i++) {
            if (board[i].rectCollide()) {
                for (let j = 0; j < board.length; j++) {
                    board[j].highlight = false;
                }
                highlightedIndex = i;
                board[i].highlight = true;
            }
        }
    } else {
        for (let i = 0; i < board.length; i++) {
            board[i].highlight = false;
        }
    }
}

document.getElementById("Solve").addEventListener("click", () => {
    start = true;
});