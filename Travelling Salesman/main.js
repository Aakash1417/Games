"use strict";
initGraphics(800, 600);
let cities = [];
let cityCount = prompt("Number of cities to search: ");
let finished = false;
let order = [];
let shotestDistance = cityCount * cnv.width;
let bestOrder = [];
let totalperm = Math.factorial(cityCount);
let finishedcount = 0;
let repeat = Math.round(cityCount * 5 / 9);
for (let i = 0; i < cityCount; i++) {
    cities[i] = { x: Math.random() * cnv.width, y: Math.random() * cnv.height/2 };
    order[i] = i;
}
requestAnimationFrame(draw);
function draw() {
    for (let i = 0; i < repeat; i++) {
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, cnv.width, cnv.height);
        let d = calcDistance(cities, order);
        if (d < shotestDistance) {
            shotestDistance = d;
            bestOrder = order.slice();
        }
        shuffle();
    }
    ctx.lineWidth = 3;
    ctx.font = "36px Ariel"
    ctx.fillStyle = "white";
    if (finishedcount * 100 / totalperm > 100) {
        finishedcount = totalperm;
    }
    ctx.fillText(`${(finishedcount * 100 / totalperm).toFixed(2)}%`, 0, 36);
    drawLines(bestOrder, 0, "purple", 3);
    drawLines(order, cnv.height/2, "white", 1);
    if (!finished) {
        requestAnimationFrame(draw);
    }
}
function drawLines(array, y_off_set, color, linewidth) {
    ctx.strokeStyle = color;
    ctx.fillStyle = "white";
    ctx.lineWidth = linewidth;
    ctx.beginPath();
    for (let i = 0; i < cities.length; i++) {
        ctx.lineTo(cities[array[i]].x, cities[array[i]].y + y_off_set);
    }
    ctx.stroke();
    for (let i = 0; i < cities.length; i++) {
        ctx.fillCircleXYR(cities[i].x, cities[i].y + y_off_set, 4);
    }
}

function calcDistance(points, order) {
    let sumOfDistance = 0;
    for (let i = 0; i < order.length - 1; i++) {
        let PrevCity = points[order[i]];
        let NextCity = points[order[i + 1]];
        let d = ctx.distance(PrevCity.x, PrevCity.y, NextCity.x, NextCity.y);
        sumOfDistance += d;
    }
    return sumOfDistance;
}

function shuffle() {
    finishedcount++;
    let largestX = -1;
    for (let x = 0; x < order.length - 1; x++) {
        if (order[x] < order[x + 1]) {
            largestX = x;
        }
    }
    if (largestX == -1) {
        console.log("Finished!");
        finished = true;
    }
    let largestY = -1;
    for (let y = 0; y < order.length; y++) {
        if (order[largestX] < order[y]) {
            largestY = y;
        }
    }
    swap(order, largestX, largestY);
    let endArray = order.splice(largestX + 1);
    endArray.reverse();
    order = order.concat(endArray);
}

document.addEventListener("keydown", keydown);

function keydown(event) {
    if (event.code == "Space" && finished == false) {
        finished = true;
    } else if (finished == true && event.code == "Space" && totalperm > finishedcount) {
        finished = false;
        requestAnimationFrame(draw);
    }
}