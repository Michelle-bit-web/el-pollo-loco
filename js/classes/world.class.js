class World {
    level = level1;
    character = new Character();
    canvas;
    canvasState = "game"; // "startscreen" oder "game"
    ctx;
    keyboard;
    camera_x = 0;
    isFading = false
    energyStatusbar = new Statusbar('energy', 10, 5);
    coinStatusbar = new Statusbar('coin', 10, 45);
    bottleStatusbar = new Statusbar('bottle', 10, 85);
    throwableObjects = [];
    

    constructor(canvas, keyboard){
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.draw();
        this.run();
        // this.loadGameOverImage(); //Dazu gehören noch js26 & js211
    }
    
    // loadGameOverImage() {
    //     this.gameOverImage = new Image();
    //     this.gameOverImage.src = './assets/img/You won, you lost/Game over A.png';
    // }

    setWorld(){
        this.character.world = this;
        this.level.endboss.world = this; 
    }

    run(){
        setInterval(() => {
            this.checkCollisions();
            this.checkIsThrowing();
            this.checkCharacterDistance();
        }, 100);
    }

    checkCollisions(){
        this.checkCollisionsEnemies();
        this.checkCollisionsCollectables();
        this.checkCollisionsThrowableObjects();
       
    }

    checkCollisionsEnemies(){
        this.level.enemies.forEach((enemy, enemyIndex) => {
            if(this.character.isAboveGround() && this.character.isColliding(enemy)){
                console.log('Enemy hit on jumping!');
                this.level.enemies[enemyIndex].markAsDead();
            }
            if(this.character.isColliding(enemy) && !enemy.isDead){
                this.character.hit(enemy);
                this.changeStatusbar(this.energyStatusbar, -2)
            }
        });
        
        this.throwableObjects.forEach((bottle, bottleIndex) => {
            if (!bottle.isSplashing && bottle.isColliding(this.level.endboss)) {
                bottle.splash();
                this.level.endboss.hit();
                this.level.endboss.takeDamage(10);
            }
        });
    }

    checkCollisionsThrowableObjects(){
       this.level.enemies.forEach((enemy, enemyIndex) => {
            this.throwableObjects.forEach((bottle, bottleIndex) => {
                if (bottle.isColliding(enemy, enemyIndex) & !bottle.isSplashing) {
                    this.level.enemies[enemyIndex].markAsDead();
                    bottle.splash();
                }
                setTimeout(() => {
                    if (enemy.isDead) {
                        this.level.enemies.splice(enemyIndex, 1); // Entferne den Gegner
                    }
                }, 100); // Warte 1 Sekunde, bevor der Gegner entfernt wird
            });
        });  
        this.throwableObjects = this.throwableObjects.filter(obj => !obj.remove);
    }

    checkCollisionsCollectables() {
        this.level.collectableObjects.forEach((item, index) => {
            if (this.character.isColliding(item)) {
                if (item.imageType === 'coin') {
                    this.changeStatusbar(this.coinStatusbar, 1);
                } else if (item.imageType === 'bottle' || item.imageType === 'bottleGround') {
                    this.changeStatusbar(this.bottleStatusbar, 1);
                }
    
                // Collectable entfernen
                this.level.collectableObjects.splice(index, 1);
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
        const treshold = [0, 800, 1600, 2800];
        treshold.forEach((treshold, index) =>{ //if-Abfrage: wenn noch nicht genereriert wurde
            if(this.character.x > treshold && !this[`collectableObjectsGenerated${index}`]){
                // this.generateNewCollectable();
                this[`collectableObjectsGenerated${index}`] = true; 
            };
            if(this.character.x >= this.level.levelEndX){
                // this.generateNewCollectable();
                console.log('Level beendet, Übergang zu neuem Level...');
                this.fadeToBlack(() => {
                    this.changeLevel(level2); // Lade das neue Level
                });
            };

        if (this.character.x > 1600 && !this.endbossAppeared) {
            this.level.endboss.x = this.level.endArrowPosition + 300; // Setze den Endboss etwas weiter hinten
            this.endbossAppeared = true;
            this.level.endboss.endbossAppeared = true; // Flag für Animation
        }
        });
    }

    fadeToBlack(callback) {
        this.isFading = true; // Setze den Fade-Zustand auf true
        let alpha = 0; // Transparenz-Wert (0 = vollständig transparent, 1 = vollständig schwarz)
        const fadeInterval = setInterval(() => {
            this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`; // Schwarzer Overlay
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            alpha += 0.02; // Transparenz erhöhen
            if (alpha >= 1) { // Wenn das Canvas vollständig schwarz ist
                clearInterval(fadeInterval);
                callback(); // Rufe die angegebene Funktion auf (z. B. Levelwechsel)
                this.isFading = false; // Setze den Fade-Zustand zurück
            }
        }, 50);
       // Aktualisierung alle 50ms (20 FPS)
    }

    changeLevel(newLevel){
        this.level = newLevel; // Hier wird das Level gewechselt
        this.character.x = 0;
        this.camera_x = 0;
        console.log('Level gewechselt', this.level);
        this.fadeIn();

    }

    fadeIn() {
        this.isFading = true;
        let alpha = 1; // Startwert für Transparenz (1 = schwarz)
        this.fadeAlpha = alpha; // Setze den aktuellen Alpha-Wert für das Zeichnen
    
        const fadeInterval = setInterval(() => {
            this.fadeAlpha = alpha; // Aktualisiere den Alpha-Wert
            alpha -= 0.02; // Transparenz verringern
            if (alpha <= 0) { // Wenn das Canvas vollständig sichtbar ist
                clearInterval(fadeInterval);
                this.isFading = false; // Setze den Fade-Zustand zurück
                this.fadeAlpha = undefined; // Entferne den Overlay-Wert
            }
        }, 50);
    }

    draw(){
        if(this.isFading){
            return
        } else if(this.canvasState === 'startscreen'){
            //Brauche Bild für den Startscreen
            //Brauche Button als Eventlistener, der den canvasState zu game ändert
            //Vielleicht nochmal Methodenaufruf für draw dann?
        }
        
        else if(this.canvasState === 'game'){
            // if (this.character.isDead()) {
            //     this.addToMap(this.gameOverImage);
            //     // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            //     // this.ctx.drawImage(this.gameOverImage, this.canvas.width / 2 - 200, this.canvas.height / 2 - 100, 400, 200);
            //     return; // kein weiteres Zeichnen nötig
            // }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);

        this.ctx.translate(-this.camera_x, 0);
        // ---- Space for fixed objects ----
        this.addToMap(this.energyStatusbar); //To move statusbar relative to camera
        this.addToMap(this.coinStatusbar);
        this.addToMap(this.bottleStatusbar);
        this.ctx.translate(this.camera_x, 0);
        
        this.addToMap(this.character);
        
        this.addToMap(this.level.endboss);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.collectableObjects);

        this.ctx.translate(-this.camera_x, 0);

        requestAnimationFrame( () => this.draw());
        };
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

}