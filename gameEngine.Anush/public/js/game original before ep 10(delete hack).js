

const Sides = {
    TOP: Symbol('top'),
    BOTTOM: Symbol('bottom'),
};
class OrderedLayers {   // Draw all the layers in order.    
    constructor(){
    this.layers = [];   
                }
    build(ctx,camera){
        this.layers.forEach(function(layer){
            layer(ctx,camera);
        });
    }
};
    
class DrawingPixel {    
    constructor(img, width, height) {
        this.img = img;
        this.width = width;
        this.height = height;
        this.bricks = new Map(); // create a map to save the subset image(supplier).
    }

    locate(name, x, y,width, height) { // creating a locate method where we can extract a subset of an img by allocating the position of the subset.
       
        var suppliers = [false, true].map(flip => {

        var supplier = document.createElement('canvas'); // save the subset image to a supplier in order to simplify the process of adding subset images efficiently. 
        supplier.height = height; // Assigning subset img measurement to the supplier.
        supplier.width = width; //------
       
        var ctx =  supplier.getContext('2d');
       
       if(flip) {
        ctx.scale(-1,1);
        ctx.translate(-width, 0); 
       }
        ctx.drawImage(this.img,x,y, //subset img properties
        width,height,0,0,width,height); //Size of the subset.
       
       return supplier;
    });
        this.bricks.set(name, suppliers); // add the subset image to the map.
    }
   
    build(name, ctx, x, y, flip = false,) { // Sketch the subset.
        var supplier = this.bricks.get(name)[flip ? 1: 0];
        ctx.drawImage(supplier, x, y);
    }
    locateBrick(name,x,y){  // sketch the subsete with width and height for the Background tiles.
        this.locate(name,x * this.width, y * this.height,this.width,this.height);
        }
    buildBrick(name, ctx, x, y) {
        this.build(name, ctx, x * this.width, y * this.height);
    }
}


class Vector {
    constructor(x,y){
        this.set(x,y);
           
                    }
        set(x,y){
        this.x = x;
        this.y = y;
                }
            }

class Entity {
    constructor(){
    this.position = new Vector(0,0);
    this.velocity = new Vector(0,0);
    this.size = new Vector(0,0);
    this.features = [] //creating features to ease the composition process
    }
    addFeature(feature){
        this.features.push(feature);
        this[feature.NAME] = feature;

    }
    obstruct(side){
        this.features.forEach(feature => {
            feature.obstruct(this,side);
        }); 
    }

    update(TimeDifference){
        this.features.forEach(feature => {
        feature.update(this, TimeDifference);
        
    }); 
}
}
class Feature {
    constructor(name) { //name may be featureJump, featureVel or FeatureForward.
        this.NAME = name;
    }
    obstruct() {

    }
    update(){
        console.warn('Failed to update')

    }


}

class timeSet {
    constructor(TimeDifference = 1/60){ //timeDifference is the time between the current frame time and the lasttime frame. 
            let buildUptime = 0; 
            let LastTime = 0;
            
            this.updateAttorny = time=>{
            buildUptime += (time - LastTime)/1000; // Use seconds instead of MSec.
                
                
                while (buildUptime > TimeDifference){ // while loop to organize the time and the shape dimensions for the jump.
                this.update(TimeDifference);
                buildUptime -= TimeDifference;
                                                    }
                LastTime = time;
                this.enqueue();
            
                                        }
        }
        enqueue(){  
            requestAnimationFrame(this.updateAttorny);
                }
        begin(){
            this.enqueue();
            }
        }
//var KeyDown = 1;
//var KeyUp = 0;
class KeyboardKeys {
    constructor() {
        // Holds the current state of a given key
        this.keyModes = new Map();

        // Holds the callback functions for a key code
        this.keyBack = new Map();
    }

    Matching(code, confirm) {
        this.keyBack.set(code, confirm);
    }

    controlEvent(event) {
        // extract the keycode
        const {code} = event;

        if (this.keyBack.has(code)) {
            // If there is a match, then avoid any pressed keyboard keys doing what they are supposed to do in the browser.
            event.preventDefault(); 
        }

        else
        {
            return false;
        }

        if (event.type == 'keydown') 
            var keyMode = 1;
        else
             var keyMode = 0;

        if (this.keyModes.get(code) === keyMode) {
            return;
        }

        this.keyModes.set(code, keyMode);
        //console.log(this.keyModes);

        this.keyBack.get(code)(keyMode);
    }

    respondTo(window) {
        

        var StateArr = ['keydown', 'keyup'];
        StateArr.forEach(codeNumber => {
            window.addEventListener(codeNumber, event => {
                this.controlEvent(event);
            });
        });

    }
    
}
class Level {
    constructor(){
        this.orl = new OrderedLayers();
        this.Entity = new Set();
        this.bricks = new Grid();
        this.brickCollision = new Collision(this.bricks);
        }
        update(TimeDifference){
            this.Entity.forEach(item=>{
            item.update(TimeDifference);
            
            item.position.x += item.velocity.x * TimeDifference; // correlative relation between vel and position in x based on time difference.
            this.brickCollision.XaxisCollision(item);
            
            item.position.y += item.velocity.y * TimeDifference; // correlative relation between vel and position in y  based on time difference.
            this.brickCollision.YaxisCollision(item);
            });

        }
    }
class featureVel extends Feature {
    constructor(){
        super('velocity'); // call the constructor in the inherited class Feature
    }
    update(item, TimeDifference){
    item.position.x += item.velocity.x * TimeDifference;
    item.position.y += item.velocity.y * TimeDifference;
    }

    }
class featureJump extends Feature {
    constructor(){
        
        super('jump'); // call the constructor in the inherited class Feature
        this.ready = 0;
        this.period = 0.3; // how long the space key is pressed in seconds.
        this.timePeriod = 0;
        this.requestTime = 0;
        this.gracePeriod = 0.1;
        this.speedBoost = 0.3;
        this.vel = 250; // the velocity of the jump
    }
    begin(){
        this.requestTime = this.gracePeriod;
    }

    cancel(){
        this.timePeriod = 0;
        this.requestTime = 0;
    }
    get falling() {
        return this.ready < 0; 
    }
    obstruct(item,side) {
            if(side === Sides.BOTTOM) {
                this.ready = 1;
            }    
            if(side === Sides.TOP)   {
                this.cancel();
            }      
    }
    update(item, TimeDifference){
       if(this.requestTime > 0) {
           if(this.ready > 0) {
               this.timePeriod = this.period;
               this.requestTime = 0;
           }
           this.requestTime -= TimeDifference;
        }   
        if (this.timePeriod > 0){
            item.velocity.y = -(this.vel + Math.abs(item.velocity.x) *this.speedBoost);
            this.timePeriod -=TimeDifference;
     } 
        this.ready--;
    }

}

class Featureforward extends Feature {
    constructor(){
        super('forward'); // call the constructor in the inherited class Feature
      
        this.orientation = 0;
        this.acceleration = 500;
        this.deceleration = 300;
        this.dragFactor = 1/5000;

        this.distance = 0;
        this.heading = 1;
    }
    update(item, TimeDifference){
        const absX = Math.abs(item.velocity.x);
        if(this.orientation!== 0) {
            item.velocity.x += this.acceleration * this.orientation * TimeDifference;
            if(item.jump) {
                if(item.jump.falling === false) {
                    this.heading = this.orientation;
                }
            }   
            else {
                this.heading = this.orientation;
            } 
        } 
        else if( item.velocity.x !== 0){
            const decel = Math.min(absX, this.deceleration * TimeDifference);
            item.velocity.x += item.velocity.x > 0 ? -decel : decel;
        }
        else {
            this.distance = 0;
        } 
        const drag = this.dragFactor * item.velocity.x * absX;
        item.velocity.x -= drag;
    
        this.distance += absX * TimeDifference; 
    }
    
 }


class Grid {  // Grid class to accesses the x,y coordinates to determing brick type, i.e. path, background.
    constructor(){
        this.cell = [];
    }
    set(x,y,intersectV) {
        if(!this.cell[x]){
            this.cell[x] = [];

        }
        this.cell[x][y] = intersectV;
    }


    clear() {
        this.cell.length = 0;
        }


    get(x,y){
        var column = this.cell[x];
            if (column){
                return column[y];
            }
        }
        forEach(confirm){
            this.cell.forEach(function(column, x){
                column.forEach(function(intersectV,y){
                confirm(intersectV,x,y);
            });
        });

    }
}

class Collision {
    constructor(brickCollision){
        this.bricks =new BrickConverter(brickCollision);
    }
    YaxisCollision(item){ // Check path collision 
    var intersections = this.bricks.coordinatesDistance(
        item.position.x,item.position.x + item.size.x,
        item.position.y,item.position.y + item.size.y);
        
        intersections.forEach(function(brickFound){
        if (brickFound.brick.type!='path'){
        return;
    }
    if (item.velocity.y > 0){ // run the detection to be for hitting the ground path.
        if(item.position.y + item.size.y > brickFound.y1 ){
            item.position.y = brickFound.y1 - item.size.y;
            item.velocity.y = 0;
            item.obstruct(Sides.BOTTOM);
        }
    
    }
    else if (item.velocity.y < 0){ // run the detection to be for hitting the ceiling.  
        if(item.position.y < brickFound.y2 ){
                item.position.y = brickFound.y2;
                item.velocity.y = 0;
             }
        }
    });
    }


    XaxisCollision(item){
        var intersections = this.bricks.coordinatesDistance(
            item.position.x,item.position.x + item.size.x,
            item.position.y,item.position.y + item.size.y);
            
            intersections.forEach(function(brickFound){
            if (brickFound.brick.type!='path'){
            return;
        }
        if (item.velocity.x > 0){ //If Player passed the path brick, move the player back to the path 
            if(item.position.x +item.size.x > brickFound.x1 ){
                item.position.x = brickFound.x1 - item.size.x;
                item.velocity.x = 0;
            }
        }
        else if (item.velocity.x < 0){ //If Player passed the path brick, move the player back to the path 
            if(item.position.x < brickFound.x2 ){
                    item.position.x = brickFound.x2;
                    item.velocity.x = 0;
                 }
            }
        });
    }
    


    /*test(item){
    this.YaxisCollision(item);
    this.XaxisCollision(item);
    }*/
    }
    

class BrickConverter { // convert the world positions coordinates into brick coordinates x,y. 
    constructor(grid, brickSize = 16){
        this.grid = grid;
        this.brickSize = brickSize;
        
    }
    Brickcoordintes(position){
        return Math.floor(position / this.brickSize); // return the  coordinates
    }
    
    DistanceMatched(positionA,positionB){ // return a brick based on its coordinates.
        var MaxPos = Math.ceil(positionB / this.brickSize) * this.brickSize;
        var Difference = [];
        var position = positionA;
        
        do {
            Difference.push(this.Brickcoordintes(position));
            position = position + this.brickSize;
        }
        while(position < MaxPos);
            return Difference;

    }
    coordinatesMet(coordinateX,coordinateY){ /*coordinatesMet method ask the 
                                            matrix for the brick given it is coordinates*/
    var brick = this.grid.get(coordinateX,coordinateY);
    if(brick){
    var y1 = coordinateY * this.brickSize;
    var y2 = y1 + this.brickSize;
    var x1 = coordinateX * this.brickSize;
    var x2 = x1 + this.brickSize;
        return{
            brick,
            x1,
            x2,
            y1,
            y2,
            
        };
    }
}  
coordinatesPos(positionX,positionY){ // return the brick coordinates from the coordinatesMet method.
    return this.coordinatesMet(this.Brickcoordintes(positionX),
    this.Brickcoordintes(positionY));
}
coordinatesDistance(x1,x2,y1,y2){
    var intersections = [];
    this.DistanceMatched(x1,x2).forEach(coordinateX =>{
        this.DistanceMatched(y1,y2).forEach(coordinateY =>{
            var brickFound = this.coordinatesMet(coordinateX, coordinateY);
                if (brickFound) {
                    intersections.push(brickFound);
                }
            });
        });
        return intersections;
    }
}

function drawImage(url) { // Function to load images from the the img folder.
    return new Promise(function (resolve){ // return Promise
        var img = new Image(); // create image instance 
        img.addEventListener('load', function(){ //attach addEvent listener on the image
            resolve(img); //resolve the promise with uploaded image.
        });
        img.src = url; //Activates drawing the image
    });
}
 
 function loadJSON(url) {
 return fetch(url) //fetch allows to make network requests and return Json() object.
    .then(drw => drw.json());
}
    
function buildBricks(level,Levelbck){  // Iterate through the Json file reading the dimensions of the x's anmd
    function applyRange(background, xStart, xLen, yStart, yLen) {
        const xEnd = xStart +xLen;
          const yEnd = yStart +yLen;
        for (let x = xStart; x < xEnd; ++x) {
            for (let y = yStart; y < yEnd; ++y) {
               level.bricks.set(x,y, {
                name:background.brick,
                type:background.type,
            });
           }
       }
   }



    Levelbck.forEach(function(background){ // reducing number of arguments in j.son file
    background.dimensions.forEach(range => {
               if (range.length ==4) {
            const [xStart, xLen, yStart, yLen] = range;
            applyRange(background, xStart, xLen, yStart, yLen);
      
        } else if (range.length == 3) {
            const [xStart, xLen, yStart] = range;
            applyRange(background, xStart, xLen, yStart, 1); //if there is only one "1" in the end, you can delete them

        } else if (range.length == 2) {        //if there are two "1" in the end, you can delete them
            const [xStart, yStart] = range;
            applyRange(background, xStart, 1, yStart, 1);
            
          
            }
    });

    });
}


function loadPixelSheet(name) {
return loadJSON(`/pixels/${name}.json`)
    .then(sheetSpec => Promise.all([
            sheetSpec, 
            drawImage(sheetSpec.imageURL),
        ]))
    .then(([sheetSpec, img]) => {
        var pixels = new  DrawingPixel(
                            img, 
                            sheetSpec.tileW, 
                            sheetSpec.tileH);

        if(sheetSpec.bricks) {
        sheetSpec.bricks.forEach(brickSpec => {
            pixels.locateBrick(
                brickSpec.name,
                brickSpec.index[0],
                brickSpec.index[1]);
        });
       }

       if(sheetSpec.frames) {
        sheetSpec.frames.forEach(frameSpec => {
            pixels.locate(frameSpec.name,...frameSpec.rect);
        });
       }




        return pixels;
      });
}

function drawLevel(name) { // draw Level function to read Json files 
    return  loadJSON(`/levels/${name}.json`)
    .then(levelDetails => Promise.all([
        levelDetails,
        loadPixelSheet(levelDetails.DrawingPixel),

        ]))

 
    .then(function([levelDetails,pixels]){
        var level = new Level(); // The oredered levels are instanciated on the level object.
        buildBricks(level,levelDetails.Levelbck);
        var bgLayer = createbgLayer(level,pixels);
        level.orl.layers.push(bgLayer);// add the layers in order to the ordered layer instance on the level.
        
        var pixelLayer = createPixelLayer(level.Entity);
        level.orl.layers.push(pixelLayer); // add the layers in order to the ordered layer instance on the level.
        return level;
    });
}


  /** deleted, since we are using json via loadPixelSheet function
function drawPlayerPixels (){
    return drawImage('/img/Shooter.png') // Add the image from the img file as URL

    .then(function(img){
          
        var pixels = new DrawingPixel(img);
        pixels.locate('idle',21,10,32,41); // matching pixels to the uploaded img to find the path.
        return pixels;
    });

}   
**/
function createbgLayer (level, pixels){   // create the background layer first
    var bricks = level.bricks;
    var resolver = level.brickCollision.bricks;

    var supplier = document.createElement('canvas');
    var ctx = supplier.getContext('2d');
    supplier.width = 2048;
    supplier.height = 350;

function redraw(startIndex, endIndex) {
    for (let x = startIndex; x <= endIndex; ++x) {
        const col = bricks.cell[x];
        if (col){
            col.forEach((brick,y) => {
                pixels.buildBrick(brick.name, ctx, x, y);
            });
        }
    }
}


    return function drawBgLayer(ctx, camera) {

        var drawWidth = resolver.Brickcoordintes(camera.size.x);
        var drawFrom = resolver.Brickcoordintes(camera.position.x);
        var drawTo = drawFrom + drawWidth;
        redraw(drawFrom, drawTo);

        ctx.drawImage(supplier,-camera.position.x, -camera.position.y);
    };
}
function createPixelLayer(item, width = 64, height = 64){
    const pixelsSupplier = document.createElement('canvas');
    pixelsSupplier.width = width;
      pixelsSupplier.height = height;
      const pixelsSupplierCtx = pixelsSupplier.getContext('2d');



return function drawPlayerLayer(ctx, camera){
    item.forEach(function(item){
        pixelsSupplierCtx.clearRect(0,0,width,height);
    item.draw(pixelsSupplierCtx);
    ctx.drawImage(pixelsSupplier, 
                    item.position.x - camera.position.x,
                    item.position.y - camera.position.y);
});
};
}

function CollisionDetectionLayer(level){
    var convertedBricks = []; 
    var brickConverter = level.brickCollision.bricks;
    var brickSize = brickConverter.brickSize;
    var coordinatesMetinitial = brickConverter.coordinatesMet;
    brickConverter.coordinatesMet = function VertualcoordinatesMet(x,y){
    convertedBricks.push({x,y});
    return coordinatesMetinitial.call(brickConverter,x,y)
    }   

    return function detectCollision(ctx, camera){
        convertedBricks.forEach(function({x, y}){
            //console.log('Working');
         ctx.beginPath();
         ctx.rect(x * brickSize - camera.position.x,
            y * brickSize, - camera.position.y, 
             brickSize, brickSize);
         ctx.stroke();
        });
        level.Entity.forEach(function(item){
        ctx.beginPath();
        ctx.rect(item.position.x -  camera.position.x,
            item.position.y - camera.position.y,
             item.size.x, 
             item.size.y);
        ctx.stroke();
        });
        convertedBricks.length = 0;
        }
    }
function createCameraLayer(cameraToDraw) {
    return function drawCameraRect(ctx, fromCamera){
ctx.strokeStyle = 'purple';
 ctx.beginPath();
        ctx.rect(cameraToDraw.position.x -  fromCamera.position.x,
            cameraToDraw.position.y - fromCamera.position.y,
             cameraToDraw.size.x, 
             cameraToDraw.size.y);
        ctx.stroke();
    }
}

     class Camera {
        constructor() {
            this.position = new Vector (0,0);
            this.size = new Vector(800, 270);
        }
    }

var canvas = document.getElementById('view');// Access the main canvas for painting.
var ctx = canvas.getContext('2d');// Access the context in order to use the API.

Promise.all([loadPixelSheet('player'),//loadPixelSheet instead of loadMario
drawLevel('level1'),]) // Parallalizing the drawing time for the level pixels and the background
.then(function([playerPixel,level]){
 
    const camera = new Camera();
    window.camera = camera;




    var gravity = 1500;
    var Player = new Entity();
    Player.position.set(32,32);
  
    Player.addFeature({
        NAME: 'hacktrait', 
        obstruct() {

        }, 

update(Player,TimeDifference){
 if(Player.velocity.x < 0) {

    const spawn = loadPixelSheet('player');
    spawn.position.x = Player.position.x;
    spawn.position.y = Player.position.y;
    spawn.velocity.x = Player.velocity.x - 200;
    level.Entity.add(spawn);
    this.spawnTimeout = 0;
            }
            this.spawnTimeout +=TimeDifference;
        }

    })


    level.Entity.add(Player);

/*level.orl.layers.push(
    CollisionDetectionLayer(level),
    createCameraLayer(camera));  */

    const FAST_DRAG = 1/5000;
    const SLOW_DRAG = 1/1000;
    


    Player.size.set(18,40);
    Player.addFeature(new featureJump());
    Player.addFeature(new Featureforward());
    Player.forward.dragFactor = SLOW_DRAG;
    //level.orl.layers.push(CollisionDetectionLayer(level));

    Player.turbo = function setTurboState(turboOn){
        this.forward.dragFactor = turboOn? FAST_DRAG : SLOW_DRAG;
    }
    
    var kPressed = new KeyboardKeys();
    kPressed.Matching("Space",function(keyMode){
        if (keyMode) {
            Player.jump.begin();
        }
        else { 
            Player.jump.cancel();
        }
    });
    kPressed.Matching("ArrowUp", function(keyMode){
        Player.turbo(keyMode);
    });

    kPressed.Matching("ArrowRight",function(keyMode){
        Player.forward.orientation+= keyMode ? 1 : -1;
    });
    kPressed.Matching("ArrowLeft",function(keyMode){
        Player.forward.orientation += -keyMode ? -1 :1;
    });
            

    kPressed.respondTo(window);
    

function drawAnim(frames, frameLen) {

    return function convertedFrame(distance) { 

        const frameIndex = Math.floor(distance / frameLen) % frames.length;
        const frameName =  frames[frameIndex];
          return frameName;  
    };
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



    var tSet = new timeSet(1/60);
    tSet.update = function update(TimeDifference){
    level.update(TimeDifference);
 	if (Player.position.x > 100) {

 		camera.position.x = Player.position.x - 100;
 	}

    level.orl.build(ctx, camera);
    Player.velocity.y += gravity * TimeDifference;
    timeSet.buildUptime -= TimeDifference;    
}
tSet.begin();
});


