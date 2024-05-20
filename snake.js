const canvas = document.getElementById('gameArea');
const ctx = canvas.getContext('2d');
const uploadInput = document.getElementById('imageUpload');
const dotUpload = document.getElementById('dotUpload');
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let images = [];
let dotImage = null;
let food = getRandomFoodPosition();

uploadInput.addEventListener('change', handleImageUpload);
dotUpload.addEventListener('change', handleDotUpload);

function handleImageUpload(event) {
    const files = event.target.files;
    for (let file of files) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            images.push(img);
        };
        reader.readAsDataURL(file);
    }
}

function handleDotUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;
        dotImage = img;
    };
    reader.readAsDataURL(file);
}

function drawSnake() {
    snake.forEach((segment, index) => {
        const img = images[index % images.length];
        if (img) {
            ctx.drawImage(img, segment.x * 20, segment.y * 20, 20, 20);
        } else {
            ctx.fillStyle = 'green';
            ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20);
        }
    });
}

function drawFood() {
    if (dotImage) {
        ctx.drawImage(dotImage, food.x * 20, food.y * 20, 20, 20);
    } else {
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * 20, food.y * 20, 20, 20);
    }
}

function advanceSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x < 0 || head.y < 0 || head.x >= canvas.width / 20 || head.y >= canvas.height / 20) {
        resetGame();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = getRandomFoodPosition();
    } else {
        snake.pop();
    }
}

function getRandomFoodPosition() {
    let position;
    while (!position || snake.some(segment => segment.x === position.x && segment.y === position.y)) {
        position = {
            x: Math.floor(Math.random() * canvas.width / 20),
            y: Math.floor(Math.random() * canvas.height / 20)
        };
    }
    return position;
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    food = getRandomFoodPosition();
}

function gameLoop() {
    if (images.length === 0 || !dotImage) {
        requestAnimationFrame(gameLoop);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    advanceSnake();
    drawSnake();
    drawFood();
    requestAnimationFrame(gameLoop);
}

function changeDirection(dir) {
    switch(dir) {
        case 'up': if (direction.y === 0) direction = { x: 0, y: -1 }; break;
        case 'down': if (direction.y === 0) direction = { x: 0, y: 1 }; break;
        case 'left': if (direction.x === 0) direction = { x: -1, y: 0 }; break;
        case 'right': if (direction.x === 0) direction = { x: 1, y: 0 }; break;
    }
}

requestAnimationFrame(gameLoop);