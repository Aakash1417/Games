initGraphics(800, 600);
const num_col = 20;
const num_row = 20;
let ship = new Player(cnv.width / 2, cnv.height - 30);
let villain = [];
let points = 0;
let lives = 5;
let bullet = [];
let wave = 1;
let enemySpeed = 1;
let enemycount = 21;

function spawnEnemies(col, row) {
    for (let j = 0; j < row; j++) {
        for (let i = 0; i < col; i++) {
            villain.push(new Enemy(i * 80 + 160, j * 50 + 40, true))
        }
    }
}

spawnEnemies(7, 1);
function bulletCooldown() {
    setTimeout(() => {
        ship.fire = true;
    }, 300)
}

requestAnimationFrame(draw);
function draw() {
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    ctx.fillStyle = "white";
    ship.move();
    if (KeyIsPressed["Space"] && ship.fire) {
        bullet.push(new Bullet(ship.x, ship.y, 1));
        ship.fire = false;
        bulletCooldown();
    }
    if (KeyIsPressed["ArrowRight"]) {
        ship.settingXDirection(7);
    }
    if (KeyIsPressed["ArrowLeft"]) {
        ship.settingXDirection(-7);
    }
    let edge = false;
    for (let i = 0; i < villain.length; i++) {
        villain[i].show();
        villain[i].move();
        if (Math.random() < 0.005) {
            villain[i].shoot();
        }
        for (let j = 0; j < villain[i].bullets.length; j++) {
            villain[i].bullets[j].move(10);
            if (villain[i].bullets[j].y > cnv.height) {
                villain[i].bullets.splice(j, 1);
                break;
            }
            if (villain[i].bullets[j].hits(ship)) {
                lives--;
                villain[i].bullets.splice(j, 1);
                break;
            }
        }
        if (villain[i].x > cnv.width || villain[i].x < 0) {
            edge = true;
        }
    }
    if (edge) {
        for (let i = 0; i < villain.length; i++) {
            villain[i].shiftdown();
        }
    }
    for (let i = 0; i < bullet.length; i++) {
        bullet[i].show();
        bullet[i].move(13);
        for (let j = 0; j < villain.length; j++) {
            if (bullet[i].hits(villain[j])) {
                bullet[i].delete();
                villain.splice(j, 1);
            }
        }
    }
    for (let i = bullet.length - 1; i >= 0; i--) {
        if (!bullet[i].fire || bullet[i].y < 0) {
            bullet.splice(i, 1);
        }
    }
    ctx.font = "36px Arial";
    ctx.fillStyle = "white";
    let lives_text = `Lives: ${lives}`;
    ctx.fillText(`Points: ${points}`, 20, 36);
    ship.show();
    ctx.fillText(lives_text, cnv.width - (ctx.measureText(lives_text).width + 20), 36)
    if (villain.length == 0 && lives > 0) {
        wave++;
        enemySpeed += 0.3;
        bullet = [];
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, cnv.width, cnv.height);
        ctx.font = "72px Arial";
        ctx.fillStyle = "white";
        let text = "Wave: " + wave
        ctx.fillText(text, (cnv.width / 2) - (ctx.measureText(text).width / 2), (cnv.height / 2) - (72 / 2));
        setTimeout(() => {
            requestAnimationFrame(draw)
            spawnEnemies(7, wave);
        }, 1000)
    } else {
        if (lives <= 0) {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, cnv.width, cnv.height);
            ctx.font = "72px Arial";
            ctx.fillStyle = "white";
            let text = "Game Over!";
            ctx.fillText(text, (cnv.width / 2) - (ctx.measureText(text).width / 2), (cnv.height / 2) - (72 / 2));
        } else {
            requestAnimationFrame(draw);
        }
    }
}

function Bullet(x, y, dir) {
    this.x = x;
    this.y = y;
    this.r = 8;
    this.direction = dir;
    this.fire = true;
    this.delete = function () {
        this.fire = false;
    }
    this.show = function () {
        ctx.fillStyle = "pink";
        ctx.fillCircleXYR(this.x, this.y, this.r);
    }
    this.move = function (spd) {
        this.y -= spd * this.direction;
    }
    this.hits = function (object) {
        let d = ctx.distance(this.x, this.y, object.x, object.y);
        if (d < this.r + object.r) {
            return true;
        } else {
            return false
        }
    }
}

function Enemy(x, y, shoot) {
    this.x = x;
    this.shooting = shoot;
    this.y = y;
    this.r = 20;
    this.bullets = []
    this.xmovement = enemySpeed;
    this.show = function () {
        ctx.fillStyle = "aqua";
        ctx.fillCircleXYR(this.x, this.y, this.r);
        for (let i = 0; i < this.bullets.length; i++) {
            ctx.fillStyle = "white";
            ctx.fillCircleXYR(this.bullets[i].x, this.bullets[i].y, this.r / 2);
        }
    }
    this.shiftdown = function () {
        this.y += 10;
        this.xmovement = -this.xmovement;
    }
    this.shoot = function () {
        if (this.shooting) {
            this.bullets.push(new Bullet(this.x, this.y, -1))
        }
    }
    this.move = function () {
        this.x += this.xmovement;
    }
}

function Player(x, y) {
    this.x = x;
    this.y = y;
    this.r = 20;
    this.xspeed = 0;
    this.fire = true;
    this.show = function () {
        ctx.fillStyle = "white";
        ctx.fillCircleXYR(this.x, this.y, this.r);
        ctx.fillRect(this.x - 20, this.y - 30, 5, 30)
        ctx.fillRect(this.x + 15, this.y - 30, 5, 30)
        ctx.fillRect(this.x - 2.5, this.y - 50, 5, 50)
    }
    this.move = function () {
        this.x += this.xspeed;
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x > cnv.width - 20) {
            this.x = cnv.width - 20;
        }
    }
    this.settingXDirection = function (dir) {
        this.xspeed = dir;
    }
}

document.addEventListener("keyup", released);
function released(event) {
    if (event.code == "ArrowRight" || event.code == "ArrowLeft") {
        ship.settingXDirection(0);
    }
}