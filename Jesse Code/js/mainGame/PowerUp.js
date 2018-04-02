function PowerUp() {
    var gameUI = GameUI.getInstance();
  
    var element = new Image();
    element.src = 'images/powerups.png';
  
    this.type;
    this.x;
    this.y;
    this.velX = 2;
    this.velY = 0;
    this.grounded = false;
    this.spriteX;
    this.spriteY = 0;
    this.width = 32;
    this.height = 32;
  
    var that = this;
  
    this.mushroom = function(x, y) {
      that.x = x;
      that.y = y - that.height;
      that.type = 30;
      that.spriteX = 0;
    };
  
    this.flower = function(x, y) {
      that.x = x;
      that.y = y - that.height;
      that.type = 31;
      that.spriteX = 32;
    };

    this.grenade = function(x, y){
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
  
        if (that.grounded) {
          that.velY = 0;
        }
  
        that.velY += gravity;
  
        //that.x += that.velX;
        that.y += that.velY;
      }
    };
  }