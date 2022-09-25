initGraphics(630, 630);
let dimension = Math.floor(cnv.width / 9);
let board = [];
let stack = [];
let checkernumber = 1;
let start = false;
let highlightedIndex = 0;
let position = 0;
let currentIndex = 0;
for (let col = 0; col < 9; col++) {
    for (let row = 0; row < 9; row++) {
        position++;
        board.push(new Cell(row * dimension, col * dimension, position, row, col));
    }
}
board[highlightedIndex].highlight = true
requestAnimationFrame(draw);
function draw() {
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    for (let i = 0; i < board.length; i++) {
        board[i].show();
    }
    //drawing the thick lines between each 9 squares
    ctx.lineWidth = "4";
    ctx.line(cnv.width / 3, 0, cnv.width / 3, cnv.height);
    ctx.line(2 * cnv.width / 3, 0, 2 * cnv.width / 3, cnv.height);
    ctx.line(0, cnv.height / 3, cnv.width, cnv.height / 3);
    ctx.line(0, 2 * cnv.height / 3, cnv.width, 2 * cnv.height / 3);
    if (currentIndex > 80) {
        return;
    }

    if (start) {
        if (board[currentIndex].number == 0) {
            if (!boxCheck(board[currentIndex].position - 1, checkernumber) && !rowCheck(board[currentIndex].position - 1, checkernumber) && !colCheck(board[currentIndex].position - 1, checkernumber) && checkernumber <= 9) {
                board[currentIndex].number = checkernumber;
                stack.push(board[currentIndex]);
                checkernumber = 0;
                currentIndex++;
            } else if (checkernumber > 9) {
                board[currentIndex].number = 0;
                let tmepCell = stack.pop();
                currentIndex = tmepCell.position - 1;
                checkernumber = board[currentIndex].number;
                board[currentIndex].number = 0;
            }
        } else {
            currentIndex++;
            checkernumber = 0;
        }
        checkernumber++;
    }
    requestAnimationFrame(draw);
};

document.addEventListener("keydown", (event) => {
    if (event.code == "Space") {
        for (let i = 0; i < board.length; i++) {
            board[i].highlight = false;
        }
        highlightedIndex++;
        if (highlightedIndex >= 81) {
            highlightedIndex = 0
        }
        board[highlightedIndex].highlight = true
    }
})