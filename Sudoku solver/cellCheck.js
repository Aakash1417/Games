function rowCheck(j, compare) {
    let tempnum = Math.floor(j / 9) * 9;
    for (let k = tempnum; k < tempnum + 9; k++) {
        if (board[k].number == compare) {
            return true;
        }
    }
    return false;
}

function boxCheck(j, compare) {
    let x;
    let y;
    if (j % 9 < 3) {
        x = 0;
    } else if (j % 9 < 6) {
        x = 3;
    } else if (j % 9 < 9) {
        x = 6;
    }
    if (board[j].row % 9 < 3) {
        y = 0;
    } else if (board[j].row % 9 < 6) {
        y = 3;
    } else if (board[j].row % 9 < 9) {
        y = 6;
    }

    for (let i = x; i < x + 3; i++) {
        for (let j = y; j < y + 3; j++) {
            if (board[i + (9 * j)].number == compare) {
                return true;
            }
        }
    }
    return false;
}

function colCheck(j, compare) {
    let tempnum = j % 9;
    for (let k = tempnum; k < 81; k += 9) {
        if (board[k].number == compare) {
            return true;
        }
    }
    return false;
}