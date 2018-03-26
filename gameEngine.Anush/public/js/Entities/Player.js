
import Entity from '../game.js';
import FeatureForward from '../game.js';
import {loadPixelSheet} from '../game.js';
import {drawAnim} from '../game.js';

    const FAST_DRAG = 1/5000;
    const SLOW_DRAG = 1/1000;
    

export function loadPixelSheet{
    return loadPixelSheet('player')
.then(pixel => {
   
    return function createPlayer() {
    Player.size.set(18,40);
    var Player = new Entity();

    Player.addFeature(new Featureforward());
    Player.forward.dragFactor = SLOW_DRAG;

    Player.addFeature(new featureJump());
  

    Player.turbo = function setTurboState(turboOn){
        this.forward.dragFactor = turboOn? FAST_DRAG : SLOW_DRAG;
    }
    

    
    var runAnim = drawAnim(['run-1', 'run-2', 'run-3'], 6);
    function routeFrame(player) {
        if(!player.jump.falling < 0) {
            return 'jump';
        }
        if (player.forward.distance > 0) {
            if((player.velocity.x > 0 && player.forward.orientation < 0) || ( player.velocity.x < 0 && player.forward.orientation > 0 )) {
                    return 'break';
            } 
            return runAnim(player.forward.distance);
        }
        return 'idle';
    }
   
 
    Player.draw = function drawPlayer(ctx) {
    playerPixel.build(routeFrame(this),ctx, 0, 0, this.forward.heading <0);
   
    }
     return Player;
        }
     });

}


