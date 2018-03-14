
class Pixel {
    constructor(img, width = 18, height = 16) {
        this.img = img;
        this.width = width;
        this.height = height;
        this.bricks = new Map(); // create a map to save the subset image(supplier).
    }

    locate(name, x, y,width, height) { // creating the subset img by allocating the position of it.
        var supplier = document.createElement('canvas');
        supplier.height = height;
        supplier.width = width;
        supplier
            .getContext('2d')
            .drawImage(
                this.img,
                x,
                y,
                width,
                height,
                0,
                0,
                width,
                height);
        this.bricks.set(name, supplier); // add the subset image(supplier) to the map.
    }
   
    build(name, ctx, x, y) {
        var supplier = this.bricks.get(name);
        ctx.drawImage(supplier, x, y);
    }
    locateBrick(name,x,y){
        this.locate(name,x * this.width, y * this.height,this.width,this.height);
        }
    buildBrick(name, ctx, x, y) {
        this.build(name, ctx, x * this.width, y * this.height);
    }
}

class OrderedLayers {   // Draw all the layers in order.    
    constructor(){
    this.layers = [];   
                }
    build(ctx){
        this.layers.forEach(function(layer){
            layer(ctx);
        });
    }
};
    
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
    update(TimeDifference){
        this.features.forEach(feature => {
        feature.update(this, TimeDifference);
    }); 
}
}
class Feature {
    constructor(name) { //name may be run or jump
        this.NAME = name;
    }
    update(){
        console.warn('Failed to update')

    }


}

