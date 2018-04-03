function Player() {
    var gameUI = GameUI.getInstance();
  
    this.type = 'small';
    this.x;
    this.y;
    this.width = 32;
    this.height = 32;
    this.speed = 3;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.jumping = false;
    this.grounded = false;
    this.invulnerable = false;  // flag for invincibility frames
    this.spriteX = 0; // sprite x
    this.spriteY = 4; // sprite y
    this.frame = 0;
  
    var that = this;
  
    this.init = function() {
      that.x = 10;
      that.y = gameUI.getHeight() - 40 - 40;
  
      playerSprite = new Image();
      playerSprite.src = 'images/player-sprites.png';
    };
  
    this.draw = function() {
      that.spriteX = that.width * that.frame;
      gameUI.draw(playerSprite, that.spriteX, that.spriteY, that.width, that.height, that.x, that.y, that.width, that.height);
    };
  
    this.checkPlayerType = function() {
      if (that.type == 'big') {
        that.height = 60;
  
        //big player sprite position
        if (that.invulnerable) {
          that.spriteY = 276; //if invulnerable, show transparent player
        } else {
          that.spriteY = 90;
        }
      } else if (that.type == 'small') {
        that.height = 44;
  
        //small player sprite
        if (that.invulnerable) {
          that.spriteY = 222; //if invulnerable, show transparent player
        } else {
          that.spriteY = 4;
        }
      } else if (that.type == 'fire') {
        that.height = 44;
  
        //fire player sprite
        that.spriteY = 165;
      }
    };
  
    this.resetPos = function() {
      that.x = canvas.width / 10;
      that.y = canvas.height - 40;
      that.frame = 0;
    };
  }