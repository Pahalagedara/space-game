let cvs = document.getElementById("canvas");
let ctx = cvs.getContext("2d");

//images files

let ship = new Image();
let bg = new Image();
let gameOver = new Image();
let enemy = new Image();

ship.src = "assets/images/ship.png";
bg.src = "assets/images/bg.jpg";
enemy.src = "assets/images/enemy.png";
gameOver.src = "assets/images/over.png";

// audio files
let over = new Audio();
let scor = new Audio();

over.src = "assets/sounds/over.ogg";
scor.src = "assets/sounds/score.ogg";

//constant
let maxY = 620;
let maxX = 425;

//variables
let score = 0;
let secoundEnemy = 400;
let enemySpeed = 1;
let playerSpeed = 6;
let bX = maxX / 2;
let bY = maxY;
let isStoped = false;
let isGameOver = false;

// enemy coordinates
let enemyArray = [];

//start enemy position
enemyArray[0] = {
  x: 0,
  y: 0,
};

// user inputs
document.addEventListener("keydown", inputHandler);
function inputHandler(e) {
  if (!isStoped) {
    if (e.key === "a" || e.key === "ArrowLeft") moveLeft();
    if (e.key === "d" || e.key === "ArrowRight") moveRight();
    if (e.key === "w" || e.key === "ArrowUp") moveUp();
    if (e.key === "s" || e.key === "ArrowDown") moveDown();
  }
  if (isGameOver) {
    if (e.key === "r") restart();
  }
  if (e.key === "p") pause();
}
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

//actions
async function moveLeft() {
  for (let i = playerSpeed; i > 0; i--) {
    if (bX > 0) bX -= i;
    await delay(50);
  }
}
async function moveRight() {
  for (let i = playerSpeed; i > 0; i--) {
    if (bX < maxX) bX += i;
    await delay(50);
  }
}
async function moveUp() {
  for (let i = playerSpeed; i > 0; i--) {
    if (bY > 0) bY -= 1;
    await delay(50);
  }
}
async function moveDown() {
  for (let i = playerSpeed; i > 0; i--) {
    if (bY < maxY) bY += 1;
    await delay(50);
  }
}

function pause() {
  if (enemySpeed !== 0) {
    enemySpeed = 0;
    isStoped = true;
  } else {
    enemySpeed = 1;
    isStoped = false;
  }
}

function stop() {
  enemySpeed = 0;
  isStoped = true;
}

function restart() {
  location.reload();
}
function enemyHandler() {
  enemyArray.push({
    x: Math.random() * maxX,
    y: 0,
  });
}

function scoreHandler() {
  score++;
  scor.play();
}

function gameOverHandler() {
  if (!isGameOver) {
    isGameOver = true;
    over.play();
  }

  ctx.drawImage(gameOver, maxX / 2 - 120, maxY / 2 - gameOver.height / 2);
  stop();
}

//level design
function deficultyHandler() {
  if (score % 5 == 1) {
    if (secoundEnemy !== 200) {
      secoundEnemy -= 10;
    } else if (enemySpeed === 1) {
      secoundEnemy = 500;
      enemySpeed = 2;
    }
  }
}

// draw images
function draw() {
  ctx.drawImage(bg, 0, 0);
  ctx.fillStyle = "#fff";
  ctx.font = "30px Verdana";
  ctx.fillText("Space Traveler", 180, 50);

  for (let i = 0; i < enemyArray.length; i++) {
    ctx.drawImage(enemy, enemyArray[i].x, enemyArray[i].y);

    enemyArray[i].y += enemySpeed;

    if (enemyArray[i].y == 20) {
      deficultyHandler();
    }

    if (enemyArray[i].y == secoundEnemy) {
      enemyHandler();
    }

    //player
    ctx.drawImage(ship, bX, bY);

    // detect the collision
    if (
      ((bX <= enemyArray[i].x && bX + ship.width >= enemyArray[i].x) ||
        (bX <= enemyArray[i].x + enemy.width &&
          bX + ship.width >= enemyArray[i].x + enemy.width)) &&
      ((bY <= enemyArray[i].y && bY + ship.height >= enemyArray[i].y) ||
        (bY <= enemyArray[i].y + enemy.height - 20 &&
          bY + ship.height >= enemyArray[i].y + enemy.height - 20))
    ) {
      gameOverHandler();
    }

    if (enemyArray[i].y == maxY) {
      scoreHandler();
    }
  }

  //draw score and heigh score
  ctx.fillStyle = "#fff";
  ctx.font = "20px Verdana";
  ctx.fillText("Score : " + score, 10, cvs.height - 10);

  requestAnimationFrame(draw);
}

draw();
