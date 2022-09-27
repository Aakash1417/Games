initGraphics(800, 600);

let ball_speed = 10;
let paddle_speed = 10;
let score_to_beat = 0;
promptscore();
let left_score = 0;
let right_score = 0;
let started = false;
let duo = false;
let SinglePlayer = { x: (cnv.width / 2) - 300, y: (cnv.height / 2) - 100, w: 250, h: 100 }
let MultiPlayer = { x: (cnv.width / 2) + 50, y: (cnv.height / 2) - 100, w: 250, h: 100 }
let ball = new Ball();
let leftPaddle = new Paddle(0);
let rightPaddle = new Paddle(cnv.width - 10);

function promptscore() {
    score_to_beat = prompt("How many points would you like to play upto?")
    if (score_to_beat <= 0 || isNaN(score_to_beat)) {
        // alert(`${score_to_beat} is not a valid score to beat`);
        promptscore();
    }
}

function start() {
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    ctx.fillStyle = "white";
    (ctx.mouseinRect(SinglePlayer)) ? drawingBoxes(SinglePlayer, "black", "white", "Single Player") : drawingBoxes(SinglePlayer, "white", "black", "Single Player");
    (ctx.mouseinRect(MultiPlayer)) ? drawingBoxes(MultiPlayer, "black", "white", "Multiplayer") : drawingBoxes(MultiPlayer, "white", "black", "Multiplayer");
    if (!started) {
        requestAnimationFrame(start);
    }
}

function drawingBoxes(rect, boxColor, textColor, text) {
    ctx.font = "36px Arial";
    ctx.fillStyle = boxColor;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    ctx.fillStyle = textColor;
    ctx.strokeStyle = textColor;
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h)
    ctx.fillText(text, rect.x + 20, rect.y + rect.h / 2);
}

function draw() {
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    ctx.fillStyle = "white";

    // constantly moves the paddle, but if key is not pressed, it moves 0
    leftPaddle.update();
    rightPaddle.update();
    ball.move();

    // drawing the ball and the paddles
    leftPaddle.show();
    rightPaddle.show();
    ball.show();

    // only if its single player
    if (!duo) {
        if (ball.velocity.x < 0) {
            if (ball.position.y < leftPaddle.position.y) {
                leftPaddle.move(-(paddle_speed - 3))
            } else if (ball.position.y > leftPaddle.position.y + leftPaddle.dimension.h) {
                leftPaddle.move(paddle_speed - 3)
            }
        }
    }
    //Checking if the ball bounced off any edges
    ball.offScreen();

    // checking if ball hits the side of the paddle
    ball.checkPaddles(rightPaddle, "right");
    ball.checkPaddles(leftPaddle, "left");
    ctx.font = "36px Arial"

    // displaying the score
    ctx.fillText(left_score, 36, 36);
    ctx.fillText(right_score, cnv.width - 72, 36);

    if (right_score >= score_to_beat) {
        endscreen("RIGHT")
    } else if (left_score >= score_to_beat) {
        endscreen("LEFT")
    } else {
        requestAnimationFrame(draw);
    }
}

function endscreen(side) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    ctx.font = "72px Arial"
    ctx.fillStyle = "white";
    text = `${side} SIDE WINS!!`
    ctx.fillText(text, (cnv.width / 2) - (ctx.measureText(text).width / 2), (cnv.height / 2) - (72 / 2));

}

document.addEventListener("keydown", pressed);
document.addEventListener("keyup", released);
document.addEventListener("click", () => {
    if (ctx.mouseinRect(SinglePlayer)) {
        requestAnimationFrame(draw);
        duo = false;
        started = true;
    }
    if (ctx.mouseinRect(MultiPlayer)) {
        requestAnimationFrame(draw);
        duo = true;
        started = true;
    }
});

function released(event) {
    if (event.code == "ArrowUp" || event.code == "ArrowDown") {
        rightPaddle.move(0)
    }
    if (duo) {
        if (event.code == "KeyW" || event.code == "KeyS") {
            leftPaddle.move(0)
        }
    }
}

function pressed(event) {
    if (event.code == "ArrowUp") {
        rightPaddle.move(-paddle_speed)
    } else if (event.code == "ArrowDown") {
        rightPaddle.move(paddle_speed)
    }
    if (duo) {
        if (event.code == "KeyW") {
            leftPaddle.move(-paddle_speed)
        } else if (event.code == "KeyS") {
            leftPaddle.move(paddle_speed)
        }
    }
}
requestAnimationFrame(start);