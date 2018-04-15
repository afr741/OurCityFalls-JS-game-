
function Editor() {
    var gameDivs = GameDivs.getInstance();
    var mainWrapper;
    var gameWorld;
    var viewPort;
    var editorGrid;
    var elementWrapper; //holds images of elements in inventory
  
    var map;
    var levelWidth;
    var height = 480;
    var tileSize = 32;
    var scrollMargin = 0;
  
    var selectedElement = [];
  
    var that = this;
  
    this.init = function() {
      mainWrapper = gameDivs.getMainWrapper();
      viewPort = gameDivs.create('div');
  
      gameDivs.addClass(viewPort, 'levelEditorMenu');
      gameDivs.style(viewPort, { display: 'block' });
      gameDivs.append(mainWrapper, viewPort);
  
      that.createLevelEditor();
      that.drawEditorGrid(3840); //draws grid of size 3840px by default at start
      that.showElements();
    };
  
    this.createLevelEditor = function() {
      var rightArrow = gameDivs.create('div');
      var leftArrow = gameDivs.create('div');
      gameWorld = gameDivs.create('div');
  
      gameDivs.style(gameWorld, { width: 6400 + 'px' });
      gameDivs.style(gameWorld, { height: height + 'px' });
  
      gameDivs.addClass(rightArrow, 'right-arrow');
      gameDivs.addClass(leftArrow, 'left-arrow');
  
      gameDivs.append(viewPort, rightArrow);
      gameDivs.append(viewPort, leftArrow);
      gameDivs.append(viewPort, gameWorld);
  
      rightArrow.addEventListener('click', that.screenRight);
      leftArrow.addEventListener('click', that.screenLeft);
    };
  
    this.drawEditorGrid = function(width) {
      levelWidth = width;
      editorGrid = gameDivs.create('table');
  
      var row = height / tileSize;
      var column = levelWidth / tileSize;
  
      var mousedown = false;
      var selected = false;
  
      for (i = 1; i <= row; i++) {
        var tr = gameDivs.create('tr');
        for (j = 1; j <= column; j++) {
          var td = gameDivs.create('td');
  
          gameDivs.addClass(td, 'cell');
  
          td.addEventListener('mousedown', function(e) {
            e.preventDefault(); //to stop the mouse pointer to change
          });
  
          td.onmousedown = (function(i, j) {
            return function() {
              selectedElement.push(this);
              gameDivs.addClass(this, 'active');
              mousedown = true;
            };
          })(i, j);
  
          td.onmouseover = (function(i, j) {
            return function() {
              if (mousedown) {
                selectedElement.push(this);
                gameDivs.addClass(this, 'active');
              }
            };
          })(i, j);
  
          td.onmouseup = function() {
            mousedown = false;
          };
  
          gameDivs.append(tr, td);
        }
  
        gameDivs.append(editorGrid, tr);
  
        editorGrid.onmouseleave = function() {
          //if mouse hovers over the editor screen
          mousedown = false;
        };
      }
  
      gameDivs.append(gameWorld, editorGrid);
    };
  
    this.showElements = function() {
      elementWrapper = gameDivs.create('div');
  
      gameDivs.addClass(elementWrapper, 'element-wrapper');
      gameDivs.append(mainWrapper, elementWrapper);
  
      var elements = [
        'cell',
        'platform',
        'coin-box',
        'power-up-box',
        'useless-box',
        'flag',
        'flag-pole',
        'pipe-left',
        'pipe-right',
        'pipe-top-left',
        'pipe-top-right',
        'spikes',
        'zombie'
      ];
      var element;
  
      var saveLevel = gameDivs.create('button');
      var clearMap = gameDivs.create('button');
      var lvlSize = gameDivs.create('div');
      var editorGridSmallBtn = gameDivs.create('button');
      var editorGridMediumBtn = gameDivs.create('button');
      var editorGridLargeBtn = gameDivs.create('button');
  
      //for every element in the 'elements' array, it creates a div and sets the class name
      for (i = 0; i < elements.length; i++) {
        element = gameDivs.create('div');
  
        gameDivs.addClass(element, elements[i]);
        gameDivs.append(elementWrapper, element);
  
        element.onclick = (function(i) {
          return function() {
            that.drawElement(elements[i]);
          };
        })(i);
      }
  
      gameDivs.addClass(lvlSize, 'lvl-size');
      gameDivs.addClass(editorGridSmallBtn, 'grid-small-btn');
      gameDivs.addClass(editorGridMediumBtn, 'grid-medium-btn');
      gameDivs.addClass(editorGridLargeBtn, 'grid-large-btn');
      gameDivs.addClass(saveLevel, 'save-map-btn');
      gameDivs.addClass(clearMap, 'clear-map-btn');
      gameDivs.style(elementWrapper, { display: 'block' });
      gameDivs.append(elementWrapper, lvlSize);
      gameDivs.append(elementWrapper, editorGridSmallBtn);
      gameDivs.append(elementWrapper, editorGridMediumBtn);
      gameDivs.append(elementWrapper, editorGridLargeBtn);
      gameDivs.append(elementWrapper, clearMap);
      gameDivs.append(elementWrapper, saveLevel);
  
      saveLevel.addEventListener('click', that.saveLevel);
      clearMap.addEventListener('click', that.resetEditor);
      editorGridSmallBtn.addEventListener('click', that.editorGridSmall);
      editorGridMediumBtn.addEventListener('click', that.editorGridMedium);
      editorGridLargeBtn.addEventListener('click', that.editorGridLarge);
    };
  
    that.editorGridSmall = function() {
      gameDivs.remove(gameWorld, editorGrid);
      that.drawEditorGrid(1280); //small grid size
    };
  
    that.editorGridMedium = function() {
      gameDivs.remove(gameWorld, editorGrid);
      that.drawEditorGrid(3840); //medium grid size
    };
  
    that.editorGridLarge = function() {
      gameDivs.remove(gameWorld, editorGrid);
      that.drawEditorGrid(6400); //large grid size
    };
  
    this.drawElement = function(element) {
      /*
        every element that is selected is pushed into 'selectedElement' array
        after clicking the required element, it loops through the array and sets the class name 
        of that cell, changing the background of the cell.
      */
  
      for (var i = 0; i < selectedElement.length; i++) {
        gameDivs.addClass(selectedElement[i], element);
      }
  
      selectedElement = [];
    };
  
    that.createLevel = function() {
      var newLevel = [];
      var editorGridRows = editorGrid.getElementsByTagName('tr');
  
      //loops throught the table cells and checks for the class name, puts the value according to its class name;
      for (var i = 0; i < editorGridRows.length; i++) {
        var columns = [];
        var editorGridColumns = editorGridRows[i].getElementsByTagName('td');
        for (var j = 0; j < editorGridColumns.length; j++) {
          var value;
  
          switch (editorGridColumns[j].className) {
            case 'platform':
              value = 1;
              break;
  
            case 'coin-box':
              value = 2;
              break;
  
            case 'power-up-box':
              value = 3;
              break;
  
            case 'useless-box':
              value = 4;
              break;
  
            case 'zombie':
              value = 20;
              break;
  
            case 'flag-pole':
              value = 5;
              break;
  
            case 'flag':
              value = 6;
              break;
  
            case 'pipe-left':
              value = 7;
              break;
  
            case 'pipe-right':
              value = 8;
              break;
  
            case 'pipe-top-left':
              value = 9;
              break;
  
            case 'pipe-top-right':
              value = 10;
              break;

            /*case 'spikes':
              value = 11;
              break;*/
  
            default:
              value = 0;
              break;
          }
          columns.push(value);
        }
        newLevel.push(columns);
      }
      map = newLevel;
    };
  
    this.saveLevel = function() {
      var storage = new Storage();
      var levelCounter = storage.getItem('levelCounter') || 0;
  
      that.createLevel();
  
      levelCounter++;
  
      //for fixing the sorting of the localStorage, 01 02 ... 10 11, otherwise the sorting would be 1 10 11 .. 2 20 21 ..
      if (levelCounter < 10) {
        levelName = 'savedLevel' + '0' + levelCounter;
      } else {
        levelName = 'savedLevel' + levelCounter;
      }
  
      storage.setItem(levelName, map);
      storage.setItem('levelCounter', levelCounter);
  
      console.log(storage.getItem(levelName)); //so that it is possible to copy the JSON map
    };
  
    this.screenRight = function() {
      if (scrollMargin > -(levelWidth - 1280)) {
        scrollMargin += -160;
        gameDivs.style(gameWorld, { 'margin-left': scrollMargin + 'px' });
      }
    };
  
    this.screenLeft = function() {
      if (scrollMargin != 0) {
        scrollMargin += 160;
        gameDivs.style(gameWorld, { 'margin-left': scrollMargin + 'px' });
      }
    };
  
    this.resetEditor = function() {
      var editorGridRows = editorGrid.getElementsByTagName('tr');
      for (var i = 0; i < editorGridRows.length; i++) {
        var editorGridColumns = editorGridRows[i].getElementsByTagName('td');
  
        for (var j = 0; j < editorGridColumns.length; j++) {
          gameDivs.addClass(editorGridColumns[j], 'cell');
        }
      }
  
      selectedElement = [];
      scrollMargin = 0;
      gameDivs.style(gameWorld, { 'margin-left': scrollMargin + 'px' });
    };
  
    this.removeEditorScreen = function() {
      if (viewPort) {
        that.resetEditor();
        gameDivs.style(viewPort, { display: 'none' });
        gameDivs.style(elementWrapper, { display: 'none' });
      }
    };
  
    this.showEditorScreen = function() {
      if (viewPort) {
        gameDivs.style(viewPort, { display: 'block' });
        gameDivs.style(elementWrapper, { display: 'block' });
      }
    };
  }
