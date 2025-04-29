class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    energyStatusbar = new Statusbar('energy', 10, 5);
    coinStatusbar = new Statusbar('coin', 10, 45);
    bottleStatusbar = new Statusbar('bottle', 10, 85);
    throwableObjects = [];
    collectableObjects = [
        new CollectableObject('coin', 120, 150),
        new CollectableObject('coin', 180, 100),
        new CollectableObject('coin', 240, 100),
        new CollectableObject('coin', 300, 150),
        new CollectableObject('bottle', 240, 180),
    ];

    constructor(canvas, keyboard){
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.draw();
        this.run();
    }
    
    setWorld(){
        this.character.world = this;
    }

    run(){
        setInterval(() => {
            this.checkCollisions();
            this.checkIsThrowing();
        }, 100);
    }

    checkCollisions(){
            this.level.enemies.forEach(enemy => {
                if(this.character.isColliding(enemy)){
                    this.character.hit();
                    this.energyStatusbar.setPercentage(this.character.energy);
                }
            });
    }

    checkIsThrowing(){
        if(this.keyboard.THROW){
            let bottle = new ThrowableObject(this.character.x, this.character.y);
            this.throwableObjects.push(bottle);
        }
    }

    draw(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);

        this.ctx.translate(-this.camera_x, 0);
        // ---- Space for fixed objects ----
        this.addToMap(this.energyStatusbar); //To move statusbar relative to camera
        this.addToMap(this.coinStatusbar);
        this.addToMap(this.bottleStatusbar);
        this.ctx.translate(this.camera_x, 0);
        
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.collectableObjects)

        this.ctx.translate(-this.camera_x, 0);

        requestAnimationFrame( () => this.draw());
    }
    addObjectsToMap(objects){
        objects.forEach(obj => this.addToMap(obj))
    }

    addToMap(mo) {
        if(mo.otherDirection){
           this.flipImage(mo);
        }
        mo.draw(this.ctx);
        // mo.drawFrame(this.ctx);
        mo.drawOffsetFrame(this.ctx);
        if(mo.otherDirection){
           this.flipImageBack(mo);
        }
    }

    flipImage(mo){
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1,1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo){
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    


// if(character.x + character.width > chicken.x 
//   && character.y + character.height > chicken.y 
//   && character.x < chicken.x
//   && charater.y y chicken.y + chicken.height){
//     this.isColliding();
//   }

 

}