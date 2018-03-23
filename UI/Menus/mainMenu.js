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

        $(document).ready(function() {
            $("#menuSong").get(0).play();
        });

    }
    
    //Menu options hovering sound
    $("#menu a")
        .each(function(i){
            if(i != 0){
                $("#menuClick")
                    .clone()
                    .attr("id", "menuClick" + i)
                    .appendTo($(this).parent());
            }
            $(this).data("beeper", i);
        })
        .mouseenter(function(){
            $("menuClick" + $(this).data("beeper"))[0].play();
        });
    $("menuClick").attr("id", "menuClick0");
    
    /*var menuClick = $("#menuClick")[0];
    $("#hoverClick")
    .mouseenter(function() {
        menuClick.play();
    });

    $("#hoverClick")
    .mouseleave(function(){
        menuClick.stop();
    });*/
      
    //Music handling for menu music
    var x = document.getElementById("menuSong");
    
    $('#musicCheckbox').change(function(){
        if($(this).is(':checked')) {
            x.muted = false;
        } else {
            // Checkbox is not checked..
            x.muted = true;
        }
    });

    /*function enableMute() { 
        x.muted = true;
    } 
    
    function disableMute() { 
        x.muted = false;
    }

    function toggleMusic(){
        if(document.getElementById("musicCheckbox").checked){
            x.disableMute();
        }
        else{
            x.enableMute();
        }
    }*/

    

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

    $('.controls').click(function() {
        $('#options').hide();
        $('#controls').show();
        $('#menu').addClass('controls');
    });

    $('.audio').click(function() {
        $('#options').hide();
        $('#audio').show();
        $('#menu').addClass('audio');
    });

    $('.difficulty').click(function() {
        $('#options').hide();
        $('#difficulty').show();
        $('#menu').addClass('difficulty');
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
        $('#controls').hide();
        $('#main').show();
        $('#menu').removeClass('#controls');
    });

    $('.back').click(function() {
        $('#audio').hide();
        $('#main').show();
        $('#menu').removeClass('#audio');
    });

    $('.back').click(function() {
        $('#difficulty').hide();
        $('#main').show();
        $('#menu').removeClass('#difficulty');
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
