function Mario() {
    var gameUI = GameUI.getInstance();
  
    this.type = 'small';
    this.x;
    this.y;
    this.width = 32;
    this.height = 32;
    this.speed = 3;
    this.velX = 0;
    this.velY = 0;
    this.jumping = false;
    this.grounded = false;
    this.invulnerable = false;
    this.spriteX = 0; // sprite x
    this.spriteY = 4; // sprite y
    this.frame = 0;
  
    var that = this;
  
    this.init = function() {
      that.x = 10;
      that.y = gameUI.getHeight() - 40 - 40;
  
      marioSprite = new Image();
      marioSprite.src = 'images/mario-sprites.png';
    };
  
    this.draw = function() {
      that.spriteX = that.width * that.frame;
      gameUI.draw(marioSprite, that.spriteX, that.spriteY, that.width, that.height, that.x, that.y, that.width, that.height);
    };
  
    this.checkMarioType = function() {
      if (that.type == 'big') {
        that.height = 60;
  
        //big mario sprite position
        if (that.invulnerable) {
          that.spriteY = 276; //if invulnerable, show transparent mario
        } else {
          that.spriteY = 90;
        }
      } else if (that.type == 'small') {
        that.height = 44;
  
        //small mario sprite
        if (that.invulnerable) {
          that.spriteY = 222; //if invulnerable, show transparent mario
        } else {
          that.spriteY = 4;
        }
      } else if (that.type == 'fire') {
        that.height = 44;
  
        //fire mario sprite
        that.spriteY = 165;
      }
    };
  
    this.resetPos = function() {
      that.x = canvas.width / 10;
      that.y = canvas.height - 40;
      that.frame = 0;
    };
  }