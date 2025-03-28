// Fully updated script.js with previous functions + new features

const canvas = document.getElementById("gameCanvas"); const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth; canvas.height = window.innerHeight;

let car = { x: canvas.width / 2, y: canvas.height - 100, width: 50, height: 30, angle: 0, speed: 0, maxSpeed: 10, acceleration: 0.2, friction: 0.05, };

let keys = {}; let touchStartY = 0; let touchEndY = 0;

window.addEventListener("keydown", (e) => keys[e.key] = true); window.addEventListener("keyup", (e) => keys[e.key] = false);

// Gesture-based acceleration canvas.addEventListener("touchstart", (e) => { touchStartY = e.touches[0].clientY; });

canvas.addEventListener("touchmove", (e) => { touchEndY = e.touches[0].clientY; let deltaY = touchStartY - touchEndY; if (deltaY > 20) car.speed += car.acceleration; // Move forward if (deltaY < -20) car.speed -= car.acceleration; // Move backward });

canvas.addEventListener("touchend", () => { touchStartY = 0; touchEndY = 0; });

// Steering wheel movement canvas.addEventListener("touchstart", (e) => { if (e.touches[0].clientX < canvas.width / 2) { car.angle -= 0.1; // Left turn } else { car.angle += 0.1; // Right turn } });

function update() { if (keys["ArrowUp"]) car.speed += car.acceleration; if (keys["ArrowDown"]) car.speed -= car.acceleration; if (keys["ArrowLeft"]) car.angle -= 0.05; if (keys["ArrowRight"]) car.angle += 0.05;

car.speed *= (1 - car.friction);
car.x += Math.sin(car.angle) * car.speed;
car.y -= Math.cos(car.angle) * car.speed;

draw();
requestAnimationFrame(update);

}

function draw() { ctx.clearRect(0, 0, canvas.width, canvas.height);

// Background
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Road
ctx.fillStyle = "gray";
ctx.fillRect(canvas.width / 4, 0, canvas.width / 2, canvas.height);

// Road sidelines
ctx.fillStyle = "lightblue";
ctx.fillRect(canvas.width / 4 - 10, 0, 10, canvas.height);
ctx.fillRect(canvas.width * 3 / 4, 0, 10, canvas.height);

// Car
ctx.save();
ctx.translate(car.x, car.y);
ctx.rotate(car.angle);
ctx.fillStyle = "red";
ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height);
ctx.restore();

// Speed Indicator
ctx.fillStyle = "white";
ctx.font = "16px Arial";
ctx.fillText("Speed: " + Math.round(car.speed), 10, 20);

}

update();

                        
