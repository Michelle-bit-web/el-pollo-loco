class World {
  character = new Character(this);
  canvas;
  canvasState = "game"; // "startscreen" oder "game"
  ctx;
  keyboard;
  camera_x = 0;
  fightScene = false;
  isFading = false;
  energyStatusbar = new Statusbar("energy", 10, 5, this);
  coinStatusbar = new Statusbar("coin", 10, 45, this);
  bottleStatusbar = new Statusbar("bottle", 10, 85, this);
  throwableObjects = [];
  gameSounds = {
    backgroundMusicGeneral: new AudioManager("assets/audio/background/Slower_Version-2023-05-15_-_Chicken_Chase_-_www.FesliyanStudios.com.mp3",0.2,true,1),
    chickenSound: new AudioManager("assets/audio/background/mixkit-chickens-and-pigeons-1769.wav", 0.1, true, 1),
    //     jumpSound: null,
    //     coinSound: null,
    endbossIntroSound: new AudioManager("assets/audio/endboss-intro/2019-05-09_-_Escape_Chase_-_David_Fesliyan.mp3",0.1,false,1),
    //     endbossAttackSound: new AudioManager("/assets/audio/endboss/mixkit-cock-cry-1761.wav", 0.5, false, 1),
    //     throwingSound: null,
    splashSound: new AudioManager("assets/audio/throw/mixkit-glass-break-with-hammer-thud-759.wav", 0.08, false, 1),
    //     hurtSound: null,
    //     walkingSound: new AudioManager("/assets/audio/walk/mixkit-footsteps-in-woods-loop-533.wav", 0.5, false, 1),
    gameOverSound: new AudioManager("assets/audio/game-over/mixkit-player-losing-or-failing-2042.wav", 0.2, false, 10),
  };

  constructor(canvas, keyboard, level, controlEnabled) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level;
    this.controlEnabled = controlEnabled;
    this.setWorld();
    this.draw();
    this.run();

    this.gameSounds.backgroundMusicGeneral.play();
    this.gameSounds.chickenSound.play(); 
    AudioManager.sounds.push(
      this.gameSounds.backgroundMusicGeneral,
      this.gameSounds.chickenSound,
      this.gameSounds.endbossIntroSound,
      this.gameSounds.splashSound,
      this.gameSounds.gameOverSound
    );
    
  }

  // loadGameOverImage() {
  //     this.gameOverImage = new Image();
  //     this.gameOverImage.src = "./assets/img/You won, you lost/Game over A.png";
  // }

  setWorld() {
    this.level.endboss.world = this;
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkIsThrowing();
      this.checkCharacterDistance();
      this.checkGameEnd();
    }, 100);
  }

  checkCollisions() {
    this.collisionsCharacterChicken();
    this.collisionsCharacterEndboss();
    this.collisionsWithCollectables();
    this.collisionsBottleChicken();
    this.collisionsBottleEndboss();
  }

  collisionsCharacterChicken() {
    this.level.enemies.forEach((enemy, enemyIndex) => {
      if (this.character.isAboveGround() && this.character.isColliding(enemy)) {
        this.level.enemies[enemyIndex].markAsDead();
      }
      if (this.character.isColliding(enemy) && !enemy.isDead) {
        this.character.hit(enemy);
        this.changeStatusbar(this.energyStatusbar, -10);
      }
    });
  }

  collisionsCharacterEndboss() {
    if (
      this.character.isAboveGround() &&
      this.character.isColliding(this.level.endboss) &&
      this.level.endboss.isJumping
    ) {
      this.level.endboss.takeDamage(20);
    } else if (this.character.isColliding(this.level.endboss)) {
      this.changeStatusbar(this.energyStatusbar, -15);
    }
  }

  collisionsBottleEndboss() {
    this.throwableObjects.forEach((bottle) => {
      if (!bottle.isSplashing && bottle.isColliding(this.level.endboss)) {
        bottle.splash();
        this.level.endboss.hit(); //braucht man hit & takeDamage dann noch?
        this.changeStatusbar(this.level.endboss.statusbar, -10);
        this.level.endboss.takeDamage(20);
        this.gameSounds.splashSound.play();
      }
    });
  }

  collisionsBottleChicken() {
    this.level.enemies.forEach((enemy, enemyIndex) => {
      this.throwableObjects.forEach((bottle) => {
        if (bottle.isColliding(enemy, enemyIndex) & !bottle.isSplashing) {
          bottle.splash();
          this.gameSounds.splashSound.play();
          this.level.enemies[enemyIndex].markAsDead();
        }
        setTimeout(() => {
          if (enemy.isDead) {
            this.level.enemies.splice(enemyIndex, 1); // Entferne den Gegner
          }
        }, 100);
      });
    });
    this.throwableObjects = this.throwableObjects.filter((obj) => !obj.remove);
  }

  collisionsWithCollectables() {
    this.level.collectableObjects.forEach((item, index) => {
      if (this.character.isColliding(item)) {
        if (item.imageType === "coin") {
          console.log("[DEBUG] Coin eingesammelt");
          console.log("[DEBUG] Übergabe an changeStatusbar für Coin:", 1);
          this.changeStatusbar(this.coinStatusbar, 1);
        } else if (item.imageType === "bottle" || item.imageType === "bottleGround") {
          console.log("[DEBUG] Bottle eingesammelt");
          console.log("[DEBUG] Übergabe an changeStatusbar für Bottle:", 1);
          this.changeStatusbar(this.bottleStatusbar, 1);
        }
        // Collectable entfernen
        this.level.collectableObjects.splice(index, 1);
      }
    });
  }

  changeStatusbar(statusbar, value) {
    if (statusbar.type === "coin") {
      const increment = value * (100 / statusbar.maxCoins); // Jeder Coin trägt gleichmäßig bei
      if (statusbar.percentage + increment >= 100) {
        // Wenn Coins-Leiste gefüllt ist
        if (this.energyStatusbar.percentage < 100) {
          // Nur Energie auffüllen, wenn Energie < 100
          const missingEnergy = 100 - this.energyStatusbar.percentage;
          this.changeStatusbar(this.energyStatusbar, missingEnergy);
        }
        statusbar.setPercentage(0); // Coins-Leiste zurücksetzen
      } else {
        statusbar.setPercentage(statusbar.percentage + increment);
      }
    } else if (statusbar.type === "bottle") {
        const increment = value * (100 / statusbar.maxBottles); // Berechnung des Prozentsatzes
        if (statusbar.percentage + increment <= 100 && statusbar.percentage + increment >= 0) {
            statusbar.setPercentage(statusbar.percentage + increment);
        } else if (statusbar.percentage >= 100) {
            console.log("[DEBUG] Flaschenleiste ist voll, keine weiteren Flaschen gesammelt.");
        } else if (statusbar.percentage <= 0) {
            console.log("[DEBUG] Keine Flaschen-Prozente mehr verfügbar.");
        }
    }
  }

  checkIsThrowing() {
    if (this.keyboard.THROW) {
      this.character.lastTimeMoved = new Date().getTime();
      let percentageSingleBottle = 100 / this.bottleStatusbar.maxBottles;
      if (this.bottleStatusbar.percentage >= percentageSingleBottle) {
        let bottle = new ThrowableObject(this.character.x, this.character.y, this.character.otherDirection);
        console.log('throwing ausgelöst')
        this.throwableObjects.push(bottle);
        bottle.throw();
        this.changeStatusbar(this.bottleStatusbar, -percentageSingleBottle);
      }else {
            console.log("Nicht genug Flaschen-Prozente, um zu werfen.");
        };
    };
  }

  checkCharacterDistance() {
      const treshold = [0, 800, 1600, 2800, this.level.endArrowPosition];
      treshold.forEach((treshold, index) =>{
        if(this.character.x > treshold && !this[`collectableObjectsGenerated${index}`]){
          this[`collectableObjectsGenerated${index}`] = true;
        }});
      if (this.character.x + 200 > this.level.endArrowPosition && !this.fightScene && !this.level.endboss.firstContactCharacter){
        this.startFightScenne();
      }
  }

  startFightScenne(){
    this.fightScene = true;
        this.controlEnabled = false;
        this.gameSounds.backgroundMusicGeneral.stop();
        this.gameSounds.endbossIntroSound.play();
        const endbossX = this.level.endboss.x;
        this.focusCameraOnEndboss(endbossX);
        this.level.endboss.firstContactCharacter = true;
        this.level.endboss.handleFirstContact();
  }

  focusCameraOnEndboss(endbossX) {
    this.fightScene = true;
    console.log("Kamera auf Endboss fixiert");
    this.camera_x = -endbossX + 400;
    this.level.endboss.handleFirstContact();
    this.controlEnabled = true;
    this.level.endboss.firstContactCharacter = true;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.controlEnabled) {
      this.ctx.translate(this.camera_x, 0);
      this.drawBackgrounds();
      this.ctx.translate(-this.camera_x, 0);
      this.drawFixedObj();
      this.ctx.translate(this.camera_x, 0);
      this.drawMovableObj();
      this.ctx.translate(-this.camera_x, 0);
    }
    requestAnimationFrame(() => this.draw());
  }

  drawBackgrounds() {
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
  }

  drawFixedObj() {
    this.addToMap(this.energyStatusbar);
    this.addToMap(this.coinStatusbar);
    this.addToMap(this.bottleStatusbar);
    if (this.level.endboss.statusbar) {
      this.addToMap(this.level.endboss.statusbar);
    }
  }

  drawMovableObj() {
    this.addToMap(this.level.endboss);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.level.collectableObjects);

    this.addToMap(this.character);
  }

  addObjectsToMap(objects) {
    objects.forEach((obj) => this.addToMap(obj));
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    // mo.drawOffsetFrame(this.ctx); /*---später entfernen---*/
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  checkGameEnd(){
    let overlay = document.getElementById("overlay");
    let endScreenImage;
    if(!this.character.isDead() && !this.level.endboss.isDead()) return;
    // this.fadeToBlack();
    if(this.character.isDead()){
      endScreenImage = "assets/img/You won, you lost/Game Over.png";
    }else if(this.level.endboss.isDead()){
     endScreenImage = "assets/img/You won, you lost/You Win A.png"; 
    };
     overlay.innerHTML = getEndScreenTemplate(endScreenImage);
     overlay.style.display = "flex";
     overlay.style.backgroundImage = `url(${endScreenImage})`; 
  }
}

