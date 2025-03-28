// Constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const MAP_SIZE = 5000;
const CAR_RADIUS = 15;
const TREE_RADIUS = 20;
const NUM_TREES = 200;
const MAX_FORWARD_SPEED = 200;
const MAX_REVERSE_SPEED = 50;
const ACCELERATION = 100;
const FRICTION = 0.5;
const TURN_RATE = Math.PI; // 180 degrees in radians

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game objects
let car = {
    x: MAP_SIZE / 2,
    y: MAP_SIZE / 2,
    direction: 0,
    speed: 0
};

let trees = [];
for (let i = 0; i < NUM_TREES; i++) {
    trees.push({
        x: Math.random() * MAP_SIZE,
        y: Math.random() * MAP_SIZE
    });
}

// Input handling
let keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

// Game loop
let lastTime = 0;
function gameLoop(timestamp) {
    let deltaTime = (timestamp - lastTime) / 1000; // Seconds
    lastTime = timestamp;

    update(deltaTime);
    render();
    requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
    // Steering
    let steering = 0;
    if (keys['ArrowLeft']) steering = -1;
    if (keys['ArrowRight']) steering = 1;
    car.direction += steering * TURN_RATE * deltaTime;

    // Acceleration
    let inputAcceleration = 0;
    if (keys['ArrowUp'] && car.speed < MAX_FORWARD_SPEED) {
        inputAcceleration = ACCELERATION;
    } else if (keys['ArrowDown'] && car.speed > -MAX_REVERSE_SPEED) {
        inputAcceleration = -ACCELERATION;
    }
    car.speed += (inputAcceleration - FRICTION * car.speed) * deltaTime;

    // Update position
    let velocityX = car.speed * Math.cos(car.direction);
    let velocityY = car.speed * Math.sin(car.direction);
    let newX = car.x + velocityX * deltaTime;
    let newY = car.y + velocityY * deltaTime;

    // Collision detection and response
    for (let tree of trees) {
        let dx = newX - tree.x;
        let dy = newY - tree.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < CAR_RADIUS + TREE_RADIUS) {
            let overlap = CAR_RADIUS + TREE_RADIUS - distance;
            let angle = Math.atan2(dy, dx);
            newX += Math.cos(angle) * overlap;
            newY += Math.sin(angle) * overlap;
        }
    }

    car.x = Math.max(CAR_RADIUS, Math.min(MAP_SIZE - CAR_RADIUS, newX));
    car.y = Math.max(CAR_RADIUS, Math.min(MAP_SIZE - CAR_RADIUS, newY));
}

function render() {
    // Camera position
    let cameraX = car.x - CANVAS_WIDTH / 2;
    let cameraY = car.y - CANVAS_HEIGHT / 2;

    // Clear canvas and draw grass
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw trees
    ctx.fillStyle = 'darkgreen';
    for (let tree of trees) {
        let screenX = tree.x - cameraX;
        let screenY = tree.y - cameraY;
        if (screenX > -TREE_RADIUS && screenX < CANVAS_WIDTH + TREE_RADIUS &&
            screenY > -TREE_RADIUS && screenY < CANVAS_HEIGHT + TREE_RADIUS) {
            ctx.beginPath();
            ctx.arc(screenX, screenY, TREE_RADIUS, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Draw car
    ctx.save();
    ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    ctx.rotate(car.direction);
    ctx.fillStyle = 'red';
    ctx.fillRect(-CAR_RADIUS, -CAR_RADIUS / 2, CAR_RADIUS * 2, CAR_RADIUS);
    ctx.restore();

    // Draw speedometer
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Speed: ${Math.round(Math.abs(car.speed))} px/s`, 10, 30);
}

// Start game
requestAnimationFrame(gameLoop);
