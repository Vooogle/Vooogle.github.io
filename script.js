const gameArea = document.getElementById('gameArea');
const snakeElement = document.getElementById('snake');
const foodElement = document.getElementById('food');

const snakeEmoji = '🟩';
const foodEmoji = '🍎';

let snake = [{ x: 5, y: 5 }];
let direction = { x: 0, y: 0 };
let food = { x: 10, y: 10 };

function drawCell(x, y, content) {
    const cell = document.createElement('div');
    cell.style.gridRowStart = y + 1;
    cell.style.gridColumnStart = x + 1;
    cell.classList.add('cell');
    cell.innerText = content;
    gameArea.appendChild(cell);
}

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x === food.x && head.y === food.y) {
        snake.unshift(head);
        placeFood();
    } else {
        snake.pop();
        snake.unshift(head);
    }

    if (head.x < 0 || head.x >= 15 || head.y < 0 || head.y >= 15 || snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y)) {
        resetGame();
    }

    draw();
}

function draw() {
    gameArea.innerHTML = '';

    snake.forEach(segment => {
        drawCell(segment.x, segment.y, snakeEmoji);
    });

    drawCell(food.x, food.y, foodEmoji);
}

function placeFood() {
    food = { x: Math.floor(Math.random() * 15), y: Math.floor(Math.random() * 15) };

    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        placeFood();
    }
}

function resetGame() {
    snake = [{ x: 5, y: 5 }];
    direction = { x: 0, y: 0 };
    placeFood();
}

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            direction = { x: 1, y: 0 };
            break;
    }
});

setInterval(update, 200);
resetGame();
