
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const BLOCK_SIZE = 20;
const BOARD_WIDTH = 14;
const BOARD_HEIGHT = 30;

var score = 0;

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

context.scale(BLOCK_SIZE,BLOCK_SIZE);


function createBoard(width, height){
    return Array(height).fill().map(() => Array(width).fill(0))
}
//board
const board = createBoard(BOARD_WIDTH, BOARD_HEIGHT);



//pieces
const piece = {
    position: {x: 5, y: 5},
    shape: [[1,1],
            [1,1]]

}

const pieces = [
    [
        [1,1],
        [1,1]
    ],
    [
        [0,0,1],
        [1,1,1]
    ],
    [
        [0,1,0],
        [1,1,1]
    ],
    [
        [1,1,1,1]
    ]
]

AddListenersKeys();

//game loop
let lastTime = 0;
let refreshTime = 0;
function ticker(time = 0){
    const tickRate = time - lastTime;
    lastTime = time;
    refreshTime += tickRate;

    if(refreshTime > 500){
        piece.position.y++;
        refreshTime = 0;
        if(checkCollision()){
            piece.position.y--;
            solidifyPiece();
        }
    }
    draw();
    window.requestAnimationFrame(ticker);
}

function draw(){
    context.fillStyle = 'black';
    context.fillRect(0,0, canvas.width, canvas.height);


    //
    board.forEach((row, y) => {
        row.forEach((value,x) => {
            if(value === 1){
                context.fillStyle = 'blue';
                context.fillRect(x,y,1,1);
            }
        });
    });

    //draw piece in board
    piece.shape.forEach((row,y) => {
        row.forEach((value, x) => {
            if(value){
                context.fillStyle = 'red';
                context.fillRect(x + piece.position.x, y + piece.position.y ,1,1);
            }
        });
    });
}

function AddListenersKeys(){
    document.addEventListener('keydown', event =>{
        if(event.key == 'ArrowLeft') {
            piece.position.x--;
            if(checkCollision())
                piece.position.x++;
        }
        if(event.key == 'ArrowRight') {
            piece.position.x++;
            if(checkCollision())
                piece.position.x--;
        }
        if(event.key == 'ArrowDown') {
            piece.position.y++;
            if(checkCollision())
                {
                    piece.position.y--;
                    solidifyPiece();
                    clearfullfilledRow();
                
                }
        }

        if(event.key == 'ArrowUp'){
            const previousShape = piece.shape;
            piece.shape = rotatePiece();
            if(checkCollision()){
                piece.shape = previousShape;
            }
        }
    });
}

function checkCollision(){
    return piece.shape.find((row,y) => {
        return row.find((value, x) => {
            return (
                 value != 0 &&
                 board[y + piece.position.y]?.[x + piece.position.x] != 0
                )
        });
    })
}

function solidifyPiece(){
    piece.shape.forEach((row,y) => {
        console.log(row,y,"row y")
        row.forEach((value,x) => {
            console.log(value,x,"value x");
            if(value == 1){
                board[y + piece.position.y][x + piece.position.x] = value;
            }
        })
    });

    piece.position.x = Math.floor(Math.random(BOARD_WIDTH) * BOARD_WIDTH / 2);
    piece.position.y = 0;
    piece.shape = pieces[Math.floor(Math.random() * pieces.length )];

    if(isGameOver()){
        finishGame();
    }

}

function clearfullfilledRow(){
    let filledRows = [];
    board.forEach((row,y) => {
        if(row.every(value => value == 1)){
            console.log("added");
            filledRows.push(y);
        }  
    });
    filledRows.forEach(y => {
        board.splice(y,1);
        const newRow = Array(BOARD_WIDTH).fill(0);
        board.unshift(newRow);

        //add score
        addScore();
    });
}

function addScore(){
    score += 100;
    document.getElementById("score-number").innerHTML = score;
}
function isGameOver(){
    if(!board[1].every(el => el == 0)){
        return true;
    }
    return false;

}

function finishGame(){
    window.alert("Game is over. You lose.");
    board.forEach(row => row.fill(0));

}

function rotatePiece(){
    let rotated = [];
    for(let i = 0; i< piece.shape[0].length; i++){
        const row = [];
        for(let j= piece.shape.length - 1;  j >= 0; j--){
            row.push(piece.shape[j][i]);
        }
        rotated.push(row);
    }
    return rotated;

}

function startGame(){
    ticker();
}

function resetGame(){
    board.forEach(row => row.fill(0));
    piece.position.x = Math.floor(Math.random(BOARD_WIDTH) * BOARD_WIDTH / 2);
    piece.position.y = 0;
    piece.shape = pieces[Math.floor(Math.random() * pieces.length )];
    score = 0;
    document.getElementById("score-number").innerHTML = score;
}

document.getElementById("start-game").addEventListener('click',event => {
    document.getElementById("game-wrapper").remove();
    startGame();
});

document.getElementById("reset-game").addEventListener('click', event => {
    resetGame();
});




