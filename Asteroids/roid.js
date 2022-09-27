function Asteroid(pos, r) {
    if (!pos) {
        do {
            this.position = makeVector(Math.randomDec(0, cnv.width), Math.randomDec(0, cnv.height));
        } while (ctx.distance(this.position.x, this.position.y, player.x, player.y) < cnv.width / 4);
    } else {
        this.position = { ...pos };
    }
    if (r) {
        this.r = r/2;
    } else {
        this.r = Math.randomInt(25, 50);
    }
    do {
        this.velocity = makeVector(Math.randomDec(-5, 5), Math.randomDec(-5, 5));
    } while (this.velocity.x == 0 || this.velocity.y == 0);
    this.numVert = Math.randomInt(6, 13);
    this.angle = Math.random() * Math.PI * 2;
    this.shiftPosition = [];
    for (let i = 0; i < this.numVert; i++) {
        this.shiftPosition.push(Math.random() * 0.4 * 2 + 1 - 0.4);
    }

    this.update = function () {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    this.show = function () {
        // ctx.strokeCircle(this.position.x, this.position.y, this.r);
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(
            this.position.x + this.r * this.shiftPosition[0] * Math.cos(this.angle),
            this.position.y + this.r * this.shiftPosition[0] * Math.sin(this.angle)
        );
        for (let i = 1; i < this.numVert; i++) {
            ctx.lineTo(
                this.position.x + this.r * this.shiftPosition[i] * Math.cos(this.angle + i * Math.PI * 2 / this.numVert),
                this.position.y + this.r * this.shiftPosition[i] * Math.sin(this.angle + i * Math.PI * 2 / this.numVert)
            );
        }
        ctx.closePath();
        ctx.stroke();
    }
};
Asteroid.prototype.edges = function () {
    if (this.position.x < 0 - this.r) {
        this.position.x = cnv.width + this.r;
        this.updateVelocity();
    } else if (this.position.x > cnv.width + this.r) {
        this.position.x = 0 - this.r;
        this.updateVelocity();
    }
    if (this.position.y < 0 - this.r) {
        this.position.y = cnv.height + this.r;
        this.updateVelocity();
    } else if (this.position.y > cnv.height + this.r) {
        this.position.y = 0 - this.r;
        this.updateVelocity();
    }
};

Asteroid.prototype.updateVelocity = function () {
    do {
        this.velocity = makeVector(Math.randomDec(-3, 3), Math.randomDec(-3, 3));
    } while (this.velocity.x == 0 || this.velocity.y == 0);
};

Asteroid.prototype.breakUp = function () {
    let newast = [];
    newast.push(new Asteroid(this.position, this.r));
    newast.push(new Asteroid(this.position, this.r));
    return newast;
}