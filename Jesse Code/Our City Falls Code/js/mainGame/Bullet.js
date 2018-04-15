function Bullet() {
  var gameUI = GameUI.getInstance();

  var element = new Image();
  element.src = 'images/bullet.png';

  this.x;
  this.y;
  this.xVelocity;
  this.yVelocity;
  this.onGround = false;
  this.spriteX;
  this.spriteY = 0;
  this.width = 16;
  this.height = 16;
  var that = this;

  this.init = function(x, y, direction) {
    that.xVelocity = 6 * direction;
    that.yVelocity = 0;
    that.x = x + that.width;
    that.y = y + 30;
    that.type = 30;
    that.spriteX = 0;
  };

  this.draw = function() {
    gameUI.draw(element, that.spriteX, that.spriteY, that.width, that.height, that.x, that.y, that.width, that.height);
  };

  this.update = function() {
    var gravity = 0.0;

    that.yVelocity += gravity;

    that.x += that.xVelocity;
    that.y += that.yVelocity;
  };
}
