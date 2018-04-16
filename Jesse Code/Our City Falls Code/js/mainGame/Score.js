function Score() {
  var gameDivs = GameDivs.getInstance();

  var mainWrapper;
  var scoreWrapper;
  var brickScoreWrapper;
  var totalScoreWrapper;
  var lifeCountWrapper;
  var levelWrapper;

  this.brickScore;
  this.totalScore;
  this.lifeCount;

  var that = this;

  this.init = function() {
    that.brickScore = 0;
    that.totalScore = 0;
    that.lifeCount = 5;

    mainWrapper = gameDivs.getMainWrapper();

    scoreWrapper = gameDivs.create('div');
    brickScoreWrapper = gameDivs.create('div');
    totalScoreWrapper = gameDivs.create('div');
    lifeCountWrapper = gameDivs.create('div');
    levelWrapper = gameDivs.create('div');

    gameDivs.addClass(scoreWrapper, 'hudWrapper');
    gameDivs.addClass(brickScoreWrapper, 'brick-score');
    gameDivs.addClass(totalScoreWrapper, 'total-score');
    gameDivs.addClass(lifeCountWrapper, 'lives');
    gameDivs.addClass(levelWrapper, 'level-num');

    gameDivs.append(scoreWrapper, levelWrapper);
    gameDivs.append(scoreWrapper, lifeCountWrapper);
    gameDivs.append(scoreWrapper, brickScoreWrapper);
    gameDivs.append(scoreWrapper, totalScoreWrapper);
    gameDivs.append(mainWrapper, scoreWrapper);

    that.updateBrickScore();
    that.updateTotalScore();
    that.updateLifeCount();
    that.updateLevelNum(1);
  };

  this.updateBrickScore = function() {
    if (that.brickScore == 100) {
      that.brickScore = 0;
      that.lifeCount++;
      that.updateLifeCount();
    }

    gameDivs.setHTML(brickScoreWrapper, 'Bricks: ' + that.brickScore);
  };

  this.updateTotalScore = function() {
    gameDivs.setHTML(totalScoreWrapper, 'Score: ' + that.totalScore);
  };

  this.updateLifeCount = function() {
    gameDivs.setHTML(lifeCountWrapper, 'x ' + that.lifeCount);
  };

  this.updateLevelNum = function(level) {
    gameDivs.setHTML(levelWrapper, 'Level: ' + level);
  };

  this.displayScore = function() {
    gameDivs.style(scoreWrapper, { display: 'block', background: '#330d00' });
  };

  this.hideScore = function() {
    gameDivs.style(scoreWrapper, { display: 'none' });

    that.brickScore = 0;
    that.lifeCount = 5;
    that.totalScore = 0;
    that.updateBrickScore();
    that.updateTotalScore();
    that.updateLifeCount();
  };

  this.gameOverView = function() {
    gameDivs.style(scoreWrapper, { background: 'black' });
  };
}