class timeSet {
    constructor(TimeDifference = 1/60){
            let buildUptime = 0; 
            let LastTime = 0;
            
            this.updateAttorny = time=>{
            buildUptime += (time - LastTime)/1000; // Use seconds instead of DSec.
                
                
                while (buildUptime > TimeDifference){
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
        start(){
            this.enqueue();
            }
        }
var KeyDown = 1;
var KeyUp = 0;
class KeyboardKeys {
    constructor() {
        // Holds the current state of a given key
        this.keyModes = new Map();

        // Holds the callback functions for a key code
        this.keyBack = new Map();
    }

    Mapping(code, confirm) {
        this.keyBack.set(code, confirm);
    }

    controlEvent(event) {
        const {code} = event;

        if (!this.keyBack.has(code)) {
            // Did not have key mapped.
            return;
        }

        event.preventDefault();

        if (event.type == 'keydown') 
            var keyMode = KeyDown;
        else
             var keyMode = KeyUp

        if (this.keyModes.get(code) === keyMode) {
            return;
        }

        this.keyModes.set(code, keyMode);
        //console.log(this.keyModes);

        this.keyBack.get(code)(keyMode);
    }

    respondTo(window) {
        

        var StateArr = ['keydown', 'keyup'];
        StateArr.forEach(eventName => {
            window.addEventListener(eventName, event => {
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
            
            item.position.x += item.velocity.x * TimeDifference; 
            this.brickCollision.collideX(item);
            
            item.position.y += item.velocity.y * TimeDifference;
            this.brickCollision.collideY(item);
            });

        }
    }
class Featurevel extends Feature {
    constructor(){
        super('velocity');
    }
    update(Entity, TimeDifference){
       
            }

    }
class Featurejump extends Feature {
    constructor(){
        super('jump');
        this.period = 0.7;
        this.timePeriod = 0;
        this.vel = 200;
    }
    begin(){
        this.timePeriod = this.period;
    }
    cancel(){
        this.timePeriod = 0;
    }
    update(Entity, TimeDifference){
    if (this.timePeriod > 0){
        Entity.velocity.y = -this.vel;
        this.timePeriod -=TimeDifference;

        } 
    
    }

}

class Featureforward extends Feature {
    constructor(){
        super('forward');
        this.orientation = 0;
        this.spd = 5000;
    
    }
    update(Entity, TimeDifference){
    Entity.velocity.x = this.spd * this.orientation * TimeDifference;

        } 
    
    }


class Grid {
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
            this.cell.forEach(function(Column, x){
                Column.forEach(function(intersectV,y){
                confirm(intersectV,x,y);
            });
        });

    }
}

class Collision {
    constructor(bricks){
        this.bricks =new BrickConverter(bricks);
    }
    collideX(item){
        var x;
        if (item.velocity.x > 0) {
            x = item.position.x + item.size.x;
        }
        else if (item.velocity.x < 0){
            x = item.position.x;
        
        }
        else {
            return;
        }
        var intersections = this.bricks.coordinatesDistance(
            x,x,
            item.position.y,item.position.y + item.size.y);
            
            intersections.forEach(function(brickFound){
            if (brickFound.brick.name!== 'path'){
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
    collideY(item){
        var y;
        if (item.velocity.y > 0) {
            y = item.position.y + item.size.y;
        }
        else if (item.velocity.y < 0){
            y = item.position.y;
        }
        else {
            return;
        }
    var intersections = this.bricks.coordinatesDistance(
        item.position.x,item.position.x + item.size.x,
        y,y);
        
        intersections.forEach(function(brickFound){
        if (brickFound.brick.name!== 'path'){
        return;
    }
    if (item.velocity.y > 0){ //If Player passed the path brick, move the player back to the path 
        if(item.position.y + item.size.y > brickFound.y1 ){
            item.position.y = brickFound.y1 - item.size.y;
            item.velocity.y = 0;
        }
    }
     if (item.velocity.y < 0){ //If Player passed the path brick, move the player back to the path 
        if(item.position.y < brickFound.y2 ){
                item.position.y = brickFound.y2;
                item.velocity.y = 0;
             }
        }
    });
}



    test(item){
    this.collideY(item);
    this.collideX(item);
    }
    }
    

class BrickConverter { // convert the world position coordinates into brick coordinates. 
    constructor(grid, brickSize = 16){
        this.grid = grid;
        this.brickSize = brickSize;
        
    }
    contextPos(position){
        return Math.floor(position / this.brickSize);
    }
    
    DistanceDifference(positionA,positionB){
        var MaxPos = Math.ceil(positionB / this.brickSize) * this.brickSize;
        var Difference = [];
        var position = positionA;
        
        do {
            Difference.push(this.contextPos(position));
            position = position + this.brickSize;
        }
        while(position < MaxPos);
            return Difference;

    }
    coordinatesMet(coordinateX,coordinateY){
    var brick = this.grid.get(coordinateX,coordinateY);
    if(brick){
    var y1 = coordinateY * this.brickSize;
    var y2 = y1 + this.brickSize;
    var x1 = coordinateX * this.brickSize;
    var x2 = x1 + this.brickSize;
        return{
            brick,
            y1,
            y2,
            x1,
            x2,
        }
    }
}  
coordinatesPos(positionX,positionY){
    return this.coordinatesMet(this.contextPos(positionX),
    this.contextPos(positionY));
}
coordinatesDistance(x1,x2,y1,y2){
    var intersections = [];
    this.DistanceDifference(x1,x2).forEach(coordinateX =>{
        this.DistanceDifference(y1,y2).forEach(coordinateY =>{
            var brickFound = this.coordinatesMet(coordinateX, coordinateY);
                if (brickFound) {
                    intersections.push(brickFound);
                }
            });
        });
        return intersections;
    }
}

window.BrickConverter = BrickConverter;
function uploadImage(url) { // Function to load images from the the img folder.
    return new Promise(function (resolve){ // return Promise
        var img = new Image(); // create image instance 
        img.addEventListener('load', function(){ //attach addEvent listener on the image
            resolve(img);
        });
        img.src = url;
    });
}

function loadJSON(url) {
    return fetch(url)
    .then(drw => drw.json());
    }


function buildBricks(level,Levelbck){

    function applyRange(background, xStart, xLen, yStart, yLen) {
        const xEnd = xStart +xLen;
          const yEnd = yStart +yLen;
        for (let x = xStart; x < xEnd; ++x) {
            for (let y = yStart; y < yEnd; ++y) {
               level.bricks.set(x,y, {
                name:background.brick,
               });
            }

        }
}

 Levelbck.forEach(function(background){
    background.dimensions.forEach(function(range) {
        if (range.length ==4) {
            const [xStart, xLen, yStart, yLen] = range;
            applyRange(background, xStart, xLen, yStart, yLen);
        }
        else if (range.length == 3) {
            const [xStart, xLen, yStart] = range;
            applyRange(background, xStart, xLen, yStart, 1);
        }
         else if (range.length == 2) {
            const [xStart, yStart] = range;
            applyRange(background, xStart, 1, yStart, 1);
        }
            
            });
        });
} 

function loadPixelSheet(name) {
return loadJSON('/pixels/$(name).json')
    .then(sheetSpec => Promise.all([
            sheetSpec, 
            drawImage(sheetSpec, imageURL),
        ]))
    .then(([sheetSpec, img]) => {
        var pixels = new  PixelSheet(
                            img, 
                            sheetSpec,tileW, 
                            sheetSpec.tileH);
        sheetSpec.bricks.forEach(brickSpec => {
            pixels.locateBrick(
                brickSpec.name,
                brickSpec.index[0],
                brickSpec.index[1]);
        });
       
        return pixels;
      });
    }

function drawLevel(name) { // Function to read the Json file in the levels folder.
    return Promise.all([
    loadJSON(`/levels/${name}.json`),
    loadPixelSheet('overworld'),
    ])
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
function drawBackgroundPixels (){
    return uploadImage('/img/tile.png') // Add the image from the img file as URL
    .then(function(img){
        var pixels = new Pixel(img);
        pixels.locateBrick('path', 0, 15); // matching pixels to the uploaded img to find the path.
        pixels.locateBrick('bgr', 20, 2); // matching pixels to the uploaded img to find the background.
        return pixels;
    });

}
function drawPlayerPixels (){
    return uploadImage('/img/character.png') // Add the image from the img file as URL
    .then(function(img){
        var pixels = new Pixel(img);
        pixels.locate('idle',59,11,25,58); // matching pixels to the uploaded img to find the path.
        return pixels;
    });

}


function createbgLayer (level,pixels){   // create the background layer first
    
    var supplier = document.createElement('canvas');
    var ctx = supplier.getContext('2d');
    supplier.width = 700;
    supplier.height = 350;
    level.bricks.forEach(function(brick,x,y){
    pixels.buildBrick(brick.name, ctx, x, y);
        });
    

    return function drawBackgroundLayer(ctx) {
        ctx.drawImage(supplier,0,0);
    };
}
function createPixelLayer(Entity){
return function drawPlayerLayer(ctx){
    Entity.forEach(function(item){
    item.draw(ctx);
});
};
}

function createCollisionLayer(level){
    var convertedBricks = []; 
    var BrickConverter = level.brickCollision.bricks;
    var brickSize = BrickConverter.brickSize;
    var coordinatesMetinitial = BrickConverter.coordinatesMet;
    BrickConverter.coordinatesMet = function VertualcoordinatesMet(x,y){
    convertedBricks.push({x,y});
    //console.log(x,y);
    return coordinatesMetinitial.call(BrickConverter,x,y)
    }   
    
    return function drawCollision(ctx){
        ctx.strokeStyle = 'black';
        convertedBricks.forEach(function({x, y}){
            //console.log('Working');
         ctx.beginPath();
         ctx.rect(x * brickSize,y * brickSize, brickSize, brickSize);
         ctx.stroke();
        });
        ctx.strokeStyle = 'red';
        level.Entity.forEach(function(item){
        ctx.beginPath();
        ctx.rect(item.position.x,item.position.y, item.size.x, item.size.y);
        ctx.stroke();
        });
        convertedBricks.length = 0;
        }


    }



 


var canvas = document.getElementById('view');// Access the main canvas for painting.
var ctx = canvas.getContext('2d');// Access the context in order to use the API.
Promise.all([drawPlayerPixels(),drawLevel('level1'),]) // Parallalizing the drawing time for the level pixels and the background
.then(function([playerPixel,level]){
    var gravity = 1500;
    var Player = new Entity();
    Player.position.set(64,32);
    level.Entity.add(Player);
    createCollisionLayer(level);
    Player.size.set(16,56);
    Player.addFeature(new Featurejump());
    Player.addFeature(new Featureforward());
    


    
    var kPressed = new KeyboardKeys();
    kPressed.Mapping("Space",keyMode => {
        if (keyMode) {
            Player.jump.begin();
        }
        else { 
            Player.jump.cancel();
        }
    });
    kPressed.Mapping("ArrowRight",keyMode => {
        Player.forward.orientation = keyMode;
    });
    kPressed.Mapping("ArrowLeft",keyMode => {
        Player.forward.orientation = -keyMode;
    });
            

    kPressed.respondTo(window);
    
    
    Player.draw = function drawPlayer(ctx) {
    playerPixel.build('idle',ctx, this.position.x, this.position.y);
    }



    var tSet = new timeSet(1/60);
tSet.update = function update(TimeDifference){
    level.update(TimeDifference);
    level.orl.build(ctx);
    Player.velocity.y += gravity * TimeDifference;
    timeSet.buildUptime -= TimeDifference;    
}
tSet.start();
});


