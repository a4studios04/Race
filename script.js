// script.js - Updated with detailed car, long road, camera tracking, and environment

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const car = {
    x: canvas.width / 2 - 20,
    y: canvas.height / 2 + 100,
    width: 40,
    height: 60,
    speed: 0,
    maxSpeed: 5,
    acceleration: 0.2,
    friction: 0.05,
    angle: 0,
};

const road = {
    x: canvas.width / 4,
    y: 0,
    width: canvas.width / 2,
    height: canvas.height * 5, // Long road
};

const trees = [];
for (let i = 0; i < 50; i++) {
    trees.push({ x: Math.random() * canvas.width, y: Math.random() * road.height });
}

function drawCar() {
    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.angle);
    ctx.fillStyle = "red";
    ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height);
    
    ctx.fillStyle = "black";
    ctx.fillRect(-car.width / 4, -car.height / 2, car.width / 2, 10); // Car front window
    ctx.restore();
}

function drawRoad() {
    ctx.fillStyle = "gray";
    ctx.fillRect(road.x, road.y, road.width, road.height);
}

function drawTrees() {
    ctx.fillStyle = "green";
    trees.forEach(tree => {
        ctx.beginPath();
        ctx.arc(tree.x, tree.y, 15, 0, Math.PI * 2);
        ctx.fill();
    });
}

function update() {
    if (keys["ArrowUp"]) {
        car.speed += car.acceleration;
    }
    if (keys["ArrowDown"]) {
        car.speed -= car.acceleration;
    }
    car.speed *= (1 - car.friction);
    car.y -= car.speed;

    if (keys["ArrowLeft"]) car.angle -= 0.05;
    if (keys["ArrowRight"]) car.angle += 0.05;

    trees.forEach(tree => tree.y -= car.speed);
}

const keys = {};
document.addEventListener("keydown", (event) => keys[event.key] = true);
document.addEventListener("keyup", (event) => keys[event.key] = false);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(0, -car.y + canvas.height / 2);
    drawRoad();
    drawTrees();
    ctx.restore();
    drawCar();
    update();
    requestAnimationFrame(animate);
}

animate();
