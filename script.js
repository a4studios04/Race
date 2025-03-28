// Updated script.js with gesture-based acceleration, steering wheel control, and road fixes

// Select canvas and get context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let car = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 100,
    width: 50,
    height: 80,
    speed: 0,
    maxSpeed: 10,
    acceleration: 0.2,
    friction: 0.05,
    angle: 0
};
let road = { x: 0, y: 0, width: canvas.width, height: canvas.height };

// Handle touch gestures
let touchStartY = 0;
let touchStartX = 0;
canvas.addEventListener("touchstart", (event) => {
    let touch = event.touches[0];
    touchStartY = touch.clientY;
    touchStartX = touch.clientX;
});

canvas.addEventListener("touchmove", (event) => {
    let touch = event.touches[0];
    let deltaY = touch.clientY - touchStartY;
    let deltaX = touch.clientX - touchStartX;

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
        // Vertical swipe: acceleration/deceleration
        if (deltaY < 0) {
            car.speed += car.acceleration; // Swipe up to accelerate
        } else {
            car.speed -= car.acceleration; // Swipe down to decelerate
        }
    } else {
        // Horizontal swipe: steering
        if (deltaX < 0) {
            car.angle -= 0.05; // Swipe left to turn left
        } else {
            car.angle += 0.05; // Swipe right to turn right
        }
    }
    touchStartY = touch.clientY;
    touchStartX = touch.clientX;
});

// Game loop
function update() {
    // Apply friction
    if (car.speed > 0) {
        car.speed -= car.friction;
    } else if (car.speed < 0) {
        car.speed += car.friction;
    }
    if (Math.abs(car.speed) < car.friction) car.speed = 0;

    // Keep speed within limits
    car.speed = Math.max(-car.maxSpeed, Math.min(car.speed, car.maxSpeed));

    // Update car position
    car.x += Math.sin(car.angle) * car.speed;
    car.y -= Math.cos(car.angle) * car.speed;

    // Keep the car within screen bounds
    if (car.x < 0) car.x = 0;
    if (car.x + car.width > canvas.width) car.x = canvas.width - car.width;
    if (car.y < 0) car.y = 0;
    if (car.y + car.height > canvas.height) car.y = canvas.height - car.height;

    draw();
    requestAnimationFrame(update);
}

// Draw game elements
function draw() {
    ctx.fillStyle = "skyblue"; // Background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "gray"; // Road
    ctx.fillRect(road.x + 50, road.y, road.width - 100, road.height);

    ctx.fillStyle = "red"; // Car
    ctx.save();
    ctx.translate(car.x + car.width / 2, car.y + car.height / 2);
    ctx.rotate(car.angle);
    ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height);
    ctx.restore();

    document.getElementById("speedDisplay").innerText = `Speed: ${Math.round(car.speed)}`;
}

// Start game loop
update();
