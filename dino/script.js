const dino = document.getElementById('dino');
const obstacle = document.getElementById('obstacle');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const highScoreDisplay = document.getElementById('high-score');
const jumpSound = document.getElementById('jump-sound');
const gameOverSound = document.getElementById('gameover-sound');
const backgroundMusic = document.getElementById('background-music');

let isJumping = false;
let isGameOver = false;
let gameStarted = false;
let score = 0;
let timeElapsed = 0;
let obstacleSpeed = 10;

// Jump function
function jump() {
  if (isJumping) return; // Prevent double jump
  isJumping = true;
  jumpSound.play();

  let position = 0;
  let upInterval = setInterval(() => {
    if (position >= 150) {
      clearInterval(upInterval);

      // Falling down
      let downInterval = setInterval(() => {
        if (position <= 0) {
          clearInterval(downInterval);
          isJumping = false;
        }
        position -= 5;
        dino.style.bottom = position + 'px';
      }, 20);
    }
    // Going up
    position += 30;
    dino.style.bottom = position + 'px';
  }, 20);
}

// Obstacle movement
function moveObstacle() {
  let obstaclePosition = 1000;

  let timerId = setInterval(() => {
    if (isGameOver) {
      clearInterval(timerId); // Stop moving the obstacle if the game is over
      return;
    }

    obstaclePosition -= obstacleSpeed;
    obstacle.style.left = obstaclePosition + 'px';

    if (obstaclePosition <= 0) {
      obstaclePosition = 1000; // Reset obstacle position
    }

    // Collision detection using getBoundingClientRect()
    const dinoRect = dino.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    if (
      obstacleRect.left < dinoRect.right &&
      obstacleRect.right > dinoRect.left &&
      obstacleRect.bottom > dinoRect.top &&
      obstacleRect.top < dinoRect.bottom
    ) {
      clearInterval(timerId); // Stop obstacle movement
      endGame();
    }
  }, 20);
}

// Power-up logic
function spawnPowerUp() {
  const powerUp = document.createElement('div');
  powerUp.classList.add('power-up');
  powerUp.style.left = '1000px';
  document.querySelector('.game-container').appendChild(powerUp);

  let powerUpPosition = 1000;
  let powerUpInterval = setInterval(() => {
    if (powerUpPosition <= 0) {
      document.querySelector('.game-container').removeChild(powerUp);
      clearInterval(powerUpInterval);
    }

    const dinoRect = dino.getBoundingClientRect();
    const powerUpRect = powerUp.getBoundingClientRect();

    // Check if the dino collects the power-up
    if (
      powerUpRect.left < dinoRect.right &&
      powerUpRect.right > dinoRect.left &&
      powerUpRect.bottom > dinoRect.top &&
      powerUpRect.top < dinoRect.bottom
    ) {
      document.querySelector('.game-container').removeChild(powerUp);
      clearInterval(powerUpInterval);
      activatePowerUp(); // Apply the power-up effect
    }

    powerUpPosition -= 10;
    powerUp.style.left = powerUpPosition + 'px';
  }, 20);
}

function activatePowerUp() {
  obstacleSpeed += 5;
  setTimeout(() => {
    obstacleSpeed -= 5; // Return to normal speed after 5 seconds
  }, 5000);
}

// Score and time functionality
function startGame() {
  score = 0;
  timeElapsed = 0;
  isGameOver = false;
  obstacleSpeed = 10;
  backgroundMusic.play();

  setInterval(() => {
    if (!isGameOver) {
      score += 10;
      timeElapsed += 1;
      scoreDisplay.innerText = score;
      timeDisplay.innerText = timeElapsed;

      if (timeElapsed % 10 === 0) {
        obstacleSpeed += 2; // Increase difficulty over time
      }
    }
  }, 1000);

  moveObstacle();
  setInterval(spawnPowerUp, 10000); // Spawn power-up every 10 seconds
}

function endGame() {
  gameOverSound.play();
  backgroundMusic.pause();
  updateHighScore();
  alert('Game Over! Your final score is ' + score + '. Time: ' + timeElapsed + ' seconds.');
  isGameOver = true;
  
  document.getElementById('play-again').style.display = 'block'; // Show Play Again button
}

function updateHighScore() {
  let highScore = localStorage.getItem('highScore') || 0;
  if (score > highScore) {
    localStorage.setItem('highScore', score);
    highScoreDisplay.innerText = score;
  }
}

document.getElementById('play-again').addEventListener('click', () => {
  document.getElementById('play-again').style.display = 'none'; // Hide Play Again button
  startGame(); // Restart the game
});

document.addEventListener('keydown', (e) => {
  if (e.key === ' ' && !isGameOver) {
    if (!gameStarted) {
      startGame(); // Start the game on the first jump
      gameStarted = true;
    }
    jump();
  }
});

// Touch support for mobile devices
document.addEventListener('touchstart', (e) => {
  if (!isGameOver) {
    if (!gameStarted) {
      startGame();
      gameStarted = true;
    }
    jump();
  }
});

// Set initial high score
highScoreDisplay.innerText = localStorage.getItem('highScore') || 0;
