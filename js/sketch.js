var board = [];
var pieces = [];

function setup() {
  createCanvas(400, 400);
  for (let i = 0; i < 9; i++){
    board[i] = new Piece(0, createVector(Math.floor(i / 3), i % 3), createVector(0, 0));
    pieces[i] = new Piece(0, createVector(Math.floor(i / 3), i % 3), createVector(0, 0));
  }
}

function draw() {
  background(255, 204, 0);
  for (let i = 0; i < 9; i++){
    board[i].show();
  }

  pieces[0].update();
  pieces[0].show();
}

function mousePressed(){
  for (let i = 0; i < 9; i++){
    newPos = board[i].clicked();
    if (newPos) {
      pieces[0].newPos = newPos;
    }
  }
}