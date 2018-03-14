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
    $('.offline').click(function() {
        $('#login').hide();
        $('#main').show();
        $('#menu').addClass('main');
    });

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
    
    $('.stats').click(function() {
        $('#profile').hide();
        $('#stats').show();
        $('#menu').addClass('stats');
    });
    
    $('.achievements').click(function() {
        $('#profile').hide();
        $('#achievements').show();
        $('#menu').addClass('achievements');
    });

    $('.options').click(function() {
        $('#main').hide();
        $('#options').show();
        $('#menu').addClass('options');
    });

    /*
    * Click handlers of back button function for the different menu screens
    */
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
    
    $('.back').click(function() {
        $('#stats').hide();
        $('#main').show();
        $('#menu').removeClass('#stats');
    });
    
    $('.back').click(function() {
        $('#achievements').hide();
        $('#main').show();
        $('#menu').removeClass('#achievements');
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
    
    mainMenu();
})(jQuery);
