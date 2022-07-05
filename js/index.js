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
}

const renderScoreBoard = ({ player, score }) => {
  const playerElement = document.getElementById('player');
  const scoreElement = document.getElementById('score');

  playerElement.innerText = player;
  scoreElement.innerText = score;
};

const main = () => {
  const gameCanvas = createGameCanvas(20, 25, 25);
  const snakePosition = randomCell(20, 25, 25);
  const snake = createSnake({ size: 20 }, snakePosition);
  const food = createFood(20);
  const scoreBoard = new ScoreBoard('Nitin');

  renderSnake(snake, gameCanvas);

  food.cook(gameCanvas, snake.body);
  renderFood(food, gameCanvas);

  watchUserAction(snake);

  const intervalId = setInterval(() => {
    if (snake.hasGotFood(food)) {
      snake.eatFood();

      food.cook(gameCanvas, snake.body);
      renderFood(food, gameCanvas);

      scoreBoard.update();
      renderScoreBoard(scoreBoard);
    }

    snake.moveForward();
    if (snake.hasHitWithWall(gameCanvas) || snake.hasOwnHit()) {
      clearInterval(intervalId);
      return;
    }
    renderSnake(snake, gameCanvas);
  }, 100);
};

window.onload = main;
