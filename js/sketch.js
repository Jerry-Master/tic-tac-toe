var board = [];
var player0 = [];
var player1 = [];
var currentPlayer = 0;
var finished = false;
var total_pieces = 0;
var moving_piece = -1;
var curr_board = -1;
var waiting_response = false;
const OFFSET = 80;
const WIDTH = 80;
const HEIGHT = 80;
const SCREEN_WIDHT = 600;
const SCREEN_HEIGHT = 600;
const VALID_POSITIONS = [
    [
        [OFFSET - WIDTH / 2, OFFSET - HEIGHT / 2],
        [(SCREEN_WIDHT - 2 * OFFSET) / 2 + OFFSET - WIDTH / 2,
                    OFFSET - HEIGHT / 2],
        [(SCREEN_WIDHT - 2 * OFFSET) + OFFSET - WIDTH / 2,
                    OFFSET - HEIGHT / 2],
    ],
    [
        [OFFSET - WIDTH / 2, 
                    (SCREEN_HEIGHT - 2 * OFFSET) / 2 + OFFSET-  HEIGHT / 2],
        [(SCREEN_WIDHT - 2 * OFFSET) / 2 + OFFSET - WIDTH / 2,
                    (SCREEN_HEIGHT - 2 * OFFSET) / 2 + OFFSET - HEIGHT / 2],
        [(SCREEN_WIDHT - 2 * OFFSET) + OFFSET - WIDTH / 2,
                    (SCREEN_HEIGHT - 2 * OFFSET) / 2 + OFFSET - HEIGHT / 2],
    ],
    [
        [OFFSET - WIDTH / 2, 
                    (SCREEN_HEIGHT - 2 * OFFSET) + OFFSET - HEIGHT / 2],
        [(SCREEN_WIDHT - 2 * OFFSET) / 2 + OFFSET - WIDTH / 2,
                    (SCREEN_HEIGHT - 2 * OFFSET) + OFFSET - HEIGHT / 2],
        [(SCREEN_WIDHT - 2 * OFFSET) + OFFSET - WIDTH / 2,
                    (SCREEN_HEIGHT - 2 * OFFSET) + OFFSET - HEIGHT / 2],
    ]
];

function setup() {
  createCanvas(SCREEN_WIDHT, SCREEN_HEIGHT);
  for (let i = 0; i < 9; i++){
    board[i] = new Piece(-1, createVector(Math.floor(i / 3), i % 3), createVector(0, 0));
  }
  button = createButton('Restart');
  button.position(SCREEN_WIDHT / 2 - button.width / 2, 0);
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

function check(i, j, k, player){
  let v1, v2, v3;
  if (player == 0){
    v1 = player0[i].position;
    v2 = player0[j].position;
    v3 = player0[k].position; 
  } else {
    v1 = player1[i].position;
    v2 = player1[j].position;
    v3 = player1[k].position; 
  }
  let diff1 = p5.Vector.sub(v2, v1);
  diff1.setMag(1);
  let diff2 = p5.Vector.sub(v3, v1);
  diff2.setMag(1);

  if (abs(abs(diff1.dot(diff2)) - 1) < 0.01){
    return true;
  }
  return false;
}

function checkGame(){
  for (let i = 0; i < player0.length; i++){
    for (let j = i+1; j < player0.length; j++){
      for (let k = j+1; k < player0.length; k++){
        if (check(i,j,k, 0)){
          console.log('Player0 won.');
          return true;
  } } } }
  for (let i = 0; i < player1.length; i++){
    for (let j = i+1; j < player1.length; j++){
      for (let k = j+1; k < player1.length; k++){
        if (check(i,j,k, 1)){
          console.log('Player1 won.');
          return true;
  } } } }
  return false;
}

function mousePressed(){
  console.log(board);
  if (waiting_response) { // New cell to move the piece
    let next_board;
    for (let i = 0; i < 9; i++){
      next_board = i;
      let has_piece = board[i].clicked();
      if (!has_piece && !(has_piece === null) && next_board != curr_board) {
        if (currentPlayer == 0 && player0.length == 3) {
          player0[moving_piece].newPos = board[i].position;
          board[i].num_piece = moving_piece;
          board[i].piece_player = 0;
          currentPlayer = 1-currentPlayer;
        } else if (currentPlayer == 1 && player1.length == 3) {
          player1[moving_piece].newPos = board[i].position;
          board[i].num_piece = moving_piece;
          board[i].piece_player = 1;
          currentPlayer = 1-currentPlayer;
        }
      } else if (has_piece) { // Wrong move
        board[curr_board].has_piece = true;
      }
    }
    waiting_response = false;
  } else if (!finished){
    for (let i = 0; i < 9; i++){
      let has_piece = board[i].clicked();
      if (!has_piece && !(has_piece === null)) {
        // Add piece
        if (currentPlayer == 0 && player0.length < 3) {
          board[i].num_piece = player0.length;
          board[i].piece_player = 0;
          player0.push(new Piece(currentPlayer, 
                              board[i].position, createVector(0,0)));  
          currentPlayer = 1-currentPlayer;                            
        } else if (currentPlayer == 1 && player1.length < 3) {
          board[i].num_piece = player1.length;
          board[i].piece_player = 1;
          player1.push(new Piece(currentPlayer, 
                      board[i].position, createVector(0,0)));
          currentPlayer = 1-currentPlayer;
        } else { // Wrong move
          board[i].has_piece = false;
        }
      } else if (has_piece && board[i].piece_player == currentPlayer){
        // Move piece
        if (currentPlayer == 0 && player0.length == 3) {
          board[i].has_piece = false;
          moving_piece = board[i].num_piece;
          curr_board = i;
          waiting_response = true;
        } else if (currentPlayer == 1 && player1.length == 3) {
          board[i].has_piece = false;
          moving_piece = board[i].num_piece;
          curr_board = i;
          waiting_response = true;
        }
      }
    }
  } 
  finished = checkGame();
  console.log(waiting_response);
  console.log(currentPlayer);
}

function restart(){
  player0 = [];
  player1 = [];
  currentPlayer = 0;
  finished = false;
  total_pieces = 0;
  moving_piece = -1;
  curr_board = -1;
  waiting_response = false;
  for (let i = 0; i < 9; i++){
    board[i].has_piece = false;
  }
}