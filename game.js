
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let spaceship = { x: canvas.width / 2 - 25, y: canvas.height - 80, width: 50, height: 50, color: 'cyan' };
let bullets = [];
let enemies = [];
let stars = [];
let score = 0;
let lives = 3;
let gameRunning = true;

// Background stars
function createStars() {
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 1 + 0.5
        });
    }
}
createStars();

function drawStars() {
    stars.forEach(star => {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });
}

// Controls
window.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    if (e.key === 'ArrowLeft' && spaceship.x > 0) spaceship.x -= 20;
    if (e.key === 'ArrowRight' && spaceship.x + spaceship.width < canvas.width) spaceship.x += 20;
    if (e.key === ' ') bullets.push({ x: spaceship.x + spaceship.width / 2 - 2.5, y: spaceship.y, width: 5, height: 10 });
});

// Spawn enemies
function spawnEnemies() {
    if (Math.random() < 0.03) {
        let size = Math.random() * 30 + 20;
        enemies.push({
            x: Math.random() * (canvas.width - size),
            y: -size,
            size: size,
            speed: Math.random() * 2 + 1,
            color: 'red'
        });
    }
}

// Draw and update enemies
function drawEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        ctx.fillStyle = enemy.color;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.size / 2, 0, Math.PI * 2);
        ctx.fill();
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
            lives--;
            if (lives <= 0) gameOver();
        }
    });
}

// Check for collisions
function checkCollisions() {
    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (
                bullet.x < enemy.x + enemy.size / 2 &&
                bullet.x > enemy.x - enemy.size / 2 &&
                bullet.y < enemy.y + enemy.size / 2 &&
                bullet.y > enemy.y - enemy.size / 2
            ) {
                bullets.splice(bIndex, 1);
                enemies.splice(eIndex, 1);
                score += 10;
            }
        });
    });
}

// Game over
function gameOver() {
    gameRunning = false;
    alert(`Game Over! Final Score: ${score}`);
    document.location.reload();
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background stars
    drawStars();

    // Draw spaceship
    ctx.fillStyle = spaceship.color;
    ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);

    // Draw bullets
    bullets.forEach((bullet, index) => {
        bullet.y -= 10;
        if (bullet.y < 0) bullets.splice(index, 1);
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Spawn and draw enemies
    spawnEnemies();
    drawEnemies();

    // Check collisions
    checkCollisions();

    // Draw score and lives
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Lives: ${lives}`, 10, 60);

    requestAnimationFrame(gameLoop);
}

gameLoop();
