function setup() {
  $.ajax({
    url : '/compile',
    type : 'GET'
  }).always(function() {
    console.log('Done compiling');
  });

  myCanvas = createCanvas(SCREEN_WIDHT, SCREEN_HEIGHT);
  myCanvas.parent('board');
  for (let i = 0; i < 9; i++){
    board[i] = new Piece(-1, createVector(Math.floor(i / 3), i % 3), 
                         createVector(0, 0), jQuery('#board').css("color"));
  }
  button = createButton('Restart');
  button.id('restart');
  button.mousePressed(restart);
  button.touchEnded(restart);
  console.log('start');
}

function draw() {
  var ml = parseFloat(jQuery('#board').css("margin-left"));
  button.position(-ml/2 +BOARD.offsetLeft + SCREEN_WIDHT / 2 - button.width / 2, BOARD.offsetTop);
  background(jQuery('#board').css("background-color"));
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
  if (!use_ai || (ai_player != currentPlayer && ai_player != 2)){
    if (waiting_response) { // New cell to move the piece
      secondClick();
      waiting_response = false;
    } else if (!finished){
      firstClick();
    } 
    finished = checkGame();
    update_rounds(rounds);
    update_player(currentPlayer)
  } else if (ai_player == 2){
    console.log(button.position());
    if (first){
      saveState(100, false);
      first = false;
    } else {
      saveState(10, false);
    }
  }
}

function windowResized() {
  var cw = $('#board').width();
  $('#board').css({'height':cw+'px'});
  var BOARD = document.querySelector('#board');
  SCREEN_WIDHT = BOARD.offsetWidth + parseFloat(jQuery('#board').css("margin-left"));
  SCREEN_HEIGHT = BOARD.offsetHeight;
  resizeCanvas(SCREEN_WIDHT, SCREEN_HEIGHT);
  OFFSET = 3 * SCREEN_WIDHT / 18;
  WIDTH = 3 * SCREEN_WIDHT / 18;
  HEIGHT = 3 * SCREEN_HEIGHT / 18;
  VALID_POSITIONS = compute_valid_positions();
  
  for (let i = 0; i < 9; i++){
    board[i].update_coords();
    board[i].show();
  }
  for (let i = 0; i < player0.length; i++){
    player0[i].update_coords();
    player0[i].show();
  }
  for (let i = 0; i < player1.length; i++){
    player1[i].update_coords();
    player1[i].show();
  }
}

/* prevents the mobile browser from processing some default
   * touch events, like swiping left for "back" or scrolling
   * the page.
   */
function touchEnded(){
  if (mouseX > 0 && mouseX < SCREEN_WIDHT && mouseY > 0 && mouseY < SCREEN_HEIGHT){
    if (ai_player == 2){
      if (first){
        saveState(100, false);
        first = false;
      } else {
        saveState(10, false);
      }
      sleep(100);
    }
    return false;
  }
}