const columns = 10;
const rows = 20;

let block_size = 30;
let btnPlayByScreen = "btn-play";
let btnResetByScreen = "btn-reset";

if (window.innerWidth <= 576) {
  btnPlayByScreen = "btn-play-mobile";
  btnResetByScreen = "btn-reset-mobile";
  block_size = 26;
}

const listColorMap = [
  "#227093",
  "#f1c40f",
  "#20bf6b",
  "#e74c3c",
  "#0abde3",
  "#e67e22",
  "#be2edd",
  "white",
];

const listBrick = [
  [
    [
      [1, 7, 7],
      [1, 1, 1],
      [7, 7, 7],
    ],
    [
      [7, 1, 1],
      [7, 1, 7],
      [7, 1, 7],
    ],
    [
      [7, 7, 7],
      [1, 1, 1],
      [7, 7, 1],
    ],
    [
      [7, 1, 7],
      [7, 1, 7],
      [1, 1, 7],
    ],
  ],
  [
    [
      [7, 1, 7],
      [7, 1, 7],
      [7, 1, 1],
    ],
    [
      [7, 7, 7],
      [1, 1, 1],
      [1, 7, 7],
    ],
    [
      [1, 1, 7],
      [7, 1, 7],
      [7, 1, 7],
    ],
    [
      [7, 7, 1],
      [1, 1, 1],
      [7, 7, 7],
    ],
  ],
  [
    [
      [1, 7, 7],
      [1, 1, 7],
      [7, 1, 7],
    ],
    [
      [7, 1, 1],
      [1, 1, 7],
      [7, 7, 7],
    ],
    [
      [7, 1, 7],
      [7, 1, 1],
      [7, 7, 1],
    ],
    [
      [7, 7, 7],
      [7, 1, 1],
      [1, 1, 7],
    ],
  ],
  [
    [
      [7, 1, 7],
      [1, 1, 7],
      [1, 7, 7],
    ],
    [
      [1, 1, 7],
      [7, 1, 1],
      [7, 7, 7],
    ],
    [
      [7, 7, 1],
      [7, 1, 1],
      [7, 1, 7],
    ],
    [
      [7, 7, 7],
      [1, 1, 7],
      [7, 1, 1],
    ],
  ],
  [
    [
      [7, 7, 7, 7],
      [7, 1, 1, 7],
      [7, 1, 1, 7],
      [7, 7, 7, 7],
    ],
    [
      [7, 7, 7, 7],
      [7, 1, 1, 7],
      [7, 1, 1, 7],
      [7, 7, 7, 7],
    ],
    [
      [7, 7, 7, 7],
      [7, 1, 1, 7],
      [7, 1, 1, 7],
      [7, 7, 7, 7],
    ],
    [
      [7, 7, 7, 7],
      [7, 1, 1, 7],
      [7, 1, 1, 7],
      [7, 7, 7, 7],
    ],
  ],
  [
    [
      [7, 1, 7],
      [1, 1, 1],
      [7, 7, 7],
    ],
    [
      [7, 1, 7],
      [7, 1, 1],
      [7, 1, 7],
    ],
    [
      [7, 7, 7],
      [1, 1, 1],
      [7, 1, 7],
    ],
    [
      [7, 1, 7],
      [1, 1, 7],
      [7, 1, 7],
    ],
  ],
  [
    [
      [7, 7, 7, 7],
      [1, 1, 1, 1],
      [7, 7, 7, 7],
      [7, 7, 7, 7],
    ],
    [
      [7, 7, 1, 7],
      [7, 7, 1, 7],
      [7, 7, 1, 7],
      [7, 7, 1, 7],
    ],
    [
      [7, 7, 7, 7],
      [7, 7, 7, 7],
      [1, 1, 1, 1],
      [7, 7, 7, 7],
    ],
    [
      [7, 1, 7, 7],
      [7, 1, 7, 7],
      [7, 1, 7, 7],
      [7, 1, 7, 7],
    ],
  ],
];

const key_control = {
  left: "ArrowLeft",
  right: "ArrowRight",
  up: "ArrowUp",
  down: "ArrowDown",
};

