function Element() {
    var gameUI = GameUI.getInstance();
  
    var element = new Image();
    element.src = 'images/elements.png';
  
    this.type;
    this.spriteX;
    this.spriteY = 0;
    this.x;
    this.y;
    this.width = 32;
    this.height = 32;
  
    var that = this;
  
    this.platform = function() {
      that.type = 1;
      that.spriteX = 0;
    };
  
    this.breakBrick = function() {
      that.type = 2;
      that.spriteX = 1 * that.width;
    };
  
    this.powerupBrick = function() {
      that.type = 3;
      that.spriteX = 2 * that.width;
    };
  
    this.unbreakBrick = function() {
      that.type = 4;
      that.spriteX = 3 * that.width;
    };
  
    this.levelWinFlag = function() {
      that.type = 5;
      that.spriteX = 4 * that.width;
    };
  
    this.flag = function() {
      that.type = 6;
      that.spriteX = 5 * that.width;
    };
  
    this.pipeLeft = function() {
      that.type = 7;
      that.spriteX = 6 * that.width;
    };
  
    this.pipeRight = function() {
      that.type = 8;
      that.spriteX = 7 * that.width;
    };
  
    this.pipeTopLeft = function() {
      that.type = 9;
      that.spriteX = 8 * that.width;
    };
  
    this.pipeTopRight = function() {
      that.type = 10;
      that.spriteX = 9 * that.width;
    };

    this.spikes = function(){
      that.type = 11;
      that.spriteX = 10 * that.width;
    }
  
    this.draw = function() {
      gameUI.draw(element, that.spriteX, that.spriteY, that.width, that.height, that.x, that.y, that.width, that.height);
    };
  }