function Score() {
  var gameDivs = GameDivs.getInstance();

  var mainWrapper;
  var scoreWrapper;
  var coinScoreWrapper;
  var totalScoreWrapper;
  var lifeCountWrapper;
  var levelWrapper;

  this.coinScore;
  this.totalScore;
  this.lifeCount;

  var that = this;

  this.init = function() {
    that.coinScore = 0;
    that.totalScore = 0;
    that.lifeCount = 5;

    mainWrapper = gameDivs.getMainWrapper();

    scoreWrapper = gameDivs.create('div');
    coinScoreWrapper = gameDivs.create('div');
    totalScoreWrapper = gameDivs.create('div');
    lifeCountWrapper = gameDivs.create('div');
    levelWrapper = gameDivs.create('div');

    gameDivs.addClass(scoreWrapper, 'hudWrapper');
    gameDivs.addClass(coinScoreWrapper, 'coin-score');
    gameDivs.addClass(totalScoreWrapper, 'total-score');
    gameDivs.addClass(lifeCountWrapper, 'lives');
    gameDivs.addClass(levelWrapper, 'level-num');

    gameDivs.append(scoreWrapper, levelWrapper);
    gameDivs.append(scoreWrapper, lifeCountWrapper);
    gameDivs.append(scoreWrapper, coinScoreWrapper);
    gameDivs.append(scoreWrapper, totalScoreWrapper);
    gameDivs.append(mainWrapper, scoreWrapper);

    that.updateCoinScore();
    that.updateTotalScore();
    that.updateLifeCount();
    that.updateLevelNum(1);
  };

  this.updateCoinScore = function() {
    if (that.coinScore == 100) {
      that.coinScore = 0;
      that.lifeCount++;
      that.updateLifeCount();
    }

    gameDivs.setHTML(coinScoreWrapper, 'Coins: ' + that.coinScore);
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

    that.coinScore = 0;
    that.lifeCount = 5;
    that.totalScore = 0;
    that.updateCoinScore();
    that.updateTotalScore();
    that.updateLifeCount();
  };

  this.gameOverView = function() {
    gameDivs.style(scoreWrapper, { background: 'black' });
  };
}
