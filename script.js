// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Background color
renderer.setClearColor(0x87CEEB); // Sky blue

// Speed indicator
const speedIndicator = document.createElement("div");
speedIndicator.style.position = "absolute";
speedIndicator.style.top = "10px";
speedIndicator.style.left = "10px";
speedIndicator.style.padding = "5px 10px";
speedIndicator.style.background = "gray";
speedIndicator.style.color = "white";
speedIndicator.style.fontSize = "14px";
document.body.appendChild(speedIndicator);

// Create car
const car = new THREE.Group();
const bodyGeometry = new THREE.BoxGeometry(2, 1, 4);
const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.position.y = 0.5;
car.add(body);
scene.add(car);

// Camera follow variables
const cameraOffset = new THREE.Vector3(0, 3, 8);
const smoothFactor = 0.1;

function updateCamera() {
    const targetPosition = car.position.clone().add(cameraOffset.clone().applyMatrix4(car.matrixWorld));
    camera.position.lerp(targetPosition, smoothFactor);
    camera.lookAt(car.position);
}

// Controls
const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const keys = {};
if (!isMobile) {
    window.addEventListener("keydown", (e) => (keys[e.code] = true));
    window.addEventListener("keyup", (e) => (keys[e.code] = false));
}

// Touch controls
let touchX = 0, touchStartX = 0;
let touchY = 0, touchStartY = 0;
let isTouching = false;

window.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isTouching = true;
    }
});

window.addEventListener("touchmove", (e) => {
    if (isTouching && e.touches.length === 1) {
        touchX = e.touches[0].clientX - touchStartX;
        touchY = e.touches[0].clientY - touchStartY;
    }
});

window.addEventListener("touchend", () => {
    isTouching = false;
    touchX = 0;
    touchY = 0;
});

// Car movement variables
let speed = 0;
let turnSpeed = 0;
const maxSpeed = 0.2;
const acceleration = 0.008; // Adjusted for smoother acceleration
const friction = 0.004; // Less friction for better control
const turnRate = 0.015; // Lowered turn sensitivity

function updateCar() {
    if (isMobile) {
        if (touchY < -30) speed = Math.min(speed + acceleration, maxSpeed);
        else if (touchY > 30) speed = Math.max(speed - acceleration, -maxSpeed / 2);

        if (touchX < -30) turnSpeed = -turnRate;
        else if (touchX > 30) turnSpeed = turnRate;
        else turnSpeed = 0;
    } else {
        if (keys["ArrowUp"]) speed = Math.min(speed + acceleration, maxSpeed);
        else if (keys["ArrowDown"]) speed = Math.max(speed - acceleration, -maxSpeed / 2);
        else {
            if (speed > 0) speed = Math.max(speed - friction, 0);
            else if (speed < 0) speed = Math.min(speed + friction, 0);
        }

        if (keys["ArrowLeft"]) turnSpeed = -turnRate;
        else if (keys["ArrowRight"]) turnSpeed = turnRate;
        else turnSpeed = 0;
    }

    car.rotation.y += turnSpeed * (speed !== 0 ? 1 : 0);
    car.position.x -= Math.sin(car.rotation.y) * speed;
    car.position.z -= Math.cos(car.rotation.y) * speed;

    // Update speed indicator
    speedIndicator.innerText = `Speed: ${(speed * 100).toFixed(0)}`;
}

// Road variables
const roadSegments = [];
const segmentLength = 10;
const numSegments = 10;
const roadWidth = 5;

function createRoadSegment(z) {
    const geometry = new THREE.PlaneGeometry(roadWidth, segmentLength);
    const material = new THREE.MeshBasicMaterial({ color: 0x555555, side: THREE.DoubleSide });
    const segment = new THREE.Mesh(geometry, material);
    segment.rotation.x = -Math.PI / 2;
    segment.position.set(0, 0, z);
    scene.add(segment);
    roadSegments.push(segment);
}

// Generate initial road
for (let i = 0; i < numSegments; i++) {
    createRoadSegment(i * segmentLength);
}

function updateRoad() {
    for (let i = 0; i < roadSegments.length; i++) {
        if (roadSegments[i].position.z - car.position.z < -segmentLength) {
            roadSegments[i].position.z += numSegments * segmentLength;
        }
    }
}

// Update function
function update() {
    updateCar();
    updateRoad();
    updateCamera();
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
}
animate();