const colorWhiteIndex = 7;

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

ctx.canvas.width = columns * block_size;
ctx.canvas.height = rows * block_size;

let level = 400;

class Board {
  constructor(ctx) {
    this.ctx = ctx;
    this.grid = this.generateBoard();
    this.score = 0;
    this.gameOver = false;
    this.isPlaying = false;

    this.moveAudio = new Audio("./audio/press.mp3");
    this.completeAudio = new Audio("./audio/bingo.mp3");
  }

  generateBoard() {
    return Array.from({ length: rows }, () =>
      Array(columns).fill(colorWhiteIndex)
    );
  }

  roundRect(x, y) {
    const radius = 10;

    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + block_size - radius, y);
    this.ctx.quadraticCurveTo(x + block_size, y, x + block_size, y + radius);
    this.ctx.lineTo(x + block_size, y + block_size - radius);
    this.ctx.quadraticCurveTo(
      x + block_size,
      y + block_size,
      x + block_size - radius,
      y + block_size
    );
    this.ctx.lineTo(x + radius, y + block_size);
    this.ctx.quadraticCurveTo(x, y + block_size, x, y + block_size - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.quadraticCurveTo(x, y, x + radius, y);
    this.ctx.closePath();

    this.ctx.fill();
    this.ctx.stroke();
  }

  drawCell(xAxis, yAxis, colorId) {
    this.ctx.fillStyle = listColorMap[colorId] || colorWhiteIndex;
    this.ctx.strokeStyle = "#ecf0f1";
    // this.ctx.strokeStyle = "white"

    this.roundRect(xAxis * block_size, yAxis * block_size, true, true);
  }

  drawBoard() {
    for (let row = 0; row <= this.grid.length - 1; row++) {
      for (let col = 0; col <= this.grid[0].length - 1; col++) {
        this.drawCell(col, row, this.grid[row][col]);
      }
    }
  }

  reset() {
    this.score = 0;
    this.gameOver = false;
    this.grid = this.generateBoard();
    document.getElementById("score").innerHTML = this.score;
    this.drawBoard();
  }

  handleScore(score) {
    this.score += score;
    let classScore = document.getElementsByClassName("score");
    for (let i = 0; i <= classScore.length; i++) {
      classScore[i].innerHTML = this.score;
    }
  }

  handleComplete() {
    const notComplete = this.grid.filter((col) => {
      return col.some((item) => item === colorWhiteIndex);
    });

    const newScore = rows - notComplete.length;

    if (newScore) {
      this.completeAudio.play();
      const newGrid = Array.from({ length: newScore }, () =>
        Array(columns).fill(colorWhiteIndex)
      );
      this.grid = [...newGrid, ...notComplete];
      board.drawBoard();
      this.handleScore(newScore * 10);
    }
  }

  handleGameOver() {
    this.gameOver = true;
    btnPlay.disabled = false;
	
	themeSong.pause();
	themeSong.currentTime = 0;
    let modal = bootstrap.Modal.getOrCreateInstance(
      document.getElementById("myModal")
    );
    modal.toggle();
  }
}

class Brick {
  constructor(colorId, col) {
    this.colorId = colorId;
    this.layout = listBrick[this.colorId];
    this.colPos = col || 3;
    this.rowPos = -2;
    this.activeStatus = 0;
  }

  clear() {
    for (let row = 0; row <= this.layout[this.activeStatus].length - 1; row++) {
      for (
        let col = 0;
        col <= this.layout[this.activeStatus][0].length - 1;
        col++
      ) {
        if (this.layout[this.activeStatus][row][col] !== 7) {
          board.drawCell(col + this.colPos, row + this.rowPos, colorWhiteIndex);
        }
      }
    }
  }

  draw() {
    for (let row = 0; row <= this.layout[this.activeStatus].length - 1; row++) {
      for (
        let col = 0;
        col <= this.layout[this.activeStatus][0].length - 1;
        col++
      ) {
        if (this.layout[this.activeStatus][row][col] !== colorWhiteIndex) {
          board.drawCell(col + this.colPos, row + this.rowPos, this.colorId);
        }
      }
    }
  }

