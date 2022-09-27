function Bullet(posX, posY, angle) {
    this.position = makeVector(posX, posY);
    this.velocity = makeVector(BULLET_SPEED * Math.cos(angle), BULLET_SPEED * Math.sin(angle));
    this.r = 3;

    this.update = function () {
        this.position.x += this.velocity.x;
        this.position.y -= this.velocity.y;
    }

    this.show = function () {
        ctx.fillStyle = "white";
        ctx.fillCircleXYR(this.position.x, this.position.y, this.r);
    }
}

Bullet.prototype.hits = function (roid) {
    let dist = ctx.distance(this.position.x, this.position.y, roid.position.x, roid.position.y);
    return (dist < this.r + roid.r);
}