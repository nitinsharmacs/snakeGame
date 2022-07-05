const px = (value) => `${value}px`;

const random = (lower, upper) => {
  return lower + (Math.random() * (upper - lower));
};

const removeElement = (elementId) => {
  const element = document.getElementById(elementId);
  element && element.remove();
};

class GameCanvas {
  #id;
  #canvas;
  constructor(id, pxSize, width, height, canvas) {
    this.#id = id;
    this.pxSize = pxSize;
    this.width = width;
    this.height = height;
    this.#canvas = canvas;
  }

  render({ id, element }) {
    removeElement(id);
    this.#canvas.appendChild(element);
  }
}

const createGameCanvas = (pxSize, width, height) => {
  const page = document.getElementById('page');

  removeElement('game-canvas');
  const canvasElement = document.createElement('div');

  canvasElement.id = 'game-canvas';
  canvasElement.style.width = px(width * pxSize);
  canvasElement.style.height = px(height * pxSize);
  canvasElement.classList.add('canvas');

  page.appendChild(canvasElement);
  return new GameCanvas('game-canvas',
    pxSize,
    width,
    height,
    canvasElement
  );
};

const snakeSegment = ({ x, y }, size, id, ...classes) => {
  const segmentElemet = document.createElement('div');

  segmentElemet.id = `snake-segment-${id}`;
  segmentElemet.classList.add('cell', 'snake-segment', ...classes);
  segmentElemet.style.width = size;
  segmentElemet.style.left = px(x);
  segmentElemet.style.top = px(y);

  return segmentElemet;
};

const renderSnake = ({ id, body, size }, gameCanvas) => {
  const snakeElement = document.createElement('div');
  snakeElement.id = id;
  snakeElement.classList.add('snake-body');

  const [snakeHead] = body;
  const snakeHeadElement = snakeSegment(snakeHead, size, 'head', 'snake-head');
  snakeElement.appendChild(snakeHeadElement);

  body.slice(1).forEach((segment, index) => {
    const snakeSegmentElement = snakeSegment(segment, size, index);
    snakeElement.appendChild(snakeSegmentElement);
  });

  gameCanvas.render({ id: id, element: snakeElement });
};

class Snake {
  constructor(id, size, position) {
    this.id = id;
    this.size = size;
    this.body = [position];
    this.dx = 0;
    this.dy = 0;
    this.ateFood = false;
    this.direction = null;
  }

  moveForward() {
    const [{ x, y }] = this.body;
    this.body.unshift({ x: x + this.dx, y: this.dy + y });
    this.body.pop();
    this.ateFood = false;
  }

  turnLeft() {
    if (this.direction === 'right') return;

    this.direction = 'left';
    this.dx = -this.size;
    this.dy = 0;
  }

  turnRight() {
    if (this.direction === 'left') return;

    this.direction = 'right';
    this.dx = this.size;
    this.dy = 0;
  }

  turnDown() {
    if (this.direction === 'up') return;

    this.direction = 'down';
    this.dy = this.size;
    this.dx = 0;
  }

  turnUp() {
    if (this.direction === 'down') return;

    this.direction = 'up';
    this.dy = -this.size;
    this.dx = 0;
  }

  eatFood() {
    const snakeTail = this.body[this.body.length - 1];
    this.body.push(snakeTail);
  }

  hasGotFood({ location }) {
    const [snakeHead] = this.body;
    return snakeHead.x === location.x && snakeHead.y === location.y;
  }

  hasHitWithWall({ pxSize: pxSize, width, height }) {
    const [snakeHead] = this.body;
    return (
      snakeHead.x >= (width * pxSize) ||
      snakeHead.y >= (height * pxSize) ||
      snakeHead.x < 0 ||
      snakeHead.y < 0
    );
  }

  hasOwnHit() {
    const [snakeHead, ...restBody] = this.body;
    return restBody.some(({ x, y }) =>
      x === snakeHead.x && y === snakeHead.y);
  }
}

const createSnake = ({ size }, position) => {
  const snakeId = 'snake';
  return new Snake(
    snakeId,
    size,
    position
  );
};

