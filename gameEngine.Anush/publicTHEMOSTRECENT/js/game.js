const Sides = {
    TOP: Symbol('top'),
    BOTTOM: Symbol('bottom'),
    LEFT: Symbol('left'),
    RIGHT: Symbol('right'),
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
        this.tiles = new Map(); // create a map to save the subset image(supplier).
   		this.animations = new Map();
    }

    defineAnim(name, animation) {
   this.animations.set(name, animation);

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
        this.tiles.set(name, suppliers); // add the subset image to the map.
    }

    locatetile(name,x,y){  // sketch the subsete with width and height for the Background tiles.
        this.locate(name,x * this.width, y * this.height,this.width,this.height);
        }
   
    build(name, ctx, x, y, flip = false,) { // Sketch the subset.
        var supplier = this.tiles.get(name)[flip ? 1: 0];
        ctx.drawImage(supplier, x, y);
    }

    drawAnim(name, ctx, x,y, distance) {
    	const animation = this.animations.get(name);
    	this.buildtile(animation(distance), ctx, x, y);
    }

    buildtile(name, ctx, x, y) {
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
    this.lifetime = 0;
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
        this.lifetime +=TimeDifference;
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
                

                if (buildUptime >1) {
                	buildUptime = 1;	

                }
                
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
        this.tileCollision = null;
        this.gravity = 1000;
        this.totalTime =0;
        }
        setCollisionGrid(grid){
            this.tileCollision = new Collision(grid);
        }

        update(TimeDifference){
            this.Entity.forEach(item=>{
            item.update(TimeDifference);
            
            item.position.x += item.velocity.x * TimeDifference; // correlative relation between vel and position in x based on time difference.
            this.tileCollision.XaxisCollision(item);
            
            item.position.y += item.velocity.y * TimeDifference; // correlative relation between vel and position in y  based on time difference.
            this.tileCollision.YaxisCollision(item);
             item.velocity.y += this.gravity * TimeDifference;

            });
		    this.totalTime +=TimeDifference;
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


class Grid {  // Grid class to accesses the x,y coordinates to determing tile type, i.e. path, background.
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
    constructor(tileCollision){
        this.tiles =new tileConverter(tileCollision);
    }
    YaxisCollision(item){ // Check path collision 
    var intersections = this.tiles.coordinatesDistance(
        item.position.x,item.position.x + item.size.x,
        item.position.y,item.position.y + item.size.y);
        
        intersections.forEach(function(tileFound){
        if (tileFound.tile.type!='path'){
        return;
    }
    if (item.velocity.y > 0){ // run the detection to be for hitting the ground path.
        if(item.position.y + item.size.y > tileFound.y1 ){
            item.position.y = tileFound.y1 - item.size.y;
            item.velocity.y = 0;
            item.obstruct(Sides.BOTTOM);
        }
    
    }
    else if (item.velocity.y < 0){ // run the detection to be for hitting the ceiling.  
        if(item.position.y < tileFound.y2 ){
                item.position.y = tileFound.y2;
                item.velocity.y = 0;

                item.obstruct(Sides.TOP);
             }
        }
    });
    }


    XaxisCollision(item){
        var intersections = this.tiles.coordinatesDistance(
            item.position.x,item.position.x + item.size.x,
            item.position.y,item.position.y + item.size.y);
            
            intersections.forEach(function(tileFound){
            if (tileFound.tile.type!='path'){
            return;
        }
        if (item.velocity.x > 0){ //If player passed the path tile, move the player back to the path 
            if(item.position.x +item.size.x > tileFound.x1 ){
                item.position.x = tileFound.x1 - item.size.x;
                item.velocity.x = 0;

                 item.obstruct(Sides.RIGHT);
            }
        }
        else if (item.velocity.x < 0){ //If player passed the path tile, move the player back to the path 
            if(item.position.x < tileFound.x2 ){
                    item.position.x = tileFound.x2;
                    item.velocity.x = 0;

                     item.obstruct(Sides.LEFT);
                 }
            }
        });
    }
    


    /*test(item){
    this.YaxisCollision(item);
    this.XaxisCollision(item);
    }*/
    }
    

class tileConverter { // convert the world positions coordinates into tile coordinates x,y. 
    constructor(grid, tileSize = 16){
        this.grid = grid;
        this.tileSize = tileSize;
        
    }
    tilecoordintes(position){
        return Math.floor(position / this.tileSize); // return the  coordinates
    }
    
    DistanceMatched(positionA,positionB){ // return a tile based on its coordinates.
        var MaxPos = Math.ceil(positionB / this.tileSize) * this.tileSize;
        var Difference = [];
        var position = positionA;
        
        do {
            Difference.push(this.tilecoordintes(position));
            position = position + this.tileSize;
        }
        while(position < MaxPos);
            return Difference;

    }
    coordinatesMet(coordinateX,coordinateY){ /*coordinatesMet method ask the 
                                            matrix for the tile given it is coordinates*/
    var tile = this.grid.get(coordinateX,coordinateY);
    if(tile){
    var y1 = coordinateY * this.tileSize;
    var y2 = y1 + this.tileSize;
    var x1 = coordinateX * this.tileSize;
    var x2 = x1 + this.tileSize;
        return{
            tile,
            x1,
            x2,
            y1,
            y2,
            
        };
    }
}  
coordinatesPos(positionX,positionY){ // return the tile coordinates from the coordinatesMet method.
    return this.coordinatesMet(this.tilecoordintes(positionX),
    this.tilecoordintes(positionY));
}
coordinatesDistance(x1,x2,y1,y2){
    var intersections = [];
    this.DistanceMatched(x1,x2).forEach(coordinateX =>{
        this.DistanceMatched(y1,y2).forEach(coordinateY =>{
            var tileFound = this.coordinatesMet(coordinateX, coordinateY);
                if (tileFound) {
                    intersections.push(tileFound);
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

        if(sheetSpec.tiles) {
        sheetSpec.tiles.forEach(tileSpec => {
            pixels.locatetile(
                tileSpec.name,
                tileSpec.index[0],
                tileSpec.index[1]);
        });
       }

       if(sheetSpec.frames) {
        sheetSpec.frames.forEach(frameSpec => {
            pixels.locate(frameSpec.name,...frameSpec.rect);
	
			});
        }


        if (sheetSpec.animations) {
        	sheetSpec.animations.forEach(animSpec => {
        		const animation = drawAnim(animSpec.frames, animSpec.frameLen);
        		pixels.defineAnim(animSpec.name, animation);
        
        });
       }




        return pixels;
      });
}

function drawAnim(frames, frameLen) {  //drawAnim  instead of drawAnim

    return function convertedFrame(distance) {  //convertedFrame instead of convertedFrame

        const frameIndex = Math.floor(distance / frameLen) % frames.length;
        const frameName =  frames[frameIndex];
          return frameName;  
    };
}



function drawLevel(name) { // draw Level function to read Json files 
    return  loadJSON(`/levels/${name}.json`)
    .then(levelDetails => Promise.all([
        levelDetails,
        loadPixelSheet(levelDetails.DrawingPixel),

        ]))

 
    .then(function([levelDetails,pixels]){
        var level = new Level(); // The ordered levels are instanciated on the level object.

        const mergedTiles = levelDetails.layers.reduce((mergedTiles, layerSpec) => {
                return mergedTiles.concat(layerSpec.tiles);
        },[]);

        const collisionGrid = createCollisionGrid(mergedTiles, levelDetails.patterns);
        level.setCollisionGrid(collisionGrid);

        levelDetails.layers.forEach(layer => {
                const backgroundGrid = createBackgroundGrid(layer.tiles, levelDetails.patterns);
                var bgLayer = createbgLayer(level, backgroundGrid, pixels);
                level.orl.layers.push(bgLayer);// add the layers in order to the ordered layer instance on the level.
        });       
        var pixelLayer = createPixelLayer(level.Entity);
        level.orl.layers.push(pixelLayer); // add the layers in order to the ordered layer instance on the level.
        return level;
    });
}
function createCollisionGrid(tiles, patterns) {
    const grid = new Grid();

    for(const {tile, x, y} of expandTiles(tiles,patterns)) {
        grid.set(x, y, { type: tile.type});
    }
    return grid;
}

function createBackgroundGrid(tiles, patterns) {
    const grid = new Grid();

    for(const {tile, x, y} of expandTiles(tiles,patterns)) {
        grid.set(x, y, { name: tile.name, });
    }
    return grid;
}


function* expandSpan(xStart, xLen, yStart, yLen) {
    const xEnd = xStart +xLen;
    const yEnd = yStart +yLen;
    for (let x = xStart; x < xEnd; ++x) {
        for (let y = yStart; y < yEnd; ++y) {
            yield{x,y};
        }
    }    
}  

function expandRange(range) {
    if (range.length == 4) {
        const [xStart, xLen, yStart, yLen] = range;
         return expandSpan(xStart, xLen, yStart, yLen);
  
    } else if (range.length == 3) {
        const [xStart, xLen, yStart] = range;
         return expandSpan(xStart, xLen, yStart, 1); //if there is only one "1" in the end, you can delete them

    } else if (range.length == 2) {        //if there are two "1" in the end, you can delete them
        const [xStart, yStart] = range;
        return expandSpan(xStart, 1, yStart, 1);
        
    }
}

function* expandRanges(ranges) {
    for (const range of ranges) {
        for(const item of expandRange(range)) {
            yield item;
        }
    } 

}

function expandTiles(tiles, patterns){ 
  const expandedTiles = [];
        function walkTiles(tiles, offsetX, offsetY) {

        
            for(const tile of tiles){ 
                for(const {x,y} of expandRanges(tile.ranges)){
                    const deriveX = x + offsetX;
                    const deriveY = y + offsetY;

                    if(tile.pattern) {
                            const tiles = patterns[tile.pattern].tiles;
                            walkTiles(tiles, deriveX, deriveY);
                        // console.log('Pattern detected', patterns[tile.pattern]);
                        }
                    else {
                            expandedTiles.push({
                                tile,
                                x: deriveX,
                                y: deriveY,
                            });
                            
                        }
                    }    
                }
            }  
            walkTiles(tiles, 0, 0); 

            return expandedTiles;
    }



   const FAST_DRAG = 1/5000;
    const SLOW_DRAG = 1/1000;
    
function drawPlayerPixels (){
    return loadPixelSheet('player')
    .then(createaPlayerFactory);
}

function createaPlayerFactory(playerPixel) {


    var runAnim = drawAnim(['run-1', 'run-2', 'run-3'], 6); //playerPixel.animations.get('run'); COULDNT PUT THIS BECAUSE OF ERROR
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

    function setTurboState(turboOn){
        this.forward.dragFactor = turboOn? FAST_DRAG : SLOW_DRAG;
    }


   function drawPlayer(ctx) {
    playerPixel.build(routeFrame(this),ctx, 0, 0, this.forward.heading <0);
    }

        return function createPlayer() {
    const player = new Entity();
    player.size.set(18,40);
   
    player.addFeature(new Featureforward());
  
    player.addFeature(new featureJump());

    player.turbo = setTurboState;
    player.build = drawPlayer;

    player.turbo(false);
return player;
 }
}



function loadZombie() { //Anush: loads Zombie sprite
return loadPixelSheet('zombie')
    .then(createZombieFactory);
}
function createZombieFactory(playerPixel) { 
   function drawZombie(ctx) {
    playerPixel.build('walk-1', ctx, 0, 0);
   } 

   return function createZombie() {
        const zombie = new Entity();
        zombie.size.set(16, 16);
      

        zombie.addFeature({

            NAME: 'walk',
            speed: -30,
            obstruct(zombie, side) {
                if (side === Sides.LEFT || side===Sides.RIGHT) {
                    this.speed = -this.speed;
                }

            },
            update(zombie) {
                zombie.velocity.x = this.speed;
            }
        })
        zombie.build = drawZombie;

        return zombie;

   };
}




function loadZombie2() { //Anush: loads Zombie2 sprite
return loadPixelSheet('zombie2')
    .then(createZombieFactory);
}
function createZombie2Factory(playerPixel) { 
   function drawZombie2(ctx) {
    playerPixel.build('walk-1', ctx, 0, 0);
   } 

   return function createZombie2() {
        const zombie2 = new Entity();
        zombie2.size.set(16, 16);
      

        zombie2.addFeature({

            NAME: 'walk',
            speed: -30,
            obstruct(zombie2, side) {
                if (side === Sides.LEFT || side===Sides.RIGHT) {
                    this.speed = -this.speed;
                }

            },
            update(zombie2) {
                zombie2.velocity.x = this.speed;
            }
        })
        zombie2.build = drawZombie;

        return zombie2;

   };
}












function createbgLayer (level, tiles, pixels){   // create the background layer first
    var resolver = new tileConverter(tiles);

    var supplier = document.createElement('canvas');
    var ctx = supplier.getContext('2d');
    supplier.width = 256+16;
    supplier.height = 240;
 


function redraw(startIndex, endIndex) {

  ctx.clearRect(0,0, supplier.width, supplier.height);  
  for (let x = startIndex; x <=endIndex; ++x) {
        const col = tiles.cell[x];
        if (col){
            col.forEach((tile,y) => {
            	if (pixels.animations.has(tile.name)) {
            		pixels.drawAnim(tile.name, ctx, x - startIndex, y, level.totalTime);

            	} else {

                pixels.buildtile(tile.name, ctx, x- startIndex, y);
            			}
            });
        }
    }
}
/* 
}*/

    return function drawBgLayer(ctx, camera) {

        var drawWidth = resolver.tilecoordintes(camera.size.x);
        var drawFrom = resolver.tilecoordintes(camera.position.x);
        var drawTo = drawFrom + drawWidth;
        redraw(drawFrom, drawTo);

        ctx.drawImage(supplier,-camera.position.x %16, -camera.position.y);
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
    item.build(pixelsSupplierCtx);
    ctx.drawImage(pixelsSupplier, 
                    item.position.x - camera.position.x,
                    item.position.y - camera.position.y);
});
};
}

function CollisionDetectionLayer(level){
    var convertedtiles = []; 

    var tileConverter = level.tileCollision.tiles;
    var tileSize = tileConverter.tileSize;

    var coordinatesMetinitial = tileConverter.coordinatesMet;
    tileConverter.coordinatesMet = function VertualcoordinatesMet(x,y){
    convertedtiles.push({x,y});
    return coordinatesMetinitial.call(tileConverter,x,y)
    }   

    return function detectCollision(ctx, camera){
        ctx.strokeStyle = 'blue';
        convertedtiles.forEach(function({x, y}){
            //console.log('Working');
         ctx.beginPath();
         ctx.rect(x * tileSize - camera.position.x,
            y * tileSize, - camera.position.y, 
             tileSize, tileSize);
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
        convertedtiles.length = 0;
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

Promise.all([

drawPlayerPixels(),
loadZombie(),
loadZombie2(),
drawLevel('level1'),



]) // Parallalizing the drawing time for the level pixels and the background



.then(function([createPlayer, createZombie, createZombie2,level]){
 
    const camera = new Camera();
    window.camera = camera;
    const player = createPlayer();
 	player.position.set(32,32);
   level.Entity.add(player);



    const zombie = createZombie(); // Anush: loading createZombie in the main function 
    zombie.position.x = 800;
    level.Entity.add(zombie);



    const zombie2 = createZombie2(); // Anush: loading createZombie in the main function 
    zombie2.position.x = 830;
    level.Entity.add(zombie2);


/*
player.addFeature({

    NAME: 'hacktrait',
    obstruct() {

    },
    update(player, TimeDifference) {

        if(player.velocity.x <0) {

            const spawn = createPlayer();
            spawn.position.x = player.position.x;
            spawn.position.y = player.position.y;
            spawn.velocity.y = player.velocity.y - 200;
            level.Entity.add(spawn);
            this.spawnTimeOut = 0;


        }
        this.spawnTimeOut += TimeDifference;
    }



})

*/


 



    var gravity = 1000;
 
   


/*level.orl.layers.push(
    CollisionDetectionLayer(level),
    createCameraLayer(camera));  */

   


    
    var kPressed = new KeyboardKeys();
    kPressed.Matching("Space",function(keyMode){
        if (keyMode) {
            player.jump.begin();
        }
        else { 
            player.jump.cancel();
        }
    });
    kPressed.Matching("ArrowUp", function(keyMode){
        player.turbo(keyMode);
    });

    kPressed.Matching("ArrowRight",function(keyMode){
        player.forward.orientation+= keyMode ? 1 : -1;
    });
    kPressed.Matching("ArrowLeft",function(keyMode){
        player.forward.orientation += -keyMode ? -1 :1;
    });
            

    kPressed.respondTo(window);
    






    var tSet = new timeSet(1/60);
    tSet.update = function update(TimeDifference){
    level.update(TimeDifference);
 	if (player.position.x > 100) {

 		camera.position.x = player.position.x - 100;
 	}

    level.orl.build(ctx, camera);
    player.velocity.y += gravity * TimeDifference;
    timeSet.buildUptime -= TimeDifference;    
}
tSet.begin();
});


