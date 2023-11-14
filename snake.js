document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const snakeSize = 10;
    let snake = [{ x: 200, y: 200 }, { x: 190, y: 200 }, { x: 180, y: 200 }];
    let dx = 10;
    let dy = 0;
    let foodX;
    let foodY;
    let score = 0;
    let record = localStorage.getItem('snakeRecord') || 0;

    document.getElementById('record').textContent = record; // Установка значения рекорда из localStorage

    function clearCanvas() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGrid();
    }

    function drawSnakePart(snakePart) {
        ctx.fillStyle = 'lightgreen';
        ctx.strokeStyle = 'darkgreen';
        ctx.fillRect(snakePart.x, snakePart.y, snakeSize, snakeSize);
        ctx.strokeRect(snakePart.x, snakePart.y, snakeSize, snakeSize);
    }

    function drawSnake() {
        snake.forEach(drawSnakePart);
    }

    function advanceSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);
        if (head.x === foodX && head.y === foodY) {
            score += 10;
            document.getElementById('score').textContent = score;
            if (score > record) {
                record = score;
                localStorage.setItem('snakeRecord', record); // Обновление рекорда в localStorage
                document.getElementById('record').textContent = record;
            }
            createFood();
        } else {
            snake.pop();
        }
    }

    function changeDirection(event) {
        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;
        const ENTER_KEY = 13;

        const keyPressed = event.keyCode;
        const goingUp = dy === -10;
        const goingDown = dy === 10;
        const goingRight = dx === 10;
        const goingLeft = dx === -10;

        if (keyPressed === LEFT_KEY && !goingRight) {
            dx = -10;
            dy = 0;
        }

        if (keyPressed === UP_KEY && !goingDown) {
            dx = 0;
            dy = -10;
        }

        if (keyPressed === RIGHT_KEY && !goingLeft) {
            dx = 10;
            dy = 0;
        }

        if (keyPressed === DOWN_KEY && !goingUp) {
            dx = 0;
            dy = 10;
        }

        if (keyPressed === ENTER_KEY && checkGameOver()) {
            restartGame();
            hideGameOverModal();
        }
    }

    function hideGameOverModal() {
        document.getElementById('gameOverModal').style.display = 'none';
        document.getElementById('modalOverlay').style.display = 'none';
    }

    document.getElementById('gameOverModal').addEventListener('click', hideGameOverModal);

    function createFood() {
        foodX = Math.floor(Math.random() * (canvas.width / 10)) * 10;
        foodY = Math.floor(Math.random() * (canvas.height / 10)) * 10;

        snake.forEach(function isFoodOnSnake(part) {
            const foodIsOnSnake = part.x === foodX && part.y === foodY;
            if (foodIsOnSnake) createFood();
        });
    }

    function drawGrid() {
        ctx.strokeStyle = 'gray';

        // Рисуем вертикальные линии
        for (let x = 0; x <= canvas.width; x += snakeSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        // Рисуем горизонтальные линии
        for (let y = 0; y <= canvas.height; y += snakeSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

    document.getElementById('restartButton').addEventListener('click', () => {
        restartGame();
        hideGameOverModal();
    });

    function drawFood() {
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'darkred';
        ctx.fillRect(foodX, foodY, snakeSize, snakeSize);
        ctx.strokeRect(foodX, foodY, snakeSize, snakeSize);
    }

    function draw() {
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();
        if (checkGameOver()) {
            if (score === 0) {
                document.getElementById('score').textContent = '0';
            }
            showGameOverModal();
            return;
        }
    }

    createFood();

    const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    if (screenWidth>= 450) {
        document.addEventListener('keydown', changeDirection);
    } else {
        const leftButton = document.createElement('button');
        leftButton.textContent = '⬅️';
        leftButton.addEventListener('click', () => {
            changeDirection({ keyCode: 37 });
        });

        const upButton = document.createElement('button');
        upButton.textContent = '⬆️';
        upButton.addEventListener('click', () => {
            changeDirection({ keyCode: 38 });
        });

        const rightButton = document.createElement('button');
        rightButton.textContent = '➡️';
        rightButton.addEventListener('click', () => {
            changeDirection({ keyCode: 39 });
        });

        const downButton = document.createElement('button');
        downButton.textContent = '⬇️';
        downButton.addEventListener('click', () => {
            changeDirection({ keyCode: 40 });
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        buttonContainer.appendChild(leftButton);
        buttonContainer.appendChild(upButton);
        buttonContainer.appendChild(rightButton);
        buttonContainer.appendChild(downButton);
        document.body.appendChild(buttonContainer);
    }

    setInterval(draw, 100);

    function checkCollision() {
        const head = snake[0];
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) {
                return true;
            }
        }
        const hitLeftWall = head.x < 0;
        const hitRightWall = head.x >= canvas.width;
        const hitTopWall = head.y < 0;
        const hitBottomWall = head.y >= canvas.height;
        return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
    }

    function checkGameOver() {
        const head = snake[0];
        if (snake.length === 0) {
            return true;
        }
        return checkCollision();
    }

    function showGameOverModal() {
        document.getElementById('gameOverModal').style.display = 'block';
        document.getElementById('modalOverlay').style.display = 'block';
    }

    function restartGame() {
        hideGameOverModal(); // Добавьте эту строку
        snake = [{ x: 200, y: 200 }, { x: 190, y: 200 }, { x: 180, y: 200 }];
        dx = 10;
        dy = 0;
        score = 0;
        document.getElementById('score').textContent = score;
    }

    if (checkGameOver()) {
        showGameOverModal();
    }
})