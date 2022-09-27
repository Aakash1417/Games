function Paddle(x) {
    this.dimension = { w: 10, h: 100 };
    this.position = { x: x, y: (cnv.height / 2) - (this.dimension.h / 2) };
    this.ystep = 0;
    this.update = function () {
        this.position.y += this.ystep;
        if (this.position.y < 0) {
            this.position.y = 0
        }
        if (this.position.y + this.dimension.h > cnv.height) {
            this.position.y = cnv.height - this.dimension.h;
        }
    }
    this.show = function () {
        //Draw the paddle onto the canvas
        ctx.fillStyle = "white";
        ctx.fillRect(this.position.x, this.position.y, this.dimension.w, this.dimension.h);
    }
    this.move = function (steps) {
        this.ystep = steps;
    }
}