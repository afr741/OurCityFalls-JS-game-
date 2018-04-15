function PowerUp() {
    var gameUI = GameUI.getInstance();
  
    var element = new Image();
    element.src = 'images/powerups.png';
  
    this.type;
    this.x;
    this.y;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.onGround = false;
    this.spriteX;
    this.spriteY = 0;
    this.width = 32;
    this.height = 32;
  
    var that = this;
  
    this.armor = function(x, y) {
      that.x = x;
      that.y = y - that.height;
      that.type = 30;
      that.spriteX = 0;
    };
  
    this.shotgun = function(x, y) {
      that.x = x;
      that.y = y - that.height;
      that.type = 31;
      that.spriteX = 32;
    };

    this.parasite = function(x, y){
      that.x = x;
      that.y = y - that.height;
      that.type = 32;
      that.spriteX = 64;
    }
  
    this.draw = function() {
      gameUI.draw(element, that.spriteX, that.spriteY, that.width, that.height, that.x, that.y, that.width, that.height);
    };
  
    this.update = function() {
      if (that.type == 30) {
        var gravity = 0.2;
  
        if (that.onGround) {
          that.yVelocity = 0;
        }
  
        that.yVelocity += gravity;
  
        //that.x += that.xVelocity;
        that.y += that.yVelocity;
      }

      if(that.type == 31){
        var gravity = 0.2;

        if(that.onGround){
          that.yVelocity = 0;
        }

        that.yVelocity += gravity;

        that.y += that.yVelocity;
      }

      if(that.type == 32){
        var gravity = 0.2;

        if (that.onGround) {
          that.yVelocity = 0;
        }

        that.yVelocity += gravity;
        
        that.x += that.xVelocity;
        //that.y += that.yVelocity;
      }
    };
  }
