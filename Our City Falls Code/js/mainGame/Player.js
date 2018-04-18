function Player() {
    var gameUI = GameUI.getInstance();
  
    this.type = 'normal';
    this.x;
    this.y;
    this.width = 32;
    this.height = 32;
    this.speed = 3;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.isJumping = false;
    this.onGround = false;
    this.isInvincible = false;  // flag for invincibility frames
    this.spriteX = 0; // sprite x
    this.spriteY = 4; // sprite y
    this.frame = 0;
    this.health = 1;
  
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
      if (that.type == 'armor') {
        that.height = 60;
  
        //armored player sprite position
        if (that.isInvincible) {
          that.spriteY = 276; //if isInvincible, show red player
        } else {
          that.spriteY = 90;
        }
      } else if (that.type == 'normal') {
        that.height = 44;
  
        //normal player sprite
        if (that.isInvincible) {
          that.spriteY = 222; //if isInvincible, show red player
        } else {
          that.spriteY = 4;
        }
      } else if (that.type == 'shotgun') {
        that.height = 44;
  
        //shotgun player sprite
        that.spriteY = 165;
      } else if(that.type == 'shotgunWithArmor'){
        that.height = 44;
        that.spriteY = 165;
      }

    };
  
    this.resetPlayer = function() {
      that.x = canvas.width / 10;
      that.y = canvas.height - 40;
      that.frame = 0;
    };
  }