  checkCollision(nextRow, nextCol, nextLayout) {
    for (let row = 0; row <= nextLayout.length - 1; row++) {
      for (let col = 0; col <= nextLayout[0].length - 1; col++) {
        if (nextLayout[row][col] !== colorWhiteIndex && nextRow >= 0) {
          if (
            nextCol + col < 0 ||
            nextCol + col >= columns ||
            nextRow + row >= rows ||
            board.grid[row + nextRow][col + nextCol] !== colorWhiteIndex
          )
            return true;
        }
      }
    }

    return false;
  }

  handleLanded() {
    if (this.rowPos <= 0) {
      board.handleGameOver();
      return;
    }

    for (let row = 0; row <= this.layout[this.activeStatus].length - 1; row++) {
      for (
        let col = 0;
        col <= this.layout[this.activeStatus][0].length - 1;
        col++
      ) {
        if (this.layout[this.activeStatus][row][col] !== colorWhiteIndex) {
          board.grid[row + this.rowPos][col + this.colPos] = this.colorId;
        }
      }
    }
    board.drawBoard();
  }

  moveLeft() {
    if (
      !this.checkCollision(
        this.rowPos,
        this.colPos - 1,
        this.layout[this.activeStatus]
      )
    ) {
      this.clear();
      this.colPos--;
      this.draw();
    }
  }

  moveRight() {
    if (
      !this.checkCollision(
        this.rowPos,
        this.colPos + 1,
        this.layout[this.activeStatus]
      )
    ) {
      this.clear();
      this.colPos++;
      this.draw();
    }
  }

  moveDown() {
    if (
      !this.checkCollision(
        this.rowPos + 1,
        this.colPos,
        this.layout[this.activeStatus]
      )
    ) {
      this.clear();
      this.rowPos++;
      this.draw();

      return;
    }
    generateRandomBrick();
    this.handleLanded();
    board.handleComplete();
  }

  rotate() {
    if (
      !this.checkCollision(
        this.rowPos,
        this.colPos,
        this.layout[(this.activeStatus + 1) % 4]
      )
    ) {
      this.clear();
      this.activeStatus = (this.activeStatus + 1) % 4;
      this.draw();
    }
  }
}

function generateRandomBrick() {
  brick = new Brick(Math.floor((Math.random() * 10) % 7));
  brick.draw();
}

function arrowControl(key) {
  if (!board.gameOver) {
    switch (key) {
      case key_control.left:
        brick.moveLeft();
        break;
      case key_control.right:
        brick.moveRight();
        break;
      case key_control.up:
        brick.rotate();
        break;
      case key_control.down:
        brick.moveDown();
        break;
      default:
        break;
    }
  }
}

const board = new Board(ctx);
board.drawBoard();

// handle event
var btnPlay = document.getElementById(btnPlayByScreen);
var btnReset = document.getElementById(btnResetByScreen);
var themeSong = document.getElementById("hitSound");
var moveSound = document.getElementById("moveSound");
var bingoSound = document.getElementById("bingoSound");

btnPlay.addEventListener("click", () => {
  
  themeSong.loop = true
  themeSong.play();
  board.reset();
  generateRandomBrick();

  const refresh = setInterval(() => {
    if (!board.gameOver) {
      brick.moveDown();
    } else {
      clearInterval(refresh);
    }
  }, level);

  document.addEventListener("keydown", (e) => {
    if (!board.gameOver) {
      switch (e.code) {
        case key_control.left:
          brick.moveLeft();
          break;
        case key_control.right:
          brick.moveRight();
          break;
        case key_control.up:
          brick.rotate();
          break;
        case key_control.down:
          brick.moveDown();
          break;
        default:
          break;
      }
    }
  });

  btnPlay.disabled = true;
});

btnReset.addEventListener("click", () => {
  btnPlay.disabled = false;
  board.gameOver = true;
  board.grid = board.generateBoard();
  board.drawBoard();

  themeSong.pause();
  themeSong.currentTime = 0;

  board.score = 0;
  let classScore = document.getElementsByClassName("score");
  for (let i = 0; i <= classScore.length; i++) {
    classScore[i].innerHTML = 0;
  }
});
