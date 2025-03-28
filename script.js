document.addEventListener("DOMContentLoaded", function () { const canvas = document.getElementById("gameCanvas"); const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let car = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 50,
    height: 30,
    speed: 0,
    maxSpeed: 10,
    acceleration: 0.2,
    friction: 0.05,
    angle: 0
};

let road = {
    width: canvas.width * 0.6,
    x: (canvas.width - (canvas.width * 0.6)) / 2
};

let steeringAngle = 0;

function drawRoad() {
    ctx.fillStyle = "gray";
    ctx.fillRect(road.x, 0, road.width, canvas.height);
}

function drawCar() {
    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.angle);
    ctx.fillStyle = "red";
    ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height);
    ctx.restore();
}

function updateCar() {
    car.angle += steeringAngle * 0.05;
    car.x += Math.sin(car.angle) * car.speed;
    car.y -= Math.cos(car.angle) * car.speed;
    
    if (car.speed > 0) {
        car.speed -= car.friction;
    } else if (car.speed < 0) {
        car.speed += car.friction;
    }
}

function gameLoop() {
    ctx.fillStyle = "skyblue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawRoad();
    drawCar();
    updateCar();
    requestAnimationFrame(gameLoop);
}

gameLoop();

let startX, startY;
canvas.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

canvas.addEventListener("touchmove", (e) => {
    let diffX = e.touches[0].clientX - startX;
    let diffY = e.touches[0].clientY - startY;
    
    steeringAngle = diffX / 100;
    car.speed = Math.max(-car.maxSpeed, Math.min(car.maxSpeed, car.speed - diffY / 100));
});

canvas.addEventListener("touchend", () => {
    steeringAngle = 0;
});

});

