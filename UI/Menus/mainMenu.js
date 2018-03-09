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
    
        // $('#progress').hide();
        $('#main').show();
        $('#menu').addClass('main');
        // $('.sound').show();
    }

    /**
     * Click handlers for the different menu screens
     */
    $('.loadGame').click(function() {
        $('#main').hide();
        $('#loadGame').show();
        $('#menu').addClass('loadGame');
    });

    $('.levelEditor').click(function() {
        $('#main').hide();
        $('#levelEditor').show();
        $('#menu').addClass('levelEditor');
    });

    $('.profile').click(function() {
        $('#main').hide();
        $('#profile').show();
        $('#menu').addClass('profile');
    });

    $('.options').click(function() {
        $('#main').hide();
        $('#options').show();
        $('#menu').addClass('options');
    });

    $('.back').click(function() {
        $('#loadGame').hide();
        $('#main').show();
        $('#menu').removeClass('#loadGame');
    });

    $('.back').click(function() {
        $('#levelEditor').hide();
        $('#main').show();
        $('#menu').removeClass('#levelEditor');
    });

    $('.back').click(function() {
        $('#options').hide();
        $('#main').show();
        $('#menu').removeClass('#options');
    });

    $('.back').click(function() {
        $('#profile').hide();
        $('#main').show();
        $('#menu').removeClass('#profile');
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
    
    mainMenu();
})(jQuery);