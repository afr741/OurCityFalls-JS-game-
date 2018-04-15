function CreatedLevels() {
    var gameDivs = GameDivs.getInstance();
  
    var storage;
    var levelsWrapper;
  
    var that = this;
  
    this.init = function() {
      var mainWrapper = gameDivs.getMainWrapper();
      var deleteAllBtn = gameDivs.create('button');
      levelsWrapper = gameDivs.create('div');
  
      gameDivs.addClass(levelsWrapper, 'levels-wrapper');
      gameDivs.addClass(deleteAllBtn, 'delete-all-btn');
      gameDivs.style(levelsWrapper, { display: 'block' });
      gameDivs.append(levelsWrapper, deleteAllBtn);
      gameDivs.append(mainWrapper, levelsWrapper);
  
      deleteAllBtn.onclick = that.deleteAllMaps;
  
      storage = new Storage();
  
      that.showLevels();
    };
  
    this.showLevels = function() {
      var totalStoredLevels = storage.getLength();
  
      if (totalStoredLevels != 0) {
        for (var i = 1; i < totalStoredLevels; i++) {
          var levelButton = gameDivs.create('div');
          var levelName = storage.getItemName(i);
  
          gameDivs.setHTML(levelButton, levelName);
          gameDivs.addClass(levelButton, 'level-btn');
          gameDivs.append(levelsWrapper, levelButton);
  
          levelButton.onclick = (function(i) {
            return function() {
              that.startLevel(i);
              that.removeCreatedLevelsScreen();
            };
          })(i);
        }
      } else {
        var noMapsMessage = gameDivs.create('div');
  
        gameDivs.addClass(noMapsMessage, 'no-maps');
      }
    };
  
    this.deleteAllMaps = function() {
      storage.clear();
  
      that.removeCreatedLevelsScreen();
      that.init();
    };
  
    this.startLevel = function(i) {
      var editorInstance = Menu.getInstance();
      var levelName = storage.getItemName(i);
      var level = storage.getItem(levelName);
      var map = { 1: level }; //always only one level in saved maps.
  
      editorInstance.startGame(map);
    };
  
    this.showCreatedLevelsScreen = function() {
      if (levelsWrapper) {
        gameDivs.style(levelsWrapper, { display: 'block' });
      }
    };
  
    this.removeCreatedLevelsScreen = function() {
      if (levelsWrapper) {
        gameDivs.style(levelsWrapper, { display: 'none' });
  
        while (levelsWrapper.hasChildNodes()) {
          //removes all the created levels on screen, so that it can be initiated again showing new levels that user creates
          gameDivs.remove(levelsWrapper, levelsWrapper.lastChild);
        }
      }
    };
  }
