initGraphics(800, 600);

let player = new Ship(cnv.width / 2, cnv.height / 2);
const FRICTION = 0.03;
const SHIP_THRUST = 0.12;
const BULLET_SPEED = 12;
const SHIP_SPEED_LIMIT = 3;
const TURN_SPEED = 3;
const ASTEROID_COUNT = 5;
let firing = 0;
let spaceDebris = [];

//Generating asteroids and Asteroids class is in the roid.js file
for (let i = 0; i < ASTEROID_COUNT; i++) {
    spaceDebris.push(new Asteroid());
}

//main graphics loops
requestAnimationFrame(draw);
function draw() {
    //redrawing frames for every loop
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    //draw the players
    player.draw();
    player.update();
    //if player goes beyond edges then the ship loops back onto screen from the other side
    player.edges();

    for (let i = 0; i < spaceDebris.length; i++) {
        spaceDebris[i].show();
        spaceDebris[i].update();
        spaceDebris[i].edges();
        if (player.hits(spaceDebris[i]) && player.position.x + player.r < cnv.width && player.position.x - player.r > 0 && player.position.y + player.r < cnv.height && player.position.y - player.r > 0) {
            ctx.fillStyle = "white";
            ctx.font = "48px Arial"
            ctx.fillText("Game Over!", cnv.width / 2 - 48 * 2, cnv.height / 2);
            return;
        }
    }

    for (let i = player.bullets.length - 1; i >= 0; i--) {
        player.bullets[i].show();
        player.bullets[i].update();
        if (player.bullets[i].position.x > cnv.width || player.bullets[i].position.x < 0 || player.bullets[i].position.y > cnv.height || player.bullets[i].position.y < 0) {
            player.bullets.splice(i, 1);
            break;
        } else {
            for (let j = spaceDebris.length - 1; j >= 0; j--) {
                if (player.bullets[i].hits(spaceDebris[j])) {
                    player.bullets.splice(i, 1);
                    if (spaceDebris[j].r > 20) {
                        let car = spaceDebris[j].breakUp();
                        spaceDebris = spaceDebris.concat(car);
                    }
                    spaceDebris.splice(j, 1);
                    break;
                }
            }
        }
    }
    if (spaceDebris.length != 0) {
        requestAnimationFrame(draw);
    } else {
        ctx.fillStyle = "white";
        ctx.font = "48px Arial"
        ctx.fillText("You Win!", cnv.width / 2 - 48 * 2, cnv.height / 2);
    }
};

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function keyDown(event) {
    if (event.code == "Space") {
        player.bullets.push(
            new Bullet(
                player.position.x + 4 / 3 * player.r * Math.cos(player.a),
                player.position.y - 4 / 3 * player.r * Math.sin(player.a),
                player.a
            )
        );
    };
    if (event.code == "ArrowLeft") {
        player.rot = TURN_SPEED / 180 * Math.PI;
    } else if (event.code == "ArrowRight") {
        player.rot = -TURN_SPEED / 180 * Math.PI;
    }
    if (event.code == "ArrowUp") {
        player.thrusting = true;
    }
}

function keyUp(event) {
    if (event.code == "ArrowLeft") {
        player.rot = 0;
    } else if (event.code == "ArrowRight") {
        player.rot = 0;
    }
    if (event.code == "ArrowUp") {
        player.thrusting = false;
    }
};