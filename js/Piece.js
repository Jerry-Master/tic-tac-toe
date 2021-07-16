/***** Tic Tac Toe *****/

class Piece{
    constructor(player, position, vel, color){
        this.player = player;
        this.position = position;
        this.coordinates = createVector(VALID_POSITIONS[position.x][position.y][0],
                                        VALID_POSITIONS[position.x][position.y][1]);
        this.newPos = null;
        this.vel = vel;
        this.color = color;
        /****      For board only          ****/
        this.has_piece = false; 
        this.num_piece = -1; 
        this.piece_player = -1; 
        this.highlight_on = false; 
        /****      End of board only       ****/
    }

    update = function(){
      if (!(this.newPos === null)){
        let newPosCoords = createVector(VALID_POSITIONS[this.newPos.x][this.newPos.y][0],
                                        VALID_POSITIONS[this.newPos.x][this.newPos.y][1]);
        this.vel = p5.Vector.sub(newPosCoords, this.coordinates);                                        
        if (this.vel.mag() > 5){
            this.vel.setMag(5); 
            this.coordinates.add(this.vel);  
        } else {
            this.vel = createVector(0, 0);
            this.position = this.newPos;
            this.coordinates = createVector(VALID_POSITIONS[this.newPos.x][this.newPos.y][0],
                                            VALID_POSITIONS[this.newPos.x][this.newPos.y][1]);
            this.newPos = null;
        }
      }
    }

    update_coords = function(){
      this.coordinates = createVector(VALID_POSITIONS[this.position.x][this.position.y][0],
        VALID_POSITIONS[this.position.x][this.position.y][1]);
    }

    inside = function(x, y){
        let x_diff = (x - this.coordinates.x);
        let y_diff = (y - this.coordinates.y);
        return (x_diff < WIDTH) && (y_diff < HEIGHT)
            && (0 < x_diff) && (0 < y_diff);
    }

    clicked = function(){
        if (this.inside(mouseX, mouseY)){
            if (this.has_piece){
                return this.has_piece;
            } else {
                return false;
            }
        } 
        return null;
    }
  
    show = function(){
      push();
      if (this.player == 0){
        strokeWeight(5);
        stroke(0);
        line(this.coordinates.x, this.coordinates.y, 
             this.coordinates.x + WIDTH, this.coordinates.y + HEIGHT);
        line(this.coordinates.x, this.coordinates.y + HEIGHT, 
             this.coordinates.x + WIDTH, this.coordinates.y,);
      } else if (this.player == 1){
        strokeWeight(5);
        stroke(0);
        noFill();
        ellipse(this.coordinates.x + WIDTH / 2, this.coordinates.y + HEIGHT / 2,
                WIDTH, HEIGHT);
      } else {
        noStroke();
        if (this.highlight_on){
          stroke(255,0,0);
          strokeWeight(4);
        }
        fill(this.color);
        rect(this.coordinates.x, this.coordinates.y, WIDTH, HEIGHT);
      }
      pop();
    }
  }