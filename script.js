const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const startModal = document.querySelector(".start-modal");
const gameOverModal = document.querySelector(".game-over-modal");
const finalScoreElement = document.querySelector(".final-score");
const startButton = document.getElementById("start-btn");
const restartButton = document.getElementById("restart-btn");


let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalID;
let score = 0;

//getting high score from local storage or setting it to 0
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const changeFoodPosition = () => {
    //passing random 0-30 value as food position
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    clearInterval(setIntervalID);
    gameOverModal.classList.remove("hidden");
    finalScoreElement.innerText = score;
}

const changeDirection = (e) => {
    //changing velocity value based on key press
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    }else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    }else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    }else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

controls.forEach(key => {
    //calling changeDirection on each key click and passing key dataset value as an object
    key.addEventListener("click", () => changeDirection({key: key.dataset.key}));
});

const initGame = () => {
    if(gameOver) return handleGameOver();
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    if(snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);//pushing food position to snake body array
        console.log(snakeBody);
        score++; //increment score by 1

        highScore = score >= highScore ? score : highScore; //setting high score to score if score is greater than high score
        localStorage.setItem('high-score', highScore); //setting high score to local storage
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    for(let i=snakeBody.length-1; i>=0; i--) {
        //shifting forward the values of the elements in the snake body by one
        snakeBody[i] = snakeBody[i-1];
    }
    
    snakeBody[0] = [snakeX, snakeY]; //setting first element of snake body to current snake position
    
    //updating snake head postion based on the current velocity
    snakeX += velocityX;
    snakeY += velocityY;

    //checking if snake head hits itself or the boundaries
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    for(let i=0; i<snakeBody.length; i++){
        //adding a div for each part of the snake's body
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        //checking if the snake head hit the body, if so set gameOverto true
        if(i != 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = htmlMarkup;
}

const startGame = () => {
    gameOver = false;
    snakeBody = [];
    snakeX = 5;
    snakeY = 10;
    velocityX = 0;
    velocityY = 0;
    score = 0;
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score: ${highScore}`;
    changeFoodPosition();
    setIntervalID = setInterval(initGame, 125);
    startModal.classList.add("hidden");
    gameOverModal.classList.add("hidden");
};

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
document.addEventListener("keydown", changeDirection);