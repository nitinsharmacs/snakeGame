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
  constructor(id, size, position) {
    this.id = id;
    this.size = size;
    this.body = [position];
  }

  moveLeft() {

  }
}

const createSnake = ({ size }) => {
  const snakeId = 'snake';
  const position = { x: 0, y: 0 };
  return new Snake(
    snakeId,
    size,
    position
  );
};

const main = () => {
  const gameCanvas = createGameCanvas(500, 500);
  const snake = createSnake({ size: 20 });

  renderSnake(snake, gameCanvas);
};

window.onload = main;
