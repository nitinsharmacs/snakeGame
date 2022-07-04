const px = (value) => `${value}px`;

const removeElement = (elementId) => {
  const element = document.getElementById(elementId);
  element && element.remove();
};

class GameCanvas {
  #id;
  #canvas;
  constructor(id, width, height, canvas) {
    this.#id = id;
    this.width = width;
    this.height = height;
    this.#canvas = canvas;
  }

  render({ id, element }) {
    removeElement(id);
    this.#canvas.appendChild(element);
  }
}

const createGameCanvas = (width, height) => {
  const page = document.getElementById('page');
  const canvasElement = document.createElement('div');

  canvasElement.id = 'game-canvas';
  canvasElement.style.width = px(width);
  canvasElement.style.height = px(height);
  canvasElement.classList.add('canvas');

  page.appendChild(canvasElement);
  return new GameCanvas('game-canvas', width, height, canvasElement);
};

const renderSnake = ({ id, body, size }, gameCanvas) => {
  const snakeElement = document.createElement('div');
  snakeElement.id = id;
  snakeElement.classList.add('snake-body');

  body.forEach((snakeSegment, index) => {
    const segmentElemet = document.createElement('div');

    segmentElemet.id = `snake-segment-${index}`;
    segmentElemet.classList.add('snake-segment');
    segmentElemet.style.width = size;
    segmentElemet.style.left = px(snakeSegment.x);
    segmentElemet.style.top = px(snakeSegment.y);

    snakeElement.appendChild(segmentElemet);
  });

  gameCanvas.render({ id: id, element: snakeElement });
};

class Snake {
  constructor(id, size, delta, position) {
    this.id = id;
    this.size = size;
    this.delta = delta;
    this.body = [position];
    this.dx = 0;
    this.dy = 0;
    this.ateFood = false;
  }

  moveForward() {
    const [{ x, y }] = this.body;
    this.body.unshift({ x: x + this.dx, y: this.dy + y });
    if (!this.ateFood)
      this.body.pop();
    this.ateFood = false;
  }

  turnLeft() {
    this.dx = -this.delta;
    this.dy = 0;
  }

  turnRight() {
    this.dx = this.delta;
    this.dy = 0;
  }

  turnDown() {
    this.dy = this.delta;
    this.dx = 0;
  }

  turnUp() {
    this.dy = -this.delta;
    this.dx = 0;
  }

  eatFood() {
    this.ateFood = true;
  }
}

const createSnake = ({ size }) => {
  const snakeId = 'snake';
  const position = { x: 480, y: 0 };
  const delta = 20;
  return new Snake(
    snakeId,
    size,
    delta,
    position
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
  window.onkeydown = ({ code }) => {
    runUserAction(code, snake);
  };
};

const main = () => {
  const gameCanvas = createGameCanvas(500, 500);
  const snake = createSnake({ size: 20 }, gameCanvas);

  renderSnake(snake, gameCanvas);
  watchUserAction(snake, gameCanvas);

  // setInterval(() => {
  //   snake.moveForward();
  //   renderSnake(snake, gameCanvas);
  // }, 500);

  // setTimeout(() => {
  //   snake.eatFood();
  // }, 1500)

  // setTimeout(() => {
  //   snake.eatFood();
  // }, 2500)
  // setInterval(() => {
  //   snake.turnLeft();
  //   snake.moveForward();
  //   renderSnake(snake, gameCanvas);
  // }, 100);

  // setTimeout(() => {
  //   snake.turnDown();
  //   snake.moveForward();
  //   renderSnake(snake, gameCanvas);
  // }, 500);
};

window.onload = main;