/*---später vielleicht nutzen als Übergang zum Endscreen--*/

  // fadeToBlack(callback) {
  //   this.isFading = true; // Setze den Fade-Zustand auf true
  //   let alpha = 0; // Transparenz-Wert (0 = vollständig transparent, 1 = vollständig schwarz)
  //   const fadeInterval = setInterval(() => {
  //     this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`; // Schwarzer Overlay
  //     this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  //     alpha += 0.02; // Transparenz erhöhen
  //     if (alpha >= 1) {
  //       // Wenn das Canvas vollständig schwarz ist
  //       clearInterval(fadeInterval);
  //       callback(); // Rufe die angegebene Funktion auf (z. B. Levelwechsel)
  //       this.isFading = false; // Setze den Fade-Zustand zurück
  //     }
  //   }, 50);
  //   if (this.level.endboss.energy === 0) {
  //     this.displayEndScreen("endbossIsDead");
  //   } else if (this.character.energy === 0) {
  //     this.displayEndScreen("characterIsDead");
  //   }
  // }

  /*---Vllt für Level-Wechsel hierüber eine new world mit der Übergabe von level2--*/

  // changeLevel(newLevel) {
  //   this.level = newLevel; // Hier wird das Level gewechselt
  //   this.character.x = 0;
  //   this.camera_x = 0;
  //   console.log("Level gewechselt", this.level);
  //   this.fadeIn();
  // }

