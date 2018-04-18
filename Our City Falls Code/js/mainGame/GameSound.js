function GameSound() {
    var brickHit;
    var powerUpAppear;
    var powerUp;
    var playerDie;
    var killEnemy;
    var stageClear;
    var bullet;
    var powerDown;
    var jump;
    var gameMusic;
  
    var that = this;
  
    this.init = function() {
      brickHit = new Audio('sounds/Hit_01.wav');
      powerUpAppear = new Audio('sounds/Pickup_03.wav');
      powerUp = new Audio('sounds/Pickup_04.wav');
      playerDie = new Audio('sounds/Jingle_Lose_00.wav');
      killEnemy = new Audio('sounds/zombie-grunt.wav');
      stageClear = new Audio('sounds/Jingle_Achievement_01.wav');
      bullet = new Audio('sounds/Shoot_01.wav');
      powerDown = new Audio('sounds/Hit_03.wav');
      jump = new Audio('sounds/Jump_00.wav');
      level1Song = new Audio('sounds/Juhani Junkala [Retro Game Music Pack] Level 1.wav');
      level2Song = new Audio('sounds/Juhani Junkala [Retro Game Music Pack] Level 2.wav');
      level3Song = new Audio('sounds/Juhani Junkala [Retro Game Music Pack] Level 3.wav');
      level4Song = new Audio('sounds/Juhani Junkala [Retro Game Music Pack] Level 2.wav');
      level5Song = new Audio('sounds/Juhani Junkala [Retro Game Music Pack] Level 2.wav');
      levelEditorSong = new Audio('sounds/Juhani Junkala [Retro Game Music Pack] Ending.wav');
    };
  
    this.play = function(element) {

      if (element == 'brickHit') {
        brickHit.pause();
        brickHit.currentTime = 0;
        brickHit.play();
      } else if (element == 'powerUpAppear') {
        powerUpAppear.pause();
        powerUpAppear.currentTime = 0;
        powerUpAppear.play();
      } else if (element == 'powerUp') {
        powerUp.pause();
        powerUp.currentTime = 0;
        powerUp.play();
      } else if (element == 'playerDie') {
        level2Song.pause();
        playerDie.pause();
        playerDie.currentTime = 0;
        playerDie.play();
      } else if (element == 'killEnemy') {
        killEnemy.pause();
        killEnemy.currentTime = 0;
        killEnemy.play();
      } else if (element == 'stageClear') {
        stageClear.pause();
        stageClear.currentTime = 0;
        stageClear.play();
      } else if (element == 'bullet') {
        bullet.pause();
        bullet.currentTime = 0;
        bullet.play();
      } else if (element == 'powerDown') {
        powerDown.pause();
        powerDown.currentTime = 0;
        powerDown.play();
      } else if (element == 'jump') {
        jump.pause();
        jump.currentTime = 0;
        jump.play();
      }
    };
  }
