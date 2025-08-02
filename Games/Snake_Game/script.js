let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");  

// Snake axis
class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// Game constants
const tileCount = 20;
const tileSize = canvas.width / tileCount - 2;

// Game state
let speed = 7;
let headX = 10;
let headY = 10;
let snakeParts = [];
let tailLength = 2;
let appleX = 5;
let appleY = 5;
let inputsXVelocity = 0;
let inputsYVelocity = 0;
let xVelocity = 0;
let yVelocity = 0;
let score = 0;
let isPaused = false;
let lastRenderTime = 0;
let gameLoopId = null;

// Audio
let gulpSound = new Audio("gulp.mp3");
gulpSound.volume = 0.3;

// DOM Elements
const overlay = document.getElementById("gameOverOverlay");
const restartBtn = document.getElementById("restartBtn");
const exitBtn = document.getElementById("exitBtn");
const pauseBtn = document.getElementById("pauseBtn");
const startBtn = document.getElementById("startBtn");

// Event Listeners
pauseBtn.addEventListener("click", togglePause);
restartBtn.addEventListener("click", startGame);
exitBtn.addEventListener("click", () => {
  window.location.href = "../../index.html";
});
startBtn.addEventListener("click", startGame);
document.body.addEventListener("keydown", keyDown);

// Game Loop
function gameLoop(currentTime) {
  if (isPaused) return;
  
  gameLoopId = requestAnimationFrame(gameLoop);
  
  // Control frame rate
  const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
  if (secondsSinceLastRender < 1 / speed) return;
  lastRenderTime = currentTime;
  
  updateGame();
  drawGame();
}

function updateGame() {
  xVelocity = inputsXVelocity;
  yVelocity = inputsYVelocity;
  
  changeSnakePosition();
  
  if (isGameOver()) {
    overlay.classList.remove("hidden");
    cancelAnimationFrame(gameLoopId);
    return;
  }
  
  checkAppleCollision();
}

function drawGame() {
  clearScreen();
  drawApple();
  drawSnake();
  drawScore();
}

function isGameOver() {
  if (yVelocity === 0 && xVelocity === 0) return false;

  // Wall collision
  if (headX < 0 || headX >= tileCount || headY < 0 || headY >= tileCount) {
    return true;
  }

  // Self collision
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === headX && part.y === headY) {
      return true;
    }
  }

  return false;
}

function drawScore() {
  ctx.fillStyle = "#4cc9f0";
  ctx.font = "bold 20px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
  ctx.fillText("Score: " + score, canvas.width - 120, 30);
}

function clearScreen() {
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#0d1b2a");
  gradient.addColorStop(1, "#1b263b");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Grid lines
  ctx.strokeStyle = "rgba(76, 201, 240, 0.1)";
  ctx.lineWidth = 0.5;
  for (let i = 0; i < tileCount; i++) {
    // Vertical lines
    ctx.beginPath();
    ctx.moveTo(i * (tileSize + 2) + tileSize/2, 0);
    ctx.lineTo(i * (tileSize + 2) + tileSize/2, canvas.height);
    ctx.stroke();
    
    // Horizontal lines
    ctx.beginPath();
    ctx.moveTo(0, i * (tileSize + 2) + tileSize/2);
    ctx.lineTo(canvas.width, i * (tileSize + 2) + tileSize/2);
    ctx.stroke();
  }
}

function drawSnake() {
  // Draw snake parts with gradient
  for (let i = 0; i < snakeParts.length; i++) {
    const part = snakeParts[i];
    const gradient = ctx.createLinearGradient(
      part.x * (tileSize + 2), 
      part.y * (tileSize + 2), 
      part.x * (tileSize + 2) + tileSize, 
      part.y * (tileSize + 2) + tileSize
    );
    
    // Body gradient
    gradient.addColorStop(0, "#4361ee");
    gradient.addColorStop(1, "#3a0ca3");
    
    ctx.fillStyle = gradient;
    ctx.fillRect(
      part.x * (tileSize + 2) + 1, 
      part.y * (tileSize + 2) + 1, 
      tileSize, 
      tileSize
    );
    
    // Rounded corners
    ctx.strokeStyle = "#7209b7";
    ctx.lineWidth = 1;
    ctx.strokeRect(
      part.x * (tileSize + 2) + 1, 
      part.y * (tileSize + 2) + 1, 
      tileSize, 
      tileSize
    );
  }

  // Add new head position
  snakeParts.push(new SnakePart(headX, headY));
  
  // Remove extra parts
  while (snakeParts.length > tailLength) {
    snakeParts.shift();
  }

  // Draw head with different color
  const headGradient = ctx.createLinearGradient(
    headX * (tileSize + 2), 
    headY * (tileSize + 2), 
    headX * (tileSize + 2) + tileSize, 
    headY * (tileSize + 2) + tileSize
  );
  headGradient.addColorStop(0, "#f72585");
  headGradient.addColorStop(1, "#b5179e");
  
  ctx.fillStyle = headGradient;
  ctx.fillRect(
    headX * (tileSize + 2) + 1, 
    headY * (tileSize + 2) + 1, 
    tileSize, 
    tileSize
  );
  
  // Head eyes
  ctx.fillStyle = "white";
  const eyeSize = tileSize / 5;
  
  // Determine eye positions based on direction
  if (xVelocity === 1) { // Right
    ctx.fillRect(
      (headX + 0.7) * (tileSize + 2), 
      (headY + 0.2) * (tileSize + 2), 
      eyeSize, eyeSize
    );
    ctx.fillRect(
      (headX + 0.7) * (tileSize + 2), 
      (headY + 0.7) * (tileSize + 2), 
      eyeSize, eyeSize
    );
  } else if (xVelocity === -1) { // Left
    ctx.fillRect(
      (headX + 0.2) * (tileSize + 2), 
      (headY + 0.2) * (tileSize + 2), 
      eyeSize, eyeSize
    );
    ctx.fillRect(
      (headX + 0.2) * (tileSize + 2), 
      (headY + 0.7) * (tileSize + 2), 
      eyeSize, eyeSize
    );
  } else if (yVelocity === 1) { // Down
    ctx.fillRect(
      (headX + 0.2) * (tileSize + 2), 
      (headY + 0.7) * (tileSize + 2), 
      eyeSize, eyeSize
    );
    ctx.fillRect(
      (headX + 0.7) * (tileSize + 2), 
      (headY + 0.7) * (tileSize + 2), 
      eyeSize, eyeSize
    );
  } else { // Up or default
    ctx.fillRect(
      (headX + 0.2) * (tileSize + 2), 
      (headY + 0.2) * (tileSize + 2), 
      eyeSize, eyeSize
    );
    ctx.fillRect(
      (headX + 0.7) * (tileSize + 2), 
      (headY + 0.2) * (tileSize + 2), 
      eyeSize, eyeSize
    );
  }
}

function changeSnakePosition() {
  headX += xVelocity;
  headY += yVelocity;
}

function drawApple() {
  // Apple body
  ctx.fillStyle = "#ff4d6d";
  ctx.beginPath();
  ctx.arc(
    appleX * (tileSize + 2) + tileSize/2 + 1,
    appleY * (tileSize + 2) + tileSize/2 + 1,
    tileSize/2,
    0,
    Math.PI * 2
  );
  ctx.fill();
  
  // Apple shine
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.beginPath();
  ctx.arc(
    appleX * (tileSize + 2) + tileSize/3 + 1,
    appleY * (tileSize + 2) + tileSize/3 + 1,
    tileSize/6,
    0,
    Math.PI * 2
  );
  ctx.fill();
  
  // Apple stem
  ctx.fillStyle = "#7f5539";
  ctx.fillRect(
    appleX * (tileSize + 2) + tileSize/2 - 1,
    appleY * (tileSize + 2) - 2,
    2,
    4
  );
}

function checkAppleCollision() {
  if (appleX === headX && appleY === headY) {
    // Generate new apple position
    let newAppleX, newAppleY;
    let overlapping;
    
    do {
      overlapping = false;
      newAppleX = Math.floor(Math.random() * tileCount);
      newAppleY = Math.floor(Math.random() * tileCount);
      
      // Check if new apple overlaps with snake
      if (newAppleX === headX && newAppleY === headY) {
        overlapping = true;
      } else {
        for (let part of snakeParts) {
          if (part.x === newAppleX && part.y === newAppleY) {
            overlapping = true;
            break;
          }
        }
      }
    } while (overlapping);
    
    appleX = newAppleX;
    appleY = newAppleY;
    
    tailLength++;
    score++;
    gulpSound.currentTime = 0;
    gulpSound.play();
    
    // Increase speed every 5 points
    if (score % 5 === 0) {
      speed = Math.min(speed + 1, 20);
    }
  }
}

function keyDown(event) {
  // Prevent default behavior for arrow keys
  if ([37, 38, 39, 40].includes(event.keyCode)) {
    event.preventDefault();
  }
  
  // Up (ArrowUp or W)
  if (event.keyCode === 38 || event.keyCode === 87) {
    if (yVelocity === 1) return;
    inputsYVelocity = -1;
    inputsXVelocity = 0;
  }
  
  // Down (ArrowDown or S)
  if (event.keyCode === 40 || event.keyCode === 83) {
    if (yVelocity === -1) return;
    inputsYVelocity = 1;
    inputsXVelocity = 0;
  }
  
  // Left (ArrowLeft or A)
  if (event.keyCode === 37 || event.keyCode === 65) {
    if (xVelocity === 1) return;
    inputsYVelocity = 0;
    inputsXVelocity = -1;
  }
  
  // Right (ArrowRight or D)
  if (event.keyCode === 39 || event.keyCode === 68) {
    if (xVelocity === -1) return;
    inputsYVelocity = 0;
    inputsXVelocity = 1;
  }
  
  // Space to pause/resume
  if (event.keyCode === 32) {
    togglePause();
  }
}

function togglePause() {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? "Resume" : "Pause";
  
  if (!isPaused) {
    lastRenderTime = performance.now();
    gameLoopId = requestAnimationFrame(gameLoop);
  } else {
    cancelAnimationFrame(gameLoopId);
  }
}

function startGame() {
  // Reset game state
  headX = 10;
  headY = 10;
  snakeParts = [];
  tailLength = 2;
  appleX = 5;
  appleY = 5;
  inputsXVelocity = 1;
  inputsYVelocity = 0;
  xVelocity = 0;
  yVelocity = 0;
  score = 0;
  speed = 7;
  isPaused = false;
  
  // Hide overlay
  overlay.classList.add("hidden");
  
  // Update UI
  pauseBtn.textContent = "Pause";
  pauseBtn.style.display = "block";
  startBtn.style.display = "none";
  
  // Start game loop
  lastRenderTime = performance.now();
  gameLoopId = requestAnimationFrame(gameLoop);
}

// Draw initial state
function drawInitialBoard() {
  clearScreen();
  drawApple();
  drawSnake();
  drawScore();
}

// Initialize the game board
drawInitialBoard();