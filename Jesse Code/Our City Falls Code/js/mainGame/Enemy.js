function Enemy() {
    var gameUI = GameUI.getInstance();
  
    var animationTick = 0; //for animating zombie
    var tickLimit = 10; //max number for ticks to show enemy sprite
  
    var element = new Image();
    element.src = 'images/enemies.png';
  
    this.x;
    this.y;
    this.xVelocity = .5;
    this.yVelocity = 0;
    this.onGround = false;
    this.type;
    this.state;
    this.health = 3;
  
    this.spriteX;
    this.spriteY = 0;
    this.width = 32;
    this.height = 32;
  
    this.frame = 0;
  
    var that = this;
  
    this.zombie = function() {
      this.type = 20;
      that.spriteX = 0;
    };
  
    this.draw = function() {
      that.spriteX = that.width * that.frame;
      gameUI.draw(element, that.spriteX, that.spriteY, that.width, that.height, that.x, that.y, that.width, that.height);
    };
  
    this.update = function() {
      var gravity = 0.2;
  
      if (that.onGround) {
        that.yVelocity = 0;
      }
  
      if (that.state == 'killed') {
        that.frame = 2; //squashed zombie
  
        animationTick++;
        if (animationTick >= 60) {
          that.frame = 4;
        }
      } else if (that.state == 'killedByBullet') {
        //zombie falling off screen
        that.frame = 3;
        that.yVelocity += gravity;
        that.y += that.yVelocity;
      } else {
        //only animate when not killed
        that.yVelocity += gravity;
        that.x += that.xVelocity;
        that.y += that.yVelocity;
  
        //for animating
        animationTick += 1;
  
        if (animationTick > tickLimit) {
          animationTick = 0;
          if (that.frame == 0) {
            that.frame = 1;
          } else {
            that.frame = 0;
          }
        }
      }
    };
  }