const randomCell = (cellSize, gridWidth, gridHeight) => {
  const x = Math.round(random(0, gridWidth - 1)) * cellSize;
  const y = Math.round(random(0, gridHeight - 1)) * cellSize;

  return { x, y };
};

const isOccupied = (newLocation, occupiedLocations) => {
  return occupiedLocations.some(({ x, y }) =>
    newLocation.x === x && newLocation.y === y);
};

class Food {
  constructor(id, icon, size, location) {
    this.id = id;
    this.icon = icon;
    this.size = size;
    this.location = location;
  }

  cook({ pxSize, width, height }, occupiedLocations) {
    let cellLocation = null;

    do {
      cellLocation = randomCell(pxSize, width, height);
    } while (isOccupied(cellLocation, occupiedLocations))

    this.location = cellLocation;
    return cellLocation;
  }
}

const renderFood = ({ id, icon, location, size }, gameCanvas) => {
  const foodElement = document.createElement('div');

  foodElement.id = id;
  foodElement.classList.add('cell', 'food');
  foodElement.style.left = px(location.x);
  foodElement.style.top = px(location.y);
  foodElement.style.width = px(size);
  foodElement.innerText = icon;

  gameCanvas.render({ id, element: foodElement });
};

const createFood = (size) => {
  return new Food(
    'foody',
    '',
    size
  );
};

const runUserAction = (userAction, snake) => {
  switch (userAction) {
    case 'ArrowLeft':
      snake.turnLeft();
      break;

    case 'ArrowRight':
      snake.turnRight();
      break;

    case 'ArrowUp':
      snake.turnUp();
      break;

    case 'ArrowDown':
      snake.turnDown();
      break;
  }
};

const watchUserAction = (snake) => {
  window.onkeydown = (event) => {
    runUserAction(event.code, snake);
  };
};

class ScoreBoard {
  constructor(player) {
    this.player = player;
    this.score = 0;
    this.scoreDelta = 1;
  }

  update() {
    this.score += this.scoreDelta;
  }

  resetScore() {
    this.score = 0;
  }
}

const renderScoreBoard = ({ player, score }) => {
  const playerElement = document.getElementById('player');
  const scoreElement = document.getElementById('score');
  console.log(player);
  playerElement.innerText = player;
  scoreElement.innerText = score;
};

const toggleGameOverPopup = () => {
  const gameOverPopup = document.getElementById('game-over-popup');
  gameOverPopup.classList.toggle('show-popup');
};

const startGame = (game) => {
  const { snake, canvas, food, scoreBoard } = game;

  watchUserAction(snake);

  renderScoreBoard(scoreBoard);
  renderSnake(snake, canvas);

  food.cook(canvas, snake.body);
  renderFood(food, canvas);

  const intervalId = setInterval(() => {
    if (snake.hasGotFood(food)) {
      snake.eatFood();

      food.cook(canvas, snake.body);
      renderFood(food, canvas);

      scoreBoard.update();
      renderScoreBoard(scoreBoard);
    }

    snake.moveForward();

    if (game.isOver()) {
      clearInterval(intervalId);
      toggleGameOverPopup();
      return;
    }
    renderSnake(snake, canvas);
  }, 100);
};

class Game {
  constructor(canvas, snake, food, scoreBoard) {
    this.canvas = canvas;
    this.snake = snake;
    this.food = food;
    this.scoreBoard = scoreBoard;
  }

  isOver() {
    return this.snake.hasHitWithWall(this.canvas) || this.snake.hasOwnHit();
  }
}

const createGame = (player, cellSize, width, height) => {
  const gameCanvas = createGameCanvas(cellSize, width, height);

  const snakePosition = randomCell(cellSize, width, height);
  const snake = createSnake({ size: cellSize }, snakePosition);

  const food = createFood(cellSize);

  const scoreBoard = new ScoreBoard(player);

  return new Game(gameCanvas, snake, food, scoreBoard);
};

const restartGame = (player) => {
  const game = createGame(player, 20, 25, 25);
  startGame(game);
};

const main = () => {
  const player = prompt('Please enter your name');
  const game = createGame(player, 20, 25, 25);

  startGame(game);

  const restartButton = document.getElementById('restart-btn');
  restartButton.onclick = () => {
    restartGame(player);
    toggleGameOverPopup();
  };
};

window.onload = main;
