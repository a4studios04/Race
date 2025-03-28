script.js const canvas = document.getElementById("gameCanvas"); const ctx = canvas.getContext("2d"); canvas.width = window.innerWidth; canvas.height = window.innerHeight;

// Car properties const car = { x: canvas.width / 2, y: canvas.height - 100, width: 40, height: 60, speed: 0, maxSpeed: 5, acceleration: 0.2, friction: 0.05, angle: 0, };

const road = { x: canvas.width / 2 - 100, y: 0, width: 200, height: canvas.height * 2 }; let trees = [];

for (let i = 0; i < 15; i++) { trees.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height * 2 }); }

function update() { // Car movement if (keys["ArrowUp"]) car.speed += car.acceleration; if (keys["ArrowDown"]) car.speed -= car.acceleration; if (keys["ArrowLeft"]) car.angle -= 0.05; if (keys["ArrowRight"]) car.angle += 0.05;

car.speed *= 1 - car.friction;
car.speed = Math.max(-car.maxSpeed, Math.min(car.speed, car.maxSpeed));
car.x += Math.sin(car.angle) * car.speed;
car.y -= Math.cos(car.angle) * car.speed;

road.y -= car.speed;
trees.forEach(tree => tree.y -= car.speed);

render();
requestAnimationFrame(update);

}

function render() { ctx.clearRect(0, 0, canvas.width, canvas.height);

// Draw road
ctx.fillStyle = "gray";
ctx.fillRect(road.x, road.y, road.width, road.height);

// Draw trees
ctx.fillStyle = "green";
trees.forEach(tree => ctx.fillRect(tree.x, tree.y, 10, 10));

// Draw car
ctx.save();
ctx.translate(car.x, car.y);
ctx.rotate(car.angle);
ctx.fillStyle = "red";
ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height);
ctx.restore();

}

const keys = {}; window.addEventListener("keydown", (e) => keys[e.key] = true); window.addEventListener("keyup", (e) => keys[e.key] = false);

update();

