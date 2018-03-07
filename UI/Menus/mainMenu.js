(function ($) {
    /**
     * Show the main menu after loading all assets
     */
    function mainMenu() {
        // for (var sound in assetLoader.sounds) {
        //   if (assetLoader.sounds.hasOwnProperty(sound)) {
        //     assetLoader.sounds[sound].muted = !playSound;
        //   }
        // }
    
        // // $('#progress').hide();
        $('#main').show();
        $('#menu').addClass('main');
        $('.sound').show();
    }

    /**
     * Click handlers for the different menu screens
     */
    $('.credits').click(function() {
        $('#main').hide();
        $('#credits').show();
        $('#menu').addClass('credits');
    });

    $('.back').click(function() {
        $('#credits').hide();
        $('#main').show();
        $('#menu').removeClass('credits');
    });

    // $('.sound').click(function() {
    //     var $this = $(this);
    //     // sound off
    //     if ($this.hasClass('sound-on')) {
    //     $this.removeClass('sound-on').addClass('sound-off');
    //     playSound = false;
    //     }
    //     // sound on
    //     else {
    //     $this.removeClass('sound-off').addClass('sound-on');
    //     playSound = true;
    //     }
    
    //     if (canUseLocalStorage) {
    //     localStorage.setItem('kandi.playSound', playSound);
    //     }
    
    //     // mute or unmute all sounds
    //     for (var sound in assetLoader.sounds) {
    //         if (assetLoader.sounds.hasOwnProperty(sound)) {
    //             assetLoader.sounds[sound].muted = !playSound;
    //         }
    //     }
    // });

    $('.play').click(function() {
        $('#menu').hide();
        startGame();
    });

    $('.restart').click(function() {
        $('#game-over').hide();
        startGame();
    });

    /*
    * Back button function, goes to previous page.
    */
    // function goBack() {
    //     window.history.back();
    // }
    
})(jQuery);