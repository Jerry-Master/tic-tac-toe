function setup() {
  var myCanvas = createCanvas(SCREEN_WIDHT, SCREEN_HEIGHT);
  myCanvas.parent('board');
  for (let i = 0; i < 9; i++){
    board[i] = new Piece(-1, createVector(Math.floor(i / 3), i % 3), createVector(0, 0));
  }
  button = createButton('Restart');
  button.id('restart');
  button.position(BOARD.offsetLeft + SCREEN_WIDHT / 2 - button.width / 2, BOARD.offsetTop);
  button.mousePressed(restart);
}

function draw() {
  background(255, 204, 0);
  for (let i = 0; i < 9; i++){
    board[i].show();
  }
  for (let i = 0; i < player0.length; i++){
    player0[i].update();
    player0[i].show();
  }
  for (let i = 0; i < player1.length; i++){
    player1[i].update();
    player1[i].show();
  }
  finished = checkGame();
}

function mousePressed(){
  if (waiting_response) { // New cell to move the piece
    secondClick();
    waiting_response = false;
  } else if (!finished){
    firstClick();
  } 
  finished = checkGame();
}

