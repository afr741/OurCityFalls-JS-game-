// Load images before game starts
function Preloader() {
  var gameDivs = GameDivs.getInstance();
  var imgSrc;
  var that = this;

  this.init = function() {

    imgSrc = {
      1: 'images/back-btn.png',
      2: 'images/background0.png',
      3: 'images/bullet.png',
      4: 'images/clear-map-btn.png',
      5: 'images/coin.png',
      6: 'images/delete-all-btn.png',
      7: 'images/editor-btn.png',
      8: 'images/elements.png',
      9: 'images/enemies.png',
      10: 'images/flag-pole.png',
      11: 'images/flag.png',
      12: 'images/mainMenu.png',
      13: 'images/grid-large-btn.png',
      14: 'images/grid-medium-btn.png',
      15: 'images/grid-small-btn.png',
      16: 'images/grid.png',
      17: 'images/lvl-size.png',
      18: 'images/player-head.png',
      19: 'images/player-sprites.png',
      20: 'images/powerups.png',
      21: 'images/save-map-btn.png',
      22: 'images/saved-btn.png',
      23: 'images/slider-left.png',
      24: 'images/slider-right.png',
      25: 'images/start-btn.png',
      26: 'images/enemies2.png',
      27: 'images/options-btn.png',
      28: 'images/profile-btn.png',
      29: 'images/Conf-pass.png',
      30: 'images/E-address.png',
      31: 'images/forgotpass-btn.png',
      32: 'images/password-tag.png',
      33: 'images/Register-btn.png',
      34: 'images/signin-btn.png',
      35: 'images/signup-btn.png',
      36: 'images/submit-btn.png',
      37: 'images/userName-tag.png'
    };

    that.loadImages(imgSrc);
  };

  this.loadImages = function(imgSrc) {
    var images = {};
    var loadedImages = 0;
    var totalImages = 0;

    for (var key in imgSrc) {
      totalImages++;
    }

    for (var key in imgSrc) {
      images[key] = new Image();
      images[key].src = imgSrc[key];

      images[key].onload = function() {
        loadedImages++;
        percentage = Math.floor(loadedImages * 100 / totalImages);

        if (loadedImages >= totalImages) {
          that.initMainApp();
        }
      };
    }
  };

  this.initMainApp = function() {
    var playerMakerInstance = Menu.getInstance();
    playerMakerInstance.init();
  };
}

window.onload = function() {
  var preloader = new Preloader();
  preloader.init();
};
