function Main() {
  var gameUI = GameUI.getInstance();

  var levelWidth; //width of the game world
  var height;
  var viewPort; //width of canvas, viewPort that can be seen
  var tileSize;
  var map;
  var codedLevels;
  var scrolledDistance; //distance scrolled as player moves to the right of the screen
  var centerOfScreen; //center position of the viewPort, viewable screen
  var playerInGround;

  //instances
  var player;
  var element;
  var gameSound;
  var score;

  var keys = [];
  var zombies;
  var zombies2;
  var powerUps;
  var bullets;
  var bulletFlag = false;
  var grenades;
  var grenadeFlag = false;

  var currentLevel;

  var animationID;
  var timeOutId;

  var animationTick = 0; //tick count for animating
  var tickLimit = 25; //tick limit for player sprite
  var controlsTickCount = 0; //countdown for showing controls at beginning of game
  var that = this;

  this.init = function(levelMaps, level) {
    height = 480;
    levelWidth = 0;
    viewPort = 1280;
    tileSize = 32;
    scrolledDistance = 0;
    zombies = [];
    powerUps = [];
    bullets = [];
    grenades = [];

    gameUI.setWidth(viewPort);
    gameUI.setHeight(height);
    gameUI.show();

    currentLevel = level;  // track current level
    codedLevels = levelMaps; // hard-coded maps
    map = JSON.parse(levelMaps[currentLevel]);    //parse through json map

    if (!score) {
      //so that when level changes, it uses the same instance
      score = new Score();
      score.init();
    }
    score.displayScore();
    score.updateLevelNum(currentLevel);

    if (!player) {
      //so that when level changes, it uses the same instance
      player = new Player();
      player.init();
    } else {
      player.x = 10;
      player.frame = 0;
    }
    element = new Element();
    gameSound = new GameSound();
    gameSound.init();

    that.calculateMaxWidth();
    that.bindKeyPress();
    that.startGame();
  };

  that.calculateMaxWidth = function() {
    //calculates the max width of the game according to map size
    for (var row = 0; row < map.length; row++) {
      for (var column = 0; column < map[row].length; column++) {
        if (levelWidth < map[row].length * 32) {
          levelWidth = map[column].length * 32;
        }
      }
    }
  };

  // bindings for game controls
  that.bindKeyPress = function() {
    var canvas = gameUI.getCanvas(); 

    //key binding
    document.body.addEventListener('keydown', function(e) {
      keys[e.keyCode] = true;
    });

    document.body.addEventListener('keyup', function(e) {
      keys[e.keyCode] = false;
    });     
  };

  //Main Game Loop
  this.startGame = function() {
    animationID = window.requestAnimationFrame(that.startGame);

    gameUI.clear(0, 0, levelWidth, height);

    if (controlsTickCount < 1000) {
      that.showInstructions(); //showing control instructions
      controlsTickCount++;
    }

    that.renderMap();

    for (var i = 0; i < powerUps.length; i++) {
      powerUps[i].draw();
      powerUps[i].update();
    }

    for (var i = 0; i < bullets.length; i++) {
      bullets[i].draw();
      bullets[i].update();
    }

    for(var i = 0; i < grenades.length; i++){
      grenades[i].draw();
      grenades[i].update();
    }

    for (var i = 0; i < zombies.length; i++) {
      zombies[i].draw();
      zombies[i].update();
    }

  

    that.isPlayerPowerupCollision();
    that.checkBulletEnemyCollision();
    that.checkEnemyPlayerCollision();

    player.draw();
    that.updatePlayer();
    that.wallCollision();
    playerInGround = player.onGround; //for use with picking up mapPiece
  };

  this.showInstructions = function() {
    //gameUI.writeText('Controls: Use arrow keys to move/jump, shift to run, c to shoot', 30, 30);
    //gameUI.writeText('Tip: Jumping while running makes you jump higher', 30, 60);
  };

  this.renderMap = function() {
    //setting false each time the map renders so that elements fall off a platform and not hover around
    player.onGround = false;

    for (var i = 0; i < powerUps.length; i++) {
      powerUps[i].onGround = false;
    }
    for (var i = 0; i < zombies.length; i++) {
      zombies[i].onGround = false;
    }

    for (var row = 0; row < map.length; row++) {
      for (var column = 0; column < map[row].length; column++) {
        switch (map[row][column]) {
          case 1: //platform
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.platform();
            element.draw();

            that.checkElementPlayerCollision(element, row, column);
            that.isPowerupElementCollision(element);
            that.isEnemyElementCollision(element);
            that.isBulletElementCollision(element);
            break;

          case 2: //breakBrick
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.breakBrick();
            element.draw();

            that.checkElementPlayerCollision(element, row, column);
            that.isPowerupElementCollision(element);
            that.isEnemyElementCollision(element);
            that.isBulletElementCollision(element);
            break;

          case 3: //powerupBrick
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.powerupBrick();
            element.draw();

            that.checkElementPlayerCollision(element, row, column);
            that.isPowerupElementCollision(element);
            that.isEnemyElementCollision(element);
            that.isBulletElementCollision(element);
            break;

          case 4: //unbreakBrick
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.unbreakBrick();
            element.draw();

            that.checkElementPlayerCollision(element, row, column);
            that.isPowerupElementCollision(element);
            that.isEnemyElementCollision(element);
            that.isBulletElementCollision(element);
            break;

          case 5: //mapPiece
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.mapPiece();
            element.draw();

            that.checkElementPlayerCollision(element, row, column);
            break;

          case 6: //flag
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.flag();
            element.draw();
            break;

          case 7: //treeLeft
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.treeLeft();
            element.draw();

            that.checkElementPlayerCollision(element, row, column);
            that.isPowerupElementCollision(element);
            that.isEnemyElementCollision(element);
            that.isBulletElementCollision(element);
            break;

          case 8: //treeRight
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.treeRight();
            element.draw();

            that.checkElementPlayerCollision(element, row, column);
            that.isPowerupElementCollision(element);
            that.isEnemyElementCollision(element);
            that.isBulletElementCollision(element);
            break;

          case 9: //treeTopLeft
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.treeTopLeft();
            element.draw();

            that.checkElementPlayerCollision(element, row, column);
            that.isPowerupElementCollision(element);
            that.isEnemyElementCollision(element);
            that.isBulletElementCollision(element);
            break;

          case 10: //treeTopRight
            element.x = column * tileSize;
            element.y = row * tileSize;
            element.treeTopRight();
            element.draw();

            that.checkElementPlayerCollision(element, row, column);
            that.isPowerupElementCollision(element);
            that.isEnemyElementCollision(element);
            that.isBulletElementCollision(element);
            break;

          case 20: //zombie
            var enemy = new Enemy();
            enemy.x = column * tileSize;
            enemy.y = row * tileSize;
            enemy.zombie();
            enemy.draw();

            zombies.push(enemy);
            map[row][column] = 0;
            break;
          
         /*case 21: //zombie2
            var enemy = new Enemy2();
            enemy.x = column * tileSize;
            enemy.y = row * tileSize;
            enemy.zombie2();
            enemy.draw();

            zombies.push(enemy);
            map[row][column] = 0;
            break;*/
        }
      }
    }
  };

  this.isColliding = function(objA, objB) {
    // get the vectors to check against
    var vX = objA.x + objA.width / 2 - (objB.x + objB.width / 2);
    var vY = objA.y + objA.height / 2 - (objB.y + objB.height / 2);

    // add the half widths and half heights of the objects
    var hWidths = objA.width / 2 + objB.width / 2;
    var hHeights = objA.height / 2 + objB.height / 2;
    var directionOfCollision = null;

    // if the x and y vector are less than the half width or half height, then we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
      // figures out on which side we are colliding (top, bottom, left, or right)
      var offsetX = hWidths - Math.abs(vX);
      var offsetY = hHeights - Math.abs(vY);

      if (offsetX >= offsetY) {
        if (vY > 0 && vY < 37) {
          directionOfCollision = 't';
          if (objB.type != 5) {
            //if mapPiece then pass through it
            objA.y += offsetY;
          }
        } else if (vY < 0) {
          directionOfCollision = 'b';
          if (objB.type != 5) {
            //if mapPiece then pass through it
            objA.y -= offsetY;
          }
        }
      } else {
        if (vX > 0) {
          directionOfCollision = 'l';
          objA.x += offsetX;
        } else {
          directionOfCollision = 'r';
          objA.x -= offsetX;
        }
      }
    }
    return directionOfCollision;
  };

  this.checkElementPlayerCollision = function(element, row, column) {
    var directionOfCollision = that.isColliding(player, element);

    if (directionOfCollision == 'l' || directionOfCollision == 'r') {
      player.xVelocity = 0;
      player.isJumping = false;

      if (element.type == 5) {
        //level end
        that.levelFinish(directionOfCollision);
      }


      /*if(element.type == 6){
        //spikes
        if (player.type == 'armor') {
          player.type = 'normal';
          player.isInvincible = true;
          collisionWithPlayer = undefined;
          //sound when player powerDowns
          gameSound.play('powerDown');
          setTimeout(function() {
            player.isInvincible = false;
          }, 1000);
        } else if (player.type == 'shotgun') {
          player.type = 'armor';
          player.isInvincible = true;
          collisionWithPlayer = undefined;
          //sound when player powerDowns
          gameSound.play('powerDown');
          setTimeout(function() {
            player.isInvincible = false;
          }, 1000);
        } else if (player.type == 'normal') {
          //kill player if collision occurs when he is small
          that.pauseGame();
          player.frame = 13;
          collisionWithPlayer = undefined;
          score.lifeCount--;
          score.updateLifeCount();
          //sound when player dies
          gameSound.play('playerDie');
          timeOutId = setTimeout(function() {
            if (score.lifeCount == 0) {
              that.gameOver();
            } else {
              that.resetGame();
            }
          }, 3000);
          break;
        }
      }*/

    } else if (directionOfCollision == 'b') {
      if (element.type != 5) {
        //only if not level end
        player.onGround = true;
        player.isJumping = false;
      }
    } else if (directionOfCollision == 't') {
      if (element.type != 5) {
        player.yVelocity *= -1;
      }


      if (element.type == 3) {
        //PowerUp Box
        var powerUp = new PowerUp();

        //gives armor if player is normal, otherwise gives shotgun
        if (player.type == 'normal') {
          powerUp.armor(element.x, element.y);
          powerUps.push(powerUp);
        } else if (player.type == 'armor') {
          powerUp.shotgun(element.x, element.y);
          powerUps.push(powerUp);
        } else if(player.type == 'shotgun'){
          powerUp.armor(element.x, element.y);
          powerUps.push(powerUp);
        } 

       
        map[row][column] = 0; //sets to useless box after powerUp appears

        //sound when armor appears
        gameSound.play('powerUpAppear');
      }

      /*if (element.type == 11) {
        //Shotgun Box
        var powerUp = new PowerUp();
        powerUp.shotgun(element.x, element.y);
        powerUps.push(powerUp);

        map[row][column] = 0; //sets to useless box after powerUp appears

        //sound when shotgun appears
        gameSound.play('powerUpAppear');
      }*/

      if (element.type == 2) {
        score.brickScore++;
        score.totalScore += 100;

        score.updateBrickScore();
        score.updateTotalScore();
        map[row][column] = 0;

        gameSound.play('brickHit');
      }
    }
  };

  this.isPowerupElementCollision = function(element) {
    for (var i = 0; i < powerUps.length; i++) {
      var directionOfCollision = that.isColliding(powerUps[i], element);

      // in case of moving powerup elements
      if (directionOfCollision == 'l' || directionOfCollision == 'r') {
        powerUps[i].xVelocity *= -1; //change direction if collision with any element from the side
      } else if (directionOfCollision == 'b') {
        powerUps[i].onGround = true;
      }
    }
  };

  this.isEnemyElementCollision = function(element) {
    for (var i = 0; i < zombies.length; i++) {
      if (zombies[i].state != 'killedByBullet') {
        //so that zombies fall from the map when killed by bullet
        var directionOfCollision = that.isColliding(zombies[i], element);

        if (directionOfCollision == 'l' || directionOfCollision == 'r') {
          // Zombies change direction and increase speed on every collision with an element up to a limit of 7. Then speed reverts back to normal.
          zombies[i].xVelocity *= -1.12;
          if(zombies[i].xVelocity >= 7){
              zombies[i].xVelocity = -1;
          }
        } else if (directionOfCollision == 'b') {
          zombies[i].onGround = true;
        }
      }
    }
  };

  this.isBulletElementCollision = function(element) {
    for (var i = 0; i < bullets.length; i++) {
      var directionOfCollision = that.isColliding(bullets[i], element);

      if (directionOfCollision == 'b') {
        //if collision is from bottom of the bullet, it is onGround, so that it can be bounced
        bullets[i].onGround = true;
      } else if (directionOfCollision == 't' || directionOfCollision == 'l' || directionOfCollision == 'r') {
        bullets.splice(i, 1);
      }
    }
  };

  this.isPlayerPowerupCollision = function() {
    for (var i = 0; i < powerUps.length; i++) {
      var collisionWithPlayer = that.isColliding(powerUps[i], player);
      if (collisionWithPlayer) {
        if (powerUps[i].type == 30 && player.type == 'normal') {
          //armor
          player.type = 'armor';
        } else if (powerUps[i].type == 31 && player.type == 'armor') {
          //shotgun
          player.type = 'shotgun';
        } 
        
        else if(powerUps[i].type == 32){
          //Grenade
          player.type = 'grenade';
        }

        powerUps.splice(i, 1);

        score.totalScore += 250;
        score.updateTotalScore();

        //sound when powerup appears
        gameSound.play('powerUp');
      }
    }
  };

  this.checkEnemyPlayerCollision = function() {
    for (var i = 0; i < zombies.length; i++) {
      if (!player.isInvincible && zombies[i].state != 'killed' && zombies[i].state != 'killedByBullet') {
        //if player is isInvincible or zombies state is killed, collision doesnt occur
        var collisionWithPlayer = that.isColliding(zombies[i], player);

        if (collisionWithPlayer == 't') {
          //kill zombies if collision is from top
          zombies[i].state = 'killed';

          player.yVelocity = -player.speed;

          score.totalScore += 750;    //more points for jumping on enemies versus shooting them
          score.updateTotalScore();

          //sound when enemy dies
          gameSound.play('killEnemy');
        } else if (collisionWithPlayer == 'r' || collisionWithPlayer == 'l' || collisionWithPlayer == 'b') {
          zombies[i].xVelocity *= -1;

          if (player.type == 'armor') {
            //player.type = 'normal';
            player.isInvincible = true;
            collisionWithPlayer = undefined;
            
            if(player.health != 0){
              player.health--;
              //sound when player powerDowns
              gameSound.play('powerDown');

              setTimeout(function() {
                player.isInvincible = false;
              }, 1000);
            }
            else{
              //Player dies
              that.pauseGame();

                player.frame = 13;
                collisionWithPlayer = undefined;

                score.lifeCount--;
                score.updateLifeCount();

                //sound when player dies
                gameSound.play('playerDie');

                timeOutId = setTimeout(function() {
                  if (score.lifeCount == 0) {
                    that.gameOver();
                  } else {
                    that.resetGame();
                  }
                }, 3000);
            }
            
          } else if (player.type == 'normal' || player.type == 'shotgun' || player.type == 'grenade') {
              
              //Player gains invincibility frames
              player.isInvincible = true;
              collisionWithPlayer = undefined; // player cannot take damage from collision with enemy

              //if player health is not zero after collision, decrement player health
              if(player.health != 0){
                player.health--;
                //sound when player powerDowns
                gameSound.play('powerDown');

                setTimeout(function() {
                  player.isInvincible = false;
                }, 1000);
              }
              // else, player health must be zero, so player dies, loses a life and resets level.
              else{
                //Player dies
                that.pauseGame();

                  player.frame = 13;
                  collisionWithPlayer = undefined;

                  score.lifeCount--;
                  score.updateLifeCount();

                  //sound when player dies
                  gameSound.play('playerDie');

                  timeOutId = setTimeout(function() {
                    if (score.lifeCount == 0) {
                      that.gameOver();
                    } else {
                      that.resetGame();
                    }
                  }, 3000);
              }
            }
            break;
          
        }
      }
    }
  };

  this.checkBulletEnemyCollision = function() {
    for (var i = 0; i < zombies.length; i++) {
      for (var j = 0; j < bullets.length; j++) {

        // Check for collision with zombie
        if (zombies[i] && zombies[i].state != 'killed') {
          var collWithBullet = that.isColliding(zombies[i], bullets[j]);
        }

        if (collWithBullet) {
          bullets[j] = null;  //destroy bullet
          bullets.splice(j, 1);

          //if zombie still has health, decrement it.
          if(zombies[i].health != 0){
            zombies[i].health--;
          }
          //else the zombie has no more health and dies.
          else{
            zombies[i].state = 'killedByBullet';

            score.totalScore += 500;
            score.updateTotalScore();

            //sound when enemy dies
            gameSound.play('killEnemy');
          }
          
        }
      }
    }
  };

  /*this.checkBulletBlockCollision = function(){
  }*/

  this.wallCollision = function() {
    //for walls at end of the screen
    if (player.x >= levelWidth - player.width) {
      player.x = levelWidth - player.width;
    } else if (player.x <= scrolledDistance) {
      player.x = scrolledDistance + 1;
    }

    //kill the player when falling off map
    if (player.y >= height) {
      that.pauseGame();

      //sound when player dies
      gameSound.play('playerDie');

      score.lifeCount--;
      score.updateLifeCount();

      //if the player runs out of lives, reset the game after 3 seconds
      timeOutId = setTimeout(function() {
        if (score.lifeCount == 0) {
          that.gameOver();
        } else {
          that.resetGame();
        }
      }, 3000);
    }
  };

  //controlling player with keys
  this.updatePlayer = function() {
    var friction = 0.91;
    var gravity = 0.2;

    player.checkPlayerType();    //check player type: normal, armor, shotgun, grenade

    if (keys[38] || keys[32]) {
      //up arrow
      if (!player.isJumping && player.onGround) {
        player.isJumping = true;
        player.onGround = false;
        player.yVelocity = -(player.speed / 2 + 5.5);

        // player sprite position
        if (player.frame == 0 || player.frame == 1) {
          player.frame = 2; //right jump
        } else if (player.frame == 8 || player.frame == 9) {
          player.frame = 3; //left jump
        }

        //sound when player jumps
        gameSound.play('jump');
      }
    }

    if (keys[39]) {
      //right arrow
      that.checkPlayerPos(); //if player goes to the center of the screen, sidescroll the map

      if (player.xVelocity < player.speed) {
        player.xVelocity++;
      }

      //player sprite position
      if (!player.isJumping) {
        animationTick += 1;

        if (animationTick > tickLimit / player.speed) {
          animationTick = 0;

          if (player.frame != 1) {
            player.frame = 1;
          } else {
            player.frame = 0;
          }
        }
      }
    }

    if (keys[37]) {
      //left arrow
      if (player.xVelocity > -player.speed) {
        player.xVelocity--;
      }

      //player sprite position
      if (!player.isJumping) {
        animationTick += 1;

        if (animationTick > tickLimit / player.speed) {
          animationTick = 0;

          if (player.frame != 9) {
            player.frame = 9;
          } else {
            player.frame = 8;
          }
        }
      }
    }

    if (keys[16]) {
      //shift key
      player.speed = 4;
    } else {
      player.speed = 3;
    }

    if (keys[83] && player.type == 'shotgun') {
      //s key
      if (!bulletFlag) {
        bulletFlag = true;
        var bullet = new Bullet();
        if (player.frame == 9 || player.frame == 8 || player.frame == 3) {
          var direction = -1;
        } else {
          var direction = 1;
        }
        bullet.init(player.x, player.y, direction);
        bullets.push(bullet);

        //bullet sound
        gameSound.play('bullet');

        setTimeout(function() {
          bulletFlag = false; //only lets player fire bullet after 800ms.
        }, 800);
      }
    }

    if (keys[83] && player.type == 'shotgunWithArmor') {
      //s key
      if (!bulletFlag) {
        bulletFlag = true;
        var bullet = new Bullet();
        if (player.frame == 9 || player.frame == 8 || player.frame == 3) {
          var direction = -1;
        } else {
          var direction = 1;
        }
        bullet.init(player.x, player.y, direction);
        bullets.push(bullet);

        //bullet sound
        gameSound.play('bullet');

        setTimeout(function() {
          bulletFlag = false; //only lets player fire bullet after 800ms.
        }, 800);
      }
    }

    if(keys[65] && player.type == 'parasite'){
      //a key
      if(!grenadeFlag){
        grenadeFlag = true;
        var grenade = new Grenade();
        if (player.frame == 9 || player.frame == 8 || player.frame == 3) {
          var direction = -1;
        } else {
          var direction = 1;
        }
        grenade.init(player.x, player.y, direction);
        grenades.push(grenade);

        setTimeout(function(){
          grenadeFlag = false; //only let player throw grenade after 800ms.
        }, 800);
      }
    }

    //velocity 0 sprite position
    if (player.xVelocity > 0 && player.xVelocity < 1 && !player.isJumping) {
      player.frame = 0;
    } else if (player.xVelocity > -1 && player.xVelocity < 0 && !player.isJumping) {
      player.frame = 8;
    }

    if (player.onGround) {
      player.yVelocity = 0;

      //onGround sprite position
      if (player.frame == 3) {
        player.frame = 0; //looking right
      } else if (player.frame == 2) {
        player.frame = 8; //looking left
      }
    }

    //change player position
    player.xVelocity *= friction;
    player.yVelocity += gravity;

    player.x += player.xVelocity;
    player.y += player.yVelocity;
  };
  

  //Check position of player in order to move the screen
  this.checkPlayerPos = function() {
    centerOfScreen = scrolledDistance + viewPort / 2;

    //side scrolling as player reaches center of the viewPort
    if (player.x > centerOfScreen && centerOfScreen + viewPort / 2 < levelWidth) {
      gameUI.scrollWindow(-player.speed, 0);
      scrolledDistance += player.speed;
    }
  };

  this.levelFinish = function(directionOfCollision) {
    //game finishes when player collides with a piece of the map
    if (directionOfCollision == 'r') {
      player.x += 10;
      player.yVelocity = 2;
      player.frame = 11;
    } else if (directionOfCollision == 'l') {
      player.x -= 32;
      player.yVelocity = 2;
      player.frame = 10;
    }

    if (playerInGround) {
      player.x += 20;
      player.frame = 10;
      animationTick += 1;
      if (animationTick > tickLimit) {
        that.pauseGame();

        player.x += 10;
        animationTick = 0;
        player.frame = 12;

        //sound when stage clears
        gameSound.play('stageClear');

        
        //timer for transitioning to next level
        timeOutId = setTimeout(function() {
          currentLevel++;
          if (codedLevels[currentLevel]) {
            that.init(codedLevels, currentLevel);
            score.updateLevelNum(currentLevel);
          } else {
            that.gameOver();
          }
        }, 3000);
      }
    }
  };

  this.pauseGame = function() {
    window.cancelAnimationFrame(animationID);
  };

  this.gameOver = function() {
    score.gameOverView();
    gameUI.makeBox(0, 0, levelWidth, height);
    gameUI.writeText('You have died.', centerOfScreen - 80, height - 300);
    gameUI.writeText('Dr. Pandemic will now take over the world', centerOfScreen - 122, height / 2);

    level1Song.pause();
  };

  this.resetGame = function() {
    that.clearInstances();
    that.init(codedLevels, currentLevel);
  };

  // clear all element arrays, sounds, player, etc.
  this.clearInstances = function() {
    player = null;
    element = null;
    gameSound = null;

    zombies = [];
    bullets = [];
    powerUps = [];
    grenades = [];
  };

  this.clearTimeOut = function() {
    clearTimeout(timeOutId);
  };

  this.removeGameScreen = function() {
    gameUI.hide();

    if (score) {
      score.hideScore();
    }
  };

  this.showGameScreen = function() {
    gameUI.show();
  };
}
