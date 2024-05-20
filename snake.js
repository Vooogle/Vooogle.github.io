const canvas = document.getElementById('gameArea');
const ctx = canvas.getContext('2d');
const uploadInput = document.getElementById('imageUpload');
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let images = [];
let imageIndex = 0;

uploadInput.addEventListener('change', handleImageUpload);

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

function advanceSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);
    snake.pop();
}

function gameLoop() {
    if (images.length === 0) {
        requestAnimationFrame(gameLoop);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    advanceSnake();
    drawSnake();
    requestAnimationFrame(gameLoop);
}

function changeDirection(dir) {
    switch(dir) {
        case 'up': direction = { x: 0, y: -1 }; break;
        case 'down': direction = { x: 0, y: 1 }; break;
        case 'left': direction = { x: -1, y: 0 }; break;
        case 'right': direction = { x: 1, y: 0 }; break;
    }
}

requestAnimationFrame(gameLoop);