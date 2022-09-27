
function Ship(x, y) {
    this.position = makeVector(x, y);
    this.r = 20;
    this.a = 90 / 180 * Math.PI;
    this.rot = 0;
    this.thrusting = false;
    this.bullets = [];
    this.thrust = {
        x: 0,
        y: 0
    };

    this.update = function () {
        // rotate the ship
        this.a += this.rot;
        // move the ship
        this.position.x += this.thrust.x;
        this.position.y += this.thrust.y;
        if (this.thrusting && Math.abs(this.thrust.x) < SHIP_SPEED_LIMIT && Math.abs(this.thrust.y) < SHIP_SPEED_LIMIT) {
            this.thrust.x += SHIP_THRUST * Math.cos(this.a);
            this.thrust.y -= SHIP_THRUST * Math.sin(this.a);
        } else {
            this.thrust.x -= FRICTION * this.thrust.x;
            this.thrust.y -= FRICTION * this.thrust.y;
        }
    }
    this.draw = function () {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeTriangle(
            this.position.x + 4 / 3 * this.r * Math.cos(this.a),
            this.position.y - 4 / 3 * this.r * Math.sin(this.a),
            this.position.x - this.r * (2 / 3 * Math.cos(this.a) + Math.sin(this.a)),
            this.position.y + this.r * (2 / 3 * Math.sin(this.a) - Math.cos(this.a)),
            this.position.x - this.r * (2 / 3 * Math.cos(this.a) - Math.sin(this.a)),
            this.position.y + this.r * (2 / 3 * Math.sin(this.a) + Math.cos(this.a)),
        );
        ctx.strokeCircle(this.position.x + 4 / 3 * this.r * Math.cos(this.a), this.position.y - 4 / 3 * this.r * Math.sin(this.a), 5);
    }
}

Ship.prototype.edges = function () {
    if (this.position.x < 0 - this.r) {
        this.position.x = cnv.width + this.r;
    } else if (this.position.x > cnv.width + this.r) {
        this.position.x = 0 - this.r;
    }
    if (this.position.y < 0 - this.r) {
        this.position.y = cnv.height + this.r;
    } else if (this.position.y > cnv.height + this.r) {
        this.position.y = 0 - this.r;
    }
}

Ship.prototype.hits = function (roid) {
    let dist = ctx.distance(this.position.x, this.position.y, roid.position.x, roid.position.y);
    return (dist < this.r + roid.r);
}