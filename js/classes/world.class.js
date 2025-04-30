class World {
    level = level1;
    character = new Character();
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    energyStatusbar = new Statusbar('energy', 10, 5);
    coinStatusbar = new Statusbar('coin', 10, 45);
    bottleStatusbar = new Statusbar('bottle', 10, 85);
    throwableObjects = [];
    collectableObjects = [];

    constructor(canvas, keyboard){
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.draw();
        this.run();
        this.setCollectableObjects();
    }

    setCollectableObjects(){
       let distanceX = 0;
        for (let i = 0; i < 3; i++) {
        distanceX += 800 * i;  
        
        this.collectableObjects.push(
            new CollectableObject('coin', distanceX + 140, 150),
            new CollectableObject('coin', distanceX + 200, 100),
            new CollectableObject('coin', distanceX + 260, 100),
            new CollectableObject('coin', distanceX + 320, 150),
            new CollectableObject('bottle', distanceX + 260, 200),
            new CollectableObject('bottleGround', distanceX + 240 , 450),
           )
        };
    }
    
    setWorld(){
        this.character.world = this;
    }

    run(){
        setInterval(() => {
            this.checkCollisions();
            this.checkIsThrowing();
            this.checkCharacterDistance();
        }, 100);
    }

    // changeLevel(newLevel) {
    //     this.level = newLevel; // Hier wird das Level gewechselt
    //     this.setCollectableObjects(); // Collectables neu setzen, falls nötig
    //     this.character = new Character(); // Falls du den Charakter für das neue Level zurücksetzen möchtest
    // }

    // Weitere Methoden (checkCollisions, checkIsThrowing, etc.) bleiben gleich...


    checkCollisions(){
        this.checkCollisionsEnemies();
        this.checkCollisionsCollectables();
            
    }

    checkCollisionsEnemies(){
        this.level.enemies.forEach(enemy => {
            if(this.character.isColliding(enemy)){
                this.character.hit(enemy);
                this.changeStatusbar(this.energyStatusbar, -20)
                // this.energyStatusbar.setPercentage(this.character.energy);
            }
        });
    }

    checkCollisionsCollectables() {
        this.collectableObjects.forEach((item, index) => {
            if (this.character.isColliding(item)) {
                if (item.imageType === 'coin') {
                    this.changeStatusbar(this.coinStatusbar, 1);
                } else if (item.imageType === 'bottle' || item.imageType === 'bottleGround') {
                    this.changeStatusbar(this.bottleStatusbar, 1);
                }
    
                // Collectable entfernen
                this.collectableObjects.splice(index, 1);
            }
        });
    }

    changeStatusbar(statusbar, direction) {
        if (statusbar.type === 'energy') {
            statusbar.setPercentage(Math.max(0, statusbar.percentage + direction)); // z. B. -20 bei Schaden
        } else {
            let current = statusbar.type === 'coin' ? this.character.coins : this.character.bottles;
            current = Math.max(0, Math.min(current + direction, 5)); // Begrenzung auf 0–5
            //Testen ob das Sammeln von Coins registriert wurde - funktioniert!
            console.log(`[DEBUG] ${statusbar.type} vorher:`, statusbar.type === 'coin' ? this.character.coins : this.character.bottles);
            console.log(`[DEBUG] Änderung: ${direction}, neuer Wert: ${current}`);

            if (statusbar.type === 'coin') {
                this.character.coins = current;
            } else {
                this.character.bottles = current;
            }
            statusbar.setPercentage(current);
        }
    }

    checkIsThrowing(){
        if (this.keyboard.THROW && this.character.bottles > 0) {
            let bottle = new ThrowableObject(this.character.x, this.character.y);
            this.throwableObjects.push(bottle);
            this.changeStatusbar(this.bottleStatusbar, -1);
        }
    }

    checkCharacterDistance(){
        const treshold = [0, 800, 1600, 2500];
        treshold.forEach((treshold, index) =>{ //if-Abfrage: wenn noch nicht genereriert wurde
            if(this.character.x > treshold && !this[`collectableObjectsGenerated${index}`]){
                this.generateNewCollectable();
                this[`collectableObjectsGenerated${index}`] = true; 
            };
            
        });
    }

    generateNewCollectable(){
        this.collectableObjects.push(
            // new CollectableObject('coin', this.character.x + 120, this.character.y + 150),
            // new CollectableObject('coin', this.character.x + 180, this.character.y + 100),
            // new CollectableObject('coin', this.character.x + 240, this.character.y + 100),
            // new CollectableObject('coin', this.character.x + 300, this.character.y + 150),
            // new CollectableObject('bottle', this.character.x + 240, this.character.y + 200),
            new CollectableObject('bottleGround', this.character.x + 240 , this.character.y +  450),

        );
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