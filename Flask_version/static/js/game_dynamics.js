function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function saveState(waitTime=1000, async=true){
  // Save data
  var json = {'player0': {'x': [], 'y': []}, 
              'player1': {'x': [], 'y': []}};
  for (let i=0; i<player0.length; i++){
    if (player0[i].newPos === null){
      json['player0']['x'][i] = player0[i].position.x;
      json['player0']['y'][i] = player0[i].position.y;
    } else {
      json['player0']['x'][i] = player0[i].newPos.x;
      json['player0']['y'][i] = player0[i].newPos.y;
    }
  }
  for (let i=0; i<player1.length; i++){
    if (player1[i].newPos === null){
      json['player1']['x'][i] = player1[i].position.x;
      json['player1']['y'][i] = player1[i].position.y;
    } else {
      json['player1']['x'][i] = player1[i].newPos.x;
      json['player1']['y'][i] = player1[i].newPos.y;
    }
  }
  $.ajax({
    url : '/save',
    dataType : 'json', 
    type : 'POST',
    data : {data: JSON.stringify(json)},
    async : false
  }).done(function(data) {         
      console.log('Success saving'); 
  }).fail(function() {
      console.log('Error saving');
  });

  // Execute Ai program
  setTimeout(function(){ // Wait 1s to move
    $.ajax({
      url : '/exe',
      type : 'POST',
      data : {data: JSON.stringify({'player':  currentPlayer})},
      async : async
    }).always(function() {
      console.log('Done computing');
      // Retrieve data
      $.ajax({
        url:"/load",
        method:"GET"
      }).done(function(data) {
        console.log('Success loading');
        data = JSON.parse(data);
        for (let i=0; i<player0.length; i++){
          player0[i].newPos = createVector(data['player0']['x'][i], data['player0']['y'][i]);
        }
        for (let i=0; i<player1.length; i++){
          player1[i].newPos = createVector(data['player1']['x'][i], data['player1']['y'][i]);
        }
        if (currentPlayer == 0){
          if (player0.length < 3){
            player0.push(new Piece(currentPlayer, 
              createVector(data['player0']['x'][player0.length], 
                          data['player0']['y'][player0.length]), createVector(0,0))); 
          }
        } else {
          if (player1.length < 3){
            player1.push(new Piece(currentPlayer, 
              createVector(data['player1']['x'][player1.length], 
                          data['player1']['y'][player1.length]), createVector(0,0))); 
          }
        }
        currentPlayer = 1 - currentPlayer;
      }).fail(function() {
        console.log('Failed loading');
      })
    })
  }, waitTime);
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

function compare(pos1, pos2){
    if (pos1.x < pos2.x){
        return true;
    } else if (pos1.x > pos2.x) {
        return false;
    } else {
        return pos1.y < pos2.y;
    }
}

function drawLine(pos1, pos2, pos3){
    if (compare(pos1, pos2)){
        drawLine(pos2, pos1, pos3);
    } else if (compare(pos2, pos3)){
        drawLine(pos1, pos3, pos2);
    } else {
        stroke(0,0,255);
        strokeWeight(10);
        line(pos1.x + WIDTH/2, pos1.y + HEIGHT/2, pos3.x + WIDTH/2, pos3.y + HEIGHT/2);
    }
}

function checkGame(){
  for (let i = 0; i < player0.length; i++){
    for (let j = i+1; j < player0.length; j++){
      for (let k = j+1; k < player0.length; k++){
        if (check(i,j,k, 0)){
          console.log('Player0 won.');
          drawLine(player0[i].coordinates, player0[j].coordinates, player0[k].coordinates);
          return true;
  } } } }
  for (let i = 0; i < player1.length; i++){
    for (let j = i+1; j < player1.length; j++){
      for (let k = j+1; k < player1.length; k++){
        if (check(i,j,k, 1)){
          console.log('Player1 won.');
          drawLine(player1[i].coordinates, player1[j].coordinates, player1[k].coordinates);
          return true;
  } } } }
  return false;
}

function addPiece(i){
  board[i].has_piece = true;
  if (currentPlayer == 0 && player0.length < 3) {
    board[i].num_piece = player0.length;
    board[i].piece_player = 0;
    player0.push(new Piece(currentPlayer, 
                        board[i].position, createVector(0,0)));  
    currentPlayer = 1-currentPlayer;  
    rounds++;
    if (use_ai){
      saveState();
    }
  } else if (currentPlayer == 1 && player1.length < 3) {
    board[i].num_piece = player1.length;
    board[i].piece_player = 1;
    player1.push(new Piece(currentPlayer, 
                board[i].position, createVector(0,0)));
    currentPlayer = 1-currentPlayer;
    rounds++;
    if (use_ai){
      saveState();
    }
  } else { // Wrong move
    board[i].has_piece = false;
  }
}

function movePiece(i){
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

function firstClick(){
  for (let i = 0; i < 9; i++){
    let has_piece = board[i].clicked();
    if (!has_piece && !(has_piece === null)) {
      addPiece(i);
    } else if (has_piece && board[i].piece_player == currentPlayer){
      movePiece(i);
      if (waiting_response){
        board[i].highlight_on = true;
      }
    }
  }
}

function valid(curr_board, next_board){
    curr_pos = board[curr_board].position;
    next_pos = board[next_board].position;
  
    return (abs(curr_pos.x - next_pos.x) + abs(curr_pos.y - next_pos.y) == 1) ||
           (curr_pos.x == 1 && curr_pos.y == 1) ||
           (next_pos.x == 1 && next_pos.y == 1);
}

function secondClick(){
  let next_board;
  let changed = false;
  for (let i = 0; i < 9; i++){
    next_board = i;
    let has_piece = board[i].clicked();
    if (!has_piece && !(has_piece === null) && next_board != curr_board) {
      if (currentPlayer == 0 && player0.length == 3) {
        if (valid(curr_board, next_board)){
          changed = true;
          player0[moving_piece].newPos = board[i].position;
          board[i].has_piece = true;
          board[i].num_piece = moving_piece;
          board[i].piece_player = 0;
          currentPlayer = 1-currentPlayer;
          rounds++;
          if (use_ai){
            saveState();
          }
        }
      } else if (currentPlayer == 1 && player1.length == 3) {
        if (valid(curr_board, next_board)){
          changed = true;
          player1[moving_piece].newPos = board[i].position;
          board[i].has_piece = true;
          board[i].num_piece = moving_piece;
          board[i].piece_player = 1;
          currentPlayer = 1-currentPlayer;
          rounds++;
          if (use_ai){
            saveState();
          }
        }
      }       
    } else if (!(has_piece === null) && (has_piece || 
                !valid(curr_board, next_board))) { // Wrong move
      board[curr_board].has_piece = true;
      changed = true;
    }
  }
  if (!changed){ // Clicked outside any box
    board[curr_board].has_piece = true;
  }
  board[curr_board].highlight_on = false;
}

function restart(){
  rounds = 0;
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
  if (ai_player == 0){
    saveState();
  } else if (ai_player == 2){
    show_indication(currentPlayer);
    first = true;
  }
}