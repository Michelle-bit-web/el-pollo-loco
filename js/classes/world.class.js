class World {
    level = level1;
    character = new Character(this);
    canvas;
    canvasState = "game"; // "startscreen" oder "game"
    ctx;
    keyboard;
    camera_x = 0;
    controlEnabled = true;
    fightScene = false;
    isFading = false
    energyStatusbar = new Statusbar("energy", 10, 5);
    coinStatusbar = new Statusbar("coin", 10, 45);
    bottleStatusbar = new Statusbar("bottle", 10, 85);
    throwableObjects = [];
    gameSounds = {
        backgroundMusicGeneral: new AudioManager("assets/audio/background/Slower_Version-2023-05-15_-_Chicken_Chase_-_www.FesliyanStudios.com.mp3", 0.5, true, 1),

    //     chickenSound:new AudioManager("/assets/audio/background/mixkit-chickens-and-pigeons-1769.wav", 0.5, true, 1),
    //     jumpSound: null,
    //     coinSound: null,
        endbossIntroSound: new AudioManager("assets/audio/endboss-intro/2019-05-09_-_Escape_Chase_-_David_Fesliyan.mp3", 0.5, false, 1),
    //     endbossAttackSound: new AudioManager("/assets/audio/endboss/mixkit-cock-cry-1761.wav", 0.5, false, 1),
    //     throwingSound: null,
    //     splashSound: new AudioManager("/assets/audio/hurt/mixkit-player-hurt-2040.wav", 0.5, false, 1),
    //     hurtSound: null,
    //     walkingSound: new AudioManager("/assets/audio/walk/mixkit-footsteps-in-woods-loop-533.wav", 0.5, false, 1),
    //     gameOverSound: new AudioManager("/assets/audio/game-over/mixkit-player-losing-or-failing-2042.wav", 0.5, false, 10)
    }

    constructor(canvas, keyboard){
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.draw();
        this.run();

        this.gameSounds.backgroundMusicGeneral.play();
        // this.gameSounds.chickenSound.play();

        // this.loadGameOverImage(); //Dazu gehören noch js26 & js211
    }
    
    // loadGameOverImage() {
    //     this.gameOverImage = new Image();
    //     this.gameOverImage.src = "./assets/img/You won, you lost/Game over A.png";
    // }

    setWorld(){
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
                console.log("Enemy hit on jumping!");
                this.level.enemies[enemyIndex].markAsDead();
            }
            if(this.character.isColliding(enemy) && !enemy.isDead){
                this.character.hit(enemy);
                this.changeStatusbar(this.energyStatusbar, -2)
            }
        });
        
        this.throwableObjects.forEach((bottle, bottleIndex) => {
            if (!bottle.isSplashing && bottle.isColliding(this.level.endboss)) {
                console.log("[DEBUG] Endboss von Flasche getroffen!");
                bottle.splash();
                this.level.endboss.hit();
                console.log("[DEBUG] Vor takeDamage:", this.level.endboss.energy);
                this.level.endboss.takeDamage(20);
                console.log("[DEBUG] Nach takeDamage:", this.level.endboss.energy);
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
                if (item.imageType === "coin") {
                    this.changeStatusbar(this.coinStatusbar, 1);
                } else if (item.imageType === "bottle" || item.imageType === "bottleGround") {
                    this.changeStatusbar(this.bottleStatusbar, 1);
                }
    
                // Collectable entfernen
                this.level.collectableObjects.splice(index, 1);
            }
        });
    }

    changeStatusbar(statusbar, direction) {
        if (statusbar.type === "energy") {
            statusbar.setPercentage(Math.max(0, statusbar.percentage + direction)); // z. B. -20 bei Schaden
        } else {
            let current = statusbar.type === "coin" ? this.character.coins : this.character.bottles;
            current = Math.max(0, Math.min(current + direction, 5)); // Begrenzung auf 0–5
            //Testen ob das Sammeln von Coins registriert wurde - funktioniert!
            console.log(`[DEBUG] ${statusbar.type} vorher:`, statusbar.type === "coin" ? this.character.coins : this.character.bottles);
            console.log(`[DEBUG] Änderung: ${direction}, neuer Wert: ${current}`);

            if (statusbar.type === "coin") {
                this.character.coins = current;
            } else {
                this.character.bottles = current;
            }
            statusbar.setPercentage(current);
        }
    }

    checkIsThrowing(){
        if(this.keyboard.THROW)  this.character.lastTimeMoved = new Date().getTime();
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

            //---Hier für das Fading nach Spielende---
            // Optimierung: Noch Timeout anstatt nur Position & Einblenden des Endscreens für Punkte, Restart usw

            // if(this.character.x >= this.level.levelEndX){
            //     // this.generateNewCollectable();
            //     console.log("Level beendet, Übergang zu neuem Level...");
            //     this.fadeToBlack(() => {
            //         this.changeLevel(level2); // Lade das neue Level
            //     });
            // };

        if (this.character.x > (this.level.endboss.x - 800) && ! this.level.endboss.firstContactCharacter) {
            // this.level.endboss.x = this.level.endArrowPosition + 300; // Setze den Endboss etwas weiter hinten
            // Steuerung deaktivieren
            this.controlEnabled = false;
            this.gameSounds.backgroundMusicGeneral.stop();
            this.gameSounds.endbossIntroSound.play();
            // Kamera auf Endboss fokussieren
            const endbossX = this.level.endboss.x;
            this.focusCameraOnEndboss(endbossX);
            this.level.endboss.firstContactCharacter = true;
        }
        if(this.level.endboss.energy <= 0 && (this.levelEndX - 800) > this.character.x && this.character.x >= this.level.endArrowPosition + 250){
            
              this.character.automaticMovement(this.character);
            
        };
    });
    }

    focusCameraOnEndboss(endbossX) {
        this.fightScene = true;
        console.log("character-x", this.character.x, "boolean fightScene", this.fightScene, "camera position",this.camera_x)
        this.cameraIntervalEndboss = setInterval(()=>{
            if(this.camera_x < -endbossX + 400){
                this.camera_x += 10;
            } 
        }, 1000/60);
        if (this.camera_x >= (-endbossX + 400)){
            clearInterval(this.cameraIntervalEndboss);
            this.camera_x = -endbossX + 400;
        };
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
        console.log("Level gewechselt", this.level);
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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if(this.controlEnabled){
        this.ctx.translate(this.camera_x, 0);
        }

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);

        if(this.controlEnabled){
        this.ctx.translate(-this.camera_x, 0);
        }
        // ---- Space for fixed objects ----
        this.addToMap(this.energyStatusbar); //To move statusbar relative to camera
        this.addToMap(this.coinStatusbar);
        this.addToMap(this.bottleStatusbar);
        if (this.level.endboss.statusbar) {
            this.addToMap(this.level.endboss.statusbar);
        }
       if(this.controlEnabled){
        this.ctx.translate(this.camera_x, 0);
        }
        
        this.addToMap(this.level.endboss);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.collectableObjects);

        this.addToMap(this.character);

        if(this.controlEnabled){
            this.ctx.translate(-this.camera_x, 0);
            }

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
        // mo.drawOffsetFrame(this.ctx);
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