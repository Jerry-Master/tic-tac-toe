
/***** Tic Tac Toe *****/
class Piece{
    constructor(player, position, vel){
        this.offset = 50;
        this.width = 40;
        this.height = 40;
        this.valid_positions = [
        [
            createVector(this.offset - this.width / 2, this.offset - this.height / 2),
            createVector((width - 2 * this.offset) / 2 + this.offset - this.width / 2,
                        this.offset - this.height / 2),
            createVector((width - 2 * this.offset) + this.offset - this.width / 2,
                        this.offset - this.height / 2),
        ],
        [
            createVector(this.offset - this.width / 2, 
                        (height - 2 * this.offset) / 2 + this.offset-  this.height / 2),
            createVector((width - 2 * this.offset) / 2 + this.offset - this.width / 2,
                        (height - 2 * this.offset) / 2 + this.offset - this.height / 2),
            createVector((width - 2 * this.offset) + this.offset - this.width / 2,
                        (height - 2 * this.offset) / 2 + this.offset - this.height / 2),
        ],
        [
            createVector(this.offset - this.width / 2, 
                        (height - 2 * this.offset) + this.offset - this.height / 2),
            createVector((width - 2 * this.offset) / 2 + this.offset - this.width / 2,
                        (height - 2 * this.offset) + this.offset - this.height / 2),
            createVector((width - 2 * this.offset) + this.offset - this.width / 2,
                        (height - 2 * this.offset) + this.offset - this.height / 2),
        ]
        ];
    
        this.player = player;
        this.position = position;
        this.coordinates = this.valid_positions[position.x][position.y];
        this.newPos = null;
        this.vel = vel;
    }

    update = function(){
      if (!(this.newPos === null)){
          console.log('in');
          console.log(this.newPos);
          console.log(this.valid_positions);
        let newPosCoords = this.valid_positions[this.newPos.x][this.newPos.y];
        console.log(newPosCoords);
        console.log(this.valid_positions);
        if (!newPosCoords.equals(this.coordinates.x, this.coordinates.y)){
            this.vel = p5.Vector.sub(newPosCoords, this.coordinates);
            this.vel.setMag(2);
            
        } else {
            this.vel = createVector(0, 0);
            this.position = this.newPos;
            this.newPos = null;
        }
        this.coordinates.add(this.vel);
      }
    }

    inside = function(x, y){
        let x_diff = (x - this.coordinates.x);
        let y_diff = (y - this.coordinates.y);
        return (x_diff < this.width) && (y_diff < this.height)
            && (0 < x_diff) && (0 < y_diff);
    }

    clicked = function(){
        if (this.inside(mouseX, mouseY)){
            return this.position;
        } else {
            return null;
        }
    }
  
    show = function(){
      push();
      noStroke();
      fill(30, 120, 0);
      rect(this.coordinates.x, this.coordinates.y, this.width, this.height);
      pop();
    }
  }