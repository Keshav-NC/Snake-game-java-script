const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

// track snake length
class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let speed = 7;

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;

// for placing the head of snake at center
let headX = 10;
let headY = 10;

const snakeParts = [];
let tailLength = 0;

// for move snake around screen
let xMove = 0;
let yMove = 0;

// food
let appleX = 5;
let appleY = 5;

// score
let score = 0;

// audio
const gulpSound = new Audio("./assets/gulp.mp3");
const gameOverSound = new Audio("./assets/game-over.wav");

// game loop
function draw() {
  //   console.log("draw game");
  changeSnakePosition();
  // check any game over events occured --> hit wall, hit snake body
  let result = isGameOver();
  if (result) {
    // stop looping, no longer we gonna draw game
    return;
  }

  clearScreen();
  checkAppleCollision();
  drawApple();
  drawSnake();
  drawScore();
  if (score > 2) {
    speed = 11;
  }
  if (score > 5) {
    speed = 15;
  }
  setTimeout(draw, 1000 / speed);
}

function isGameOver() {
  let gameOver = false;

  //  walls
  // left wall
  if (headX < 0) {
    gameOver = true;
  }
  // right wall
  if (headX === tileCount) {
    gameOver = true;
  }
  // up wall
  if (headY < 0) {
    gameOver = true;
  }
  // down wall
  if (headY === tileCount) {
    gameOver = true;
  }

  // snake parts
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === headX && part.y === headY) {
      gameOver = true;
      break;
    }
  }

  if (gameOver) {
    context.fillStyle = "white";
    context.font = "3rem Verdana";

    var gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");

    context.fillStyle = gradient;

    context.fillText("Game Over!", canvas.width / 6, canvas.height / 2);
    gameOverSound.play();
  }
  //   console.log(gameOver);
  return gameOver;
}

function clearScreen() {
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  // adding tails to the snake
  context.fillStyle = "green";
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    context.fillRect(
      part.x * tileCount,
      part.y * tileCount,
      tileSize,
      tileSize
    );
  }

  snakeParts.push(new SnakePart(headX, headY)); // put an item at the end of the list next to the head
  if (snakeParts.length > tailLength) {
    // remove the first item from the snake parts if have more than our tail size

    /* Removes the first element from an array and returns it. If the array is empty, undefined is returned and the array is not modified. */
    snakeParts.shift();
  }

  // head of the snake
  context.fillStyle = "orange";
  context.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function changeSnakePosition() {
  headX = headX + xMove; // 3 + -1 = 2 --> left, 3 + 1 = 4 --> right
  headY = headY + yMove;
}

function drawApple() {
  context.fillStyle = "red";
  context.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function checkAppleCollision() {
  if (appleX == headX && appleY == headY) {
    // change the apple positon

    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;
    gulpSound.play();
    console.log(tailLength);
  }
}

function drawScore() {
  context.fillStyle = "white";
  context.font = "2rem, Verdana";
  context.fillText("Score " + score, canvas.width - 50, 10);
}

document.body.addEventListener("keydown", keyDown);

function keyDown(e) {
  // up arrow
  if (e.keyCode == 38) {
    if (yMove == 1) {
      // prevent downward movement
      return;
    }
    // move one tile up at a time
    yMove = -1;
    xMove = 0;
  }

  // down arrow
  if (e.keyCode == 40) {
    if (yMove == -1) {
      // prevent upward movement
      return;
    }
    // move one tile down at a time
    yMove = 1;
    xMove = 0;
  }

  // left arrow
  if (e.keyCode == 37) {
    if (xMove == 1) {
      // prevent right movement
      return;
    }
    // move one tile left at a time
    yMove = 0;
    xMove = -1;
  }

  // right arrow
  if (e.keyCode == 39) {
    if (xMove == -1) {
      // prevent left movement
      return;
    }
    // move one tile right at a time
    yMove = 0;
    xMove = 1;
  }
}

draw();
