function Main() {
    var gameUI = GameUI.getInstance();
  
    var maxWidth; //width of the game world
    var height;
    var viewPort; //width of canvas, viewPort that can be seen
    var tileSize;
    var map;
    var originalMaps;
  
    var translatedDist; //distance translated(side scrolled) as player moves to the right
    var centerPos; //center position of the viewPort, viewable screen
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
  
    var tickCounter = 0; //for animating player
    var maxTick = 25; //max number for ticks to show player sprite
    var instructionTick = 0; //showing instructions counter
    var that = this;
  
    this.init = function(levelMaps, level) {
      height = 480;
      maxWidth = 0;
      viewPort = 1280;
      tileSize = 32;
      translatedDist = 0;
      zombies = [];
      powerUps = [];
      bullets = [];
      grenades = [];
  
      gameUI.setWidth(viewPort);
      gameUI.setHeight(height);
      gameUI.show();
  
      currentLevel = level;  // track current level
      originalMaps = levelMaps; // hard-coded maps
      map = JSON.parse(levelMaps[currentLevel]);
  
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
          if (maxWidth < map[row].length * 32) {
            maxWidth = map[column].length * 32;
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
  
      gameUI.clear(0, 0, maxWidth, height);
  
      if (instructionTick < 1000) {
        that.showInstructions(); //showing control instructions
        instructionTick++;
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

    
  
      that.checkPowerUpPlayerCollision();
      that.checkBulletEnemyCollision();
      that.checkEnemyPlayerCollision();
  
      player.draw();
      that.updatePlayer();
      that.wallCollision();
      playerInGround = player.grounded; //for use with flag sliding
    };
  
    this.showInstructions = function() {
      gameUI.writeText('Controls: Use arrow keys to move/jump, shift to run, c to shoot', 30, 30);
      gameUI.writeText('Tip: Jumping while running makes you jump higher', 30, 60);
    };
  
    this.renderMap = function() {
      //setting false each time the map renders so that elements fall off a platform and not hover around
      player.grounded = false;
  
      for (var i = 0; i < powerUps.length; i++) {
        powerUps[i].grounded = false;
      }
      for (var i = 0; i < zombies.length; i++) {
        zombies[i].grounded = false;
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
              that.checkElementPowerUpCollision(element);
              that.checkElementEnemyCollision(element);
              that.checkElementBulletCollision(element);
              break;
  
            case 2: //breakBrick
              element.x = column * tileSize;
              element.y = row * tileSize;
              element.breakBrick();
              element.draw();
  
              that.checkElementPlayerCollision(element, row, column);
              that.checkElementPowerUpCollision(element);
              that.checkElementEnemyCollision(element);
              that.checkElementBulletCollision(element);
              break;
  
            case 3: //powerupBrick
              element.x = column * tileSize;
              element.y = row * tileSize;
              element.powerupBrick();
              element.draw();
  
              that.checkElementPlayerCollision(element, row, column);
              that.checkElementPowerUpCollision(element);
              that.checkElementEnemyCollision(element);
              that.checkElementBulletCollision(element);
              break;
  
            case 4: //unbreakBrick
              element.x = column * tileSize;
              element.y = row * tileSize;
              element.unbreakBrick();
              element.draw();
  
              that.checkElementPlayerCollision(element, row, column);
              that.checkElementPowerUpCollision(element);
              that.checkElementEnemyCollision(element);
              that.checkElementBulletCollision(element);
              break;
  
            case 5: //levelWinFlag
              element.x = column * tileSize;
              element.y = row * tileSize;
              element.levelWinFlag();
              element.draw();
  
              that.checkElementPlayerCollision(element, row, column);
              break;
  
            case 6: //flag
              element.x = column * tileSize;
              element.y = row * tileSize;
              element.flag();
              element.draw();
              break;
  
            case 7: //pipeLeft
              element.x = column * tileSize;
              element.y = row * tileSize;
              element.pipeLeft();
              element.draw();
  
              that.checkElementPlayerCollision(element, row, column);
              that.checkElementPowerUpCollision(element);
              that.checkElementEnemyCollision(element);
              that.checkElementBulletCollision(element);
              break;
  
            case 8: //pipeRight
              element.x = column * tileSize;
              element.y = row * tileSize;
              element.pipeRight();
              element.draw();
  
              that.checkElementPlayerCollision(element, row, column);
              that.checkElementPowerUpCollision(element);
              that.checkElementEnemyCollision(element);
              that.checkElementBulletCollision(element);
              break;
  
            case 9: //pipeTopLeft
              element.x = column * tileSize;
              element.y = row * tileSize;
              element.pipeTopLeft();
              element.draw();
  
              that.checkElementPlayerCollision(element, row, column);
              that.checkElementPowerUpCollision(element);
              that.checkElementEnemyCollision(element);
              that.checkElementBulletCollision(element);
              break;
  
            case 10: //pipeTopRight
              element.x = column * tileSize;
              element.y = row * tileSize;
              element.pipeTopRight();
              element.draw();
  
              that.checkElementPlayerCollision(element, row, column);
              that.checkElementPowerUpCollision(element);
              that.checkElementEnemyCollision(element);
              that.checkElementBulletCollision(element);
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
  
    this.collisionCheck = function(objA, objB) {
      // get the vectors to check against
      var vX = objA.x + objA.width / 2 - (objB.x + objB.width / 2);
      var vY = objA.y + objA.height / 2 - (objB.y + objB.height / 2);
  
      // add the half widths and half heights of the objects
      var hWidths = objA.width / 2 + objB.width / 2;
      var hHeights = objA.height / 2 + objB.height / 2;
      var collisionDirection = null;
  
      // if the x and y vector are less than the half width or half height, then we must be inside the object, causing a collision
      if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        var offsetX = hWidths - Math.abs(vX);
        var offsetY = hHeights - Math.abs(vY);
  
        if (offsetX >= offsetY) {
          if (vY > 0 && vY < 37) {
            collisionDirection = 't';
            if (objB.type != 5) {
              //if levelWinFlag then pass through it
              objA.y += offsetY;
            }
          } else if (vY < 0) {
            collisionDirection = 'b';
            if (objB.type != 5) {
              //if levelWinFlag then pass through it
              objA.y -= offsetY;
            }
          }
        } else {
          if (vX > 0) {
            collisionDirection = 'l';
            objA.x += offsetX;
          } else {
            collisionDirection = 'r';
            objA.x -= offsetX;
          }
        }
      }
      return collisionDirection;
    };
  
    this.checkElementPlayerCollision = function(element, row, column) {
      var collisionDirection = that.collisionCheck(player, element);
  
      if (collisionDirection == 'l' || collisionDirection == 'r') {
        player.xVelocity = 0;
        player.jumping = false;
  
        if (element.type == 5) {
          //level end
          that.levelFinish(collisionDirection);
        }


        /*if(element.type == 11){
          //spikes
          if (player.type == 'big') {
            player.type = 'small';
            player.invulnerable = true;
            collWithPlayer = undefined;

            //sound when player powerDowns
            gameSound.play('powerDown');

            setTimeout(function() {
              player.invulnerable = false;
            }, 1000);
          } else if (player.type == 'fire') {
            player.type = 'big';
            player.invulnerable = true;

            collWithPlayer = undefined;

            //sound when player powerDowns
            gameSound.play('powerDown');

            setTimeout(function() {
              player.invulnerable = false;
            }, 1000);
          } else if (player.type == 'small') {
            //kill player if collision occurs when he is small
            that.pauseGame();

            player.frame = 13;
            collWithPlayer = undefined;

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

      } else if (collisionDirection == 'b') {
        if (element.type != 5) {
          //only if not level end
          player.grounded = true;
          player.jumping = false;
        }
      } else if (collisionDirection == 't') {
        if (element.type != 5) {
          player.yVelocity *= -1;
        }

  
        if (element.type == 3) {
          //PowerUp Box
          var powerUp = new PowerUp();
  
          //gives armor if player is small, otherwise gives gun
          if (player.type == 'small') {
            powerUp.armor(element.x, element.y);
            powerUps.push(powerUp);
          } else {
            powerUp.shotgun(element.x, element.y);
            powerUps.push(powerUp);
          }

          //give grenade if player is fire type
          if(player.type == 'fire'){
            powerUp.grenade(element.x, element.y);
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
          //Coin Box
          score.coinScore++;
          score.totalScore += 100;
  
          score.updateCoinScore();
          score.updateTotalScore();
          map[row][column] = 0; //sets to useless box after coin appears
  
          //sound when coin block is hit
          gameSound.play('coin');
        }
      }
    };
  
    this.checkElementPowerUpCollision = function(element) {
      for (var i = 0; i < powerUps.length; i++) {
        var collisionDirection = that.collisionCheck(powerUps[i], element);
  
        if (collisionDirection == 'l' || collisionDirection == 'r') {
          powerUps[i].xVelocity *= -1; //change direction if collision with any element from the side
        } else if (collisionDirection == 'b') {
          powerUps[i].grounded = true;
        }
      }
    };
  
    this.checkElementEnemyCollision = function(element) {
      for (var i = 0; i < zombies.length; i++) {
        if (zombies[i].state != 'deadFromBullet') {
          //so that zombies fall from the map when dead from bullet
          var collisionDirection = that.collisionCheck(zombies[i], element);
  
          if (collisionDirection == 'l' || collisionDirection == 'r') {
            zombies[i].xVelocity *= -1;
          } else if (collisionDirection == 'b') {
            zombies[i].grounded = true;
          }
        }
      }
    };
  
    this.checkElementBulletCollision = function(element) {
      for (var i = 0; i < bullets.length; i++) {
        var collisionDirection = that.collisionCheck(bullets[i], element);
  
        if (collisionDirection == 'b') {
          //if collision is from bottom of the bullet, it is grounded, so that it can be bounced
          bullets[i].grounded = true;
        } else if (collisionDirection == 't' || collisionDirection == 'l' || collisionDirection == 'r') {
          bullets.splice(i, 1);
        }
      }
    };
  
    this.checkPowerUpPlayerCollision = function() {
      for (var i = 0; i < powerUps.length; i++) {
        var collWithPlayer = that.collisionCheck(powerUps[i], player);
        if (collWithPlayer) {
          if (powerUps[i].type == 30 && player.type == 'small') {
            //armor
            player.type = 'big';
          } else if (powerUps[i].type == 31) {
            //shotgun
            player.type = 'fire';
          } else if(powerUps[i].type == 32){
            //Grenade
            player.type = 'grenade';
          }

          powerUps.splice(i, 1);
  
          score.totalScore += 1000;
          score.updateTotalScore();
  
          //sound when powerup appears
          gameSound.play('powerUp');
        }
      }
    };
  
    this.checkEnemyPlayerCollision = function() {
      for (var i = 0; i < zombies.length; i++) {
        if (!player.invulnerable && zombies[i].state != 'dead' && zombies[i].state != 'deadFromBullet') {
          //if player is invulnerable or zombies state is dead, collision doesnt occur
          var collWithPlayer = that.collisionCheck(zombies[i], player);
  
          if (collWithPlayer == 't') {
            //kill zombies if collision is from top
            zombies[i].state = 'dead';
  
            player.yVelocity = -player.speed;
  
            score.totalScore += 1000;
            score.updateTotalScore();
  
            //sound when enemy dies
            gameSound.play('killEnemy');
          } else if (collWithPlayer == 'r' || collWithPlayer == 'l' || collWithPlayer == 'b') {
            zombies[i].xVelocity *= -1;
  
            if (player.type == 'big') {
              player.type = 'small';
              player.invulnerable = true;
              collWithPlayer = undefined;
  
              //sound when player powerDowns
              gameSound.play('powerDown');
  
              setTimeout(function() {
                player.invulnerable = false;
              }, 1000);
            }/* else if (player.type == 'fire') {
              player.type = 'small';
              player.invulnerable = true;
  
              collWithPlayer = undefined;
  
              //sound when player powerDowns
              gameSound.play('powerDown');
  
              setTimeout(function() {
                player.invulnerable = false;
              }, 1000);
            }*/ else if (player.type == 'small' || player.type == 'fire' || player.type == 'grenade') {
              //kill player if collision occurs when he is small
              that.pauseGame();
  
              player.frame = 13;
              collWithPlayer = undefined;
  
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
          }
        }
      }
    };
  
    this.checkBulletEnemyCollision = function() {
      for (var i = 0; i < zombies.length; i++) {
        for (var j = 0; j < bullets.length; j++) {
          if (zombies[i] && zombies[i].state != 'dead') {
            //check for collision only if zombies exist and is not dead
            var collWithBullet = that.collisionCheck(zombies[i], bullets[j]);
          }
  
          if (collWithBullet) {
            bullets[j] = null;
            bullets.splice(j, 1);
  
            zombies[i].state = 'deadFromBullet';
  
            score.totalScore += 1000;
            score.updateTotalScore();
  
            //sound when enemy dies
            gameSound.play('killEnemy');
          }
        }
      }
    };

    /*this.checkBulletBlockCollision = function(){

    }*/
  
    this.wallCollision = function() {
      //for walls (vieport walls)
      if (player.x >= maxWidth - player.width) {
        player.x = maxWidth - player.width;
      } else if (player.x <= translatedDist) {
        player.x = translatedDist + 1;
      }
  
      //kill the player when falling off map
      if (player.y >= height) {
        that.pauseGame();
  
        //sound when player dies
        gameSound.play('playerDie');
  
        score.lifeCount--;
        score.updateLifeCount();
  
        timeOutId = setTimeout(function() {
          if (score.lifeCount == 0) {
            that.gameOver();
          } else {
            that.resetGame();
          }
        }, 3000);
      }
    };
  
    //controlling player with key events
    this.updatePlayer = function() {
      var friction = 0.91;
      var gravity = 0.2;

      /*if(player.type == 'big'){
          gravity = 0.5;
          friction = 0.60;
      }*/
  
      player.checkPlayerType();    //check player type: normal, armor, shotgun, grenade
  
      if (keys[38] || keys[32]) {
        //up arrow
        if (!player.jumping && player.grounded) {
          player.jumping = true;
          player.grounded = false;
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
        if (!player.jumping) {
          tickCounter += 1;
  
          if (tickCounter > maxTick / player.speed) {
            tickCounter = 0;
  
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
        if (!player.jumping) {
          tickCounter += 1;
  
          if (tickCounter > maxTick / player.speed) {
            tickCounter = 0;
  
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
  
      if (keys[83] && player.type == 'fire') {
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

      /*if(keys[65] && player.type == 'parasite'){
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
      }*/
  
      //velocity 0 sprite position
      if (player.xVelocity > 0 && player.xVelocity < 1 && !player.jumping) {
        player.frame = 0;
      } else if (player.xVelocity > -1 && player.xVelocity < 0 && !player.jumping) {
        player.frame = 8;
      }
  
      if (player.grounded) {
        player.yVelocity = 0;
  
        //grounded sprite position
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
      centerPos = translatedDist + viewPort / 2;
  
      //side scrolling as player reaches center of the viewPort
      if (player.x > centerPos && centerPos + viewPort / 2 < maxWidth) {
        gameUI.scrollWindow(-player.speed, 0);
        translatedDist += player.speed;
      }
    };
  
    this.levelFinish = function(collisionDirection) {
      //game finishes when player slides the levelWinFlag and collides with the ground
      if (collisionDirection == 'r') {
        player.x += 10;
        player.yVelocity = 2;
        player.frame = 11;
      } else if (collisionDirection == 'l') {
        player.x -= 32;
        player.yVelocity = 2;
        player.frame = 10;
      }
  
      if (playerInGround) {
        player.x += 20;
        player.frame = 10;
        tickCounter += 1;
        if (tickCounter > maxTick) {
          that.pauseGame();
  
          player.x += 10;
          tickCounter = 0;
          player.frame = 12;
  
          //sound when stage clears
          gameSound.play('stageClear');
  
          timeOutId = setTimeout(function() {
            currentLevel++;
            if (originalMaps[currentLevel]) {
              that.init(originalMaps, currentLevel);
              score.updateLevelNum(currentLevel);
            } else {
              that.gameOver();
            }
          }, 5000);
        }
      }
    };
  
    this.pauseGame = function() {
      window.cancelAnimationFrame(animationID);
    };
  
    this.gameOver = function() {
      score.gameOverView();
      gameUI.makeBox(0, 0, maxWidth, height);
      gameUI.writeText('You have died.', centerPos - 80, height - 300);
      gameUI.writeText('Dr. Pandemic will now take over the world', centerPos - 122, height / 2);

    };
  
    this.resetGame = function() {
      that.clearInstances();
      that.init(originalMaps, currentLevel);
    };
  
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