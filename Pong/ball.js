function Ball() {
    this.position = { x: cnv.width / 2, y: cnv.height / 2 };
    this.r = 12;
    this.angle = Math.randomDec(0, Math.PI * 2);
    this.velocity = { x: ball_speed * Math.cos(this.angle), y: ball_speed * Math.sin(this.angle) };

    this.move = function () {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
    this.offScreen = function () {
        if (this.position.y - this.r < 0 || this.position.y + this.r > cnv.height) {
            this.velocity.y *= -1;
        }
        if (this.position.x + this.r < 0 || this.position.x - this.r > cnv.width) {
            if (this.position.x < cnv.width / 2) {
                this.reset("right");
            } else if (this.position.x > cnv.width / 2) {
                this.reset("left");
            }
        }
    }
    this.checkPaddles = function (paddle, direction) {
        if (this.position.y < paddle.position.y + paddle.dimension.h && this.position.y > paddle.position.y) {
            if (direction == "right") {
                if (this.position.x + this.r > paddle.position.x) {
                    if (this.position.x <= paddle.position.x + (paddle.dimension.w / 2)) {
                        //If the ball bounces off the paddles, it bounces in a random angles between -45 and 45
                        this.position.x = paddle.position.x - paddle.dimension.w - this.r;
                        this.angle = Math.randomDec(-Math.PI / 4, Math.PI / 4);
                        this.velocity = { x: ball_speed * -Math.cos(this.angle), y: ball_speed * Math.sin(this.angle) };
                    }
                }
            } else if (direction == "left") {
                if (this.position.x - this.r < paddle.position.x + paddle.dimension.w) {
                    if (this.position.x >= paddle.position.x + (paddle.dimension.w / 2)) {
                        //If the ball bounces off the paddles, it bounces in a random angles between -45 and 45
                        this.position.x = paddle.position.x + paddle.dimension.w + this.r;
                        this.angle = Math.randomDec(-Math.PI / 4, Math.PI / 4);
                        this.velocity = { x: ball_speed * Math.cos(this.angle), y: ball_speed * Math.sin(this.angle) };
                    }
                }
            }
        }
    }
    this.reset = function (direction) {
        //resets the ball to the middle and picks a random direction to start off
        if (direction == "right") {
            right_score++;
        } else if (direction == "left") {
            left_score++;
        }
        this.position = { x: cnv.width / 2, y: cnv.height / 2 };
        this.angle = Math.randomDec(-Math.PI / 4, Math.PI / 4);
        this.velocity = { x: (3 * ball_speed / 4) * Math.cos(this.angle), y: (3 * ball_speed / 4) * Math.sin(this.angle) };
        if (Math.random() < 0.5) {
            this.velocity.x *= -1;
        }
    }
    this.show = function () {
        ctx.fillStyle = "white";
        ctx.fillCircleXYR(this.position.x, this.position.y, this.r)
    }
}