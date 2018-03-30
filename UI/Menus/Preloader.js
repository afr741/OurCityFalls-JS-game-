function Preloader() {
    var view = View.getInstance();
  
    var loadingPercentage;
  
    var imageSources;
    var soundSources;
  
    var that = this;
  
    this.init = function() {
      loadingPercentage = view.create('div');
  
      view.addClass(loadingPercentage, 'loading-percentage');
      view.setHTML(loadingPercentage, '0%');
      view.appendToBody(loadingPercentage);
  
      imageSources = {
        1: '../Assets/images/horror-background.jpg'
      };
  
      that.loadImages(imageSources);
    };
  
    this.loadImages = function(imageSources) {
      var images = {};
      var loadedImages = 0;
      var totalImages = 0;
  
      for (var key in imageSources) {
        totalImages++;
      }
  
      for (var key in imageSources) {
        images[key] = new Image();
        images[key].src = imageSources[key];
  
        images[key].onload = function() {
          loadedImages++;
          percentage = Math.floor(loadedImages * 100 / totalImages);
  
          view.setHTML(loadingPercentage, percentage + '%'); //displaying percentage
  
          if (loadedImages >= totalImages) {
            view.removeFromBody(loadingPercentage);
            that.initMainApp();
          }
        };
      }
    };
  
    this.initMainApp = function() {
      var marioMakerInstance = MarioMaker.getInstance();
      marioMakerInstance.init();
    };
  }
  
  window.onload = function() {
    var preloader = new Preloader();
    preloader.init();
  };
  