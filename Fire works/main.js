initGraphics(800, 600);
let fireworks = [];
requestAnimationFrame(draw);
let gravity = { x: 0, y: 0.2 };

function draw() {
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    if (Math.random() < 0.08) {
        fireworks.push(new Firework());
    }
    for (let i = 0; i < fireworks.length; i++) {
        fireworks[i].show();
        fireworks[i].update();
        if (fireworks[i].finish()) {
            fireworks.splice(i, 1);
        }
    }
    requestAnimationFrame(draw);
}

function Firework() {
    this.blast = new Particle(Math.randomDec(-100, cnv.width + 100), cnv.height, Math.randomColor(), true);
    this.exploded = false;
    this.firesparklers = [];
    this.update = function () {
        if (!this.exploded) {
            this.blast.applyForce(gravity);
            this.blast.update();
            if (this.blast.velocity.y >= 0) {
                this.exploded = true;
                this.explode();
            }
        }
        for (let i = 0; i < this.firesparklers.length; i++) {
            this.firesparklers[i].applyForce(gravity);
            this.firesparklers[i].update();
            if (this.firesparklers[i].done()) {
                this.firesparklers.splice(i, 1);
            }
        }
    }
    this.finish = function () {
        if (this.firesparklers.length == 0 && this.exploded) {
            return true;
        } else {
            return false;
        }
    }
    this.explode = function () {
        // let boom = document.getElementById('boom');
        // boom.play();
        for (let i = 0; i < 100; i++) {
            this.firesparklers.push(new Particle(this.blast.position.x, this.blast.position.y, this.blast.color, false));
        }
    }
    this.show = function () {
        if (!this.exploded) {
            this.blast.show();
        }
        for (let i = 0; i < this.firesparklers.length; i++) {
            this.firesparklers[i].show();
        }
    }
}
function Particle(x, y, color, sparkler) {
    this.color = color;
    this.position = { x: x, y: y };
    this.sparkler = sparkler;
    this.lifespan = 1;
    if (this.sparkler) {
        this.xdir = 0;
        if (this.position.x < cnv.width && this.position.x > 0) {
            this.xdir = Math.randomDec(-2, 2);
        } else if (this.position.x > cnv.width) {
            this.xdir -= (this.position.x - cnv.width) / 10;
        } else if (this.position.x < 0) {
            this.xdir = (0 - this.position.x) / 10;
        }
        this.velocity = { x: this.xdir, y: -Math.randomDec(10, 15) };
    } else {
        this.velocity = { x: Math.randomDec(-2, 2), y: Math.randomDec(-2, 2) };
        this.velocity.x *= Math.randomDec(4, 7);
        this.velocity.y *= Math.randomDec(4, 7);
    }
    this.acceleration = { x: 0, y: 0 };
    this.applyForce = function (force) {
        this.acceleration.x += force.x;
        this.acceleration.y += force.y;
    }

    this.update = function () {
        if (!this.sparkler) {
            this.velocity.x *= 0.85;
            this.velocity.y *= 0.85;
            this.lifespan -= 0.03;
        }
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.acceleration.y = 0;
    }
    this.done = function () {
        if (this.lifespan < 0) {
            return true;
        } else {
            return false;
        }
    }
    this.show = function () {
        if (!this.sparkler) {
            this.color = addalpha(this.color, this.lifespan);
            ctx.fillStyle = this.color;
            ctx.fillCircleXYR(this.position.x, this.position.y, 2);
        } else {
            ctx.fillStyle = this.color;
            ctx.fillCircleXYR(this.position.x, this.position.y, 4);
        }
    }
}
function addalpha(og, alpha) {
    let r = og.split(",");
    let simp = "";
    for (let i = 0; i < r.length - 1; i++) {
        simp += `${r[i]},`
    }
    return `${simp} ${alpha})`;
}

