class World {
  camera_x = 0;
  fightScene = false;
  // isFading = false;
  character = new Character(this);
  energyStatusbar = new Statusbar("energy", 10, 5, this);
  coinStatusbar = new Statusbar("coin", 10, 45, this);
  bottleStatusbar = new Statusbar("bottle", 10, 85, this);
  throwableObjects = [];
  gameSounds = {
    backgroundMusicGeneral: new AudioManager("assets/audio/background/Slower_Version-2023-05-15_-_Chicken_Chase_-_www.FesliyanStudios.com.mp3",0.2,true,1),
    chickenSound: new AudioManager("assets/audio/background/mixkit-chickens-and-pigeons-1769.wav", 0.1, true, 1),
    onLandingSound: new AudioManager("assets/audio/jump-on-chicken/mixkit-falling-hit-on-gravel-756.wav", 0.1, true, 1),
    landingOnChickenSound: new AudioManager("assets/audio/jump/mixkit-body-punch-quick-hit-2153.wav", 0.1, true, 1),
    jumpSound: null,
    coinCollectedSound: new AudioManager("assets/audio/collect/mixkit-retro-game-notification-212.wav", 0.1, true, 1),
    endbossIntroSound: new AudioManager("assets/audio/endboss-intro/2019-05-09_-_Escape_Chase_-_David_Fesliyan.mp3",0.1,false,1),
    endbossHurtSound: new AudioManager("/assets/audio/endboss/mixkit-cock-cry-1761.wav", 0.5, false, 1),
    throwingSound: null,
    breakGlassSound: new AudioManager("assets/audio/throw/mixkit-glass-break-with-hammer-thud-759.wav", 0.08, false, 1),
    splashSound: new AudioManager("assets/audio/throw/mixkit-gore-video-game-blood-splash-263.wav", 0.08, false, 1),
    characterHurtSound: new AudioManager("assets/audio/hurt/mixkit-arcade-retro-game-over-213.wav", 0.08, false, 1),
    energyRecoverySound: new AudioManager("assets/audio/collect/mixkit-extra-bonus-in-a-video-game-2045.wav", 0.08, false, 1),
    walkingSound: new AudioManager("/assets/audio/walk/mixkit-footsteps-in-woods-loop-533.wav", 0.5, false, 10),
    characterDead: new AudioManager("assets/audio/game-over/mixkit-player-losing-or-failing-2042.wav", 0.2, false, 1),
    gameOverSound: new AudioManager("assets/audio/game-over/mixkit-retro-arcade-game-over-470.wav", 0.2, false, 10),
    gameWinSound: new AudioManager("assets/audio/game-win/mixkit-video-game-win-2016.wav", 0.2, false, 10),
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
    // this.gameSounds.chickenSound.play(); 
  }

  setWorld() {
    this.level.endboss.world = this;
  }

  run() {
    let checkingInterval = setInterval(() => {
      this.checkCollisions();
      this.checkIsThrowing();
      this.checkCharacterDistance();
      this.checkGameEnd();
    }, 10);
    intervals.push(checkingInterval);
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
      if(this.character.isColliding(enemy) && !enemy.isDead){
        if (this.character.isAboveGround() && this.character.speedY < 0) {
          this.level.enemies[enemyIndex].markAsDead();
        } else if (!this.character.isDead() && !enemy.isDead) {
          this.character.takeDamage(10);
        }
      };
    });
  }

  collisionsCharacterEndboss() {
    if (
      this.character.isAboveGround() &&
      this.character.isColliding(this.level.endboss) &&
      this.level.endboss.isJumping
    ) {
      this.level.endboss.takeDamage(10);
    } else if (this.character.isColliding(this.level.endboss)) {
       this.character.takeDamage(15);
    }
  }

  collisionsBottleEndboss() {
    this.throwableObjects.forEach((bottle) => {
      if (!bottle.isSplashing && bottle.isColliding(this.level.endboss)) {
        bottle.splash();
        // this.level.endboss.hit(); //braucht man hit & takeDamage dann noch?
        // this.changeStatusbar(this.level.endboss.statusbar, -10);
        this.level.endboss.takeDamage(10);
        this.gameSounds.splashSound.play();
      }
    });
  }

  collisionsBottleChicken() {
    this.level.enemies.forEach((enemy, enemyIndex) => {
      this.throwableObjects.forEach((bottle) => {
        if (bottle.isColliding(enemy, enemyIndex) && !enemy.isDead && !bottle.isSplashing) {
          this.handleBottleCollision(bottle, enemyIndex);
        };
        this.removeDeadEnemy(enemy, enemyIndex);
      });
    });
    // this.throwableObjects = this.throwableObjects.filter((obj) => !obj.remove);
  }

  handleBottleCollision(bottle, enemyIndex){
    bottle.splash();
    this.level.enemies[enemyIndex].markAsDead();
  }

  removeDeadEnemy(enemy, enemyIndex){
    setTimeout(() => {
          if (enemy.isDead) {
            this.level.enemies.splice(enemyIndex, 1);
          }
        }, 100);
  }

  collisionsWithCollectables() {
    this.level.collectableObjects.forEach((item, index) => {
      if (this.character.isColliding(item)) {
        if (item.imageType === "coin") {
          this.character.collectCoin();
        } else if (item.imageType === "bottle" || item.imageType === "bottleGround") {
         this.character.collectBottle();;
        }
        // Collectable entfernen
        this.level.collectableObjects.splice(index, 1);
      }
    });
  }

  // handleCharacterEnergy(enemy){
  //   this.character.hit(enemy);
  //   this.changeStatusbar(this.energyStatusbar, -10);
  // }

  // changeStatusbar(statusbar, value) {
  //   if (statusbar.type === "coin") {
  //     const increment = value * (100 / statusbar.maxCoins); // Jeder Coin trägt gleichmäßig bei
  //     if (statusbar.percentage + increment >= 100) {
  //       // Wenn Coins-Leiste gefüllt ist
  //       if (this.energyStatusbar.percentage < 100) {
  //         // Nur Energie auffüllen, wenn Energie < 100
  //         const missingEnergy = 100 - this.energyStatusbar.percentage;
  //         this.changeStatusbar(this.energyStatusbar, missingEnergy);
  //       }
  //       statusbar.setPercentage(0); // Coins-Leiste zurücksetzen
  //     } else {
  //       statusbar.setPercentage(statusbar.percentage + increment);
  //     }
  //   } else if (statusbar.type === "bottle") {
  //       const increment = value * (100 / statusbar.maxBottles); // Berechnung des Prozentsatzes
  //       if (statusbar.percentage + increment <= 100 && statusbar.percentage + increment >= 0) {
  //           statusbar.setPercentage(statusbar.percentage + increment);
  //       } 
  //   }
  // }

  checkIsThrowing() {
    if (this.keyboard.THROW) {
      this.character.lastTimeMoved = new Date().getTime();
      let percentageSingleBottle = 100 / this.bottleStatusbar.maxBottles;
      if (this.character.bottles >= 1 && this.bottleStatusbar.percentage >= percentageSingleBottle) {
        let bottle = new ThrowableObject(this.character.x, this.character.y, this.character.otherDirection, this);
        this.throwableObjects.push(bottle);
        bottle.throw();
        this.character.bottles--;
        this.character.updateStatusbar("bottle");
      }
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
    if (mo.otherDirection) {this.flipImage(mo);}
    mo.draw(this.ctx);
    // mo.drawOffsetFrame(this.ctx); /*---später entfernen---*/
    if (mo.otherDirection) {this.flipImageBack(mo);}
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
     this.stopIntervals();
  }

  stopIntervals(){
    intervals.forEach(interval => clearInterval(interval));
    AudioManager.sounds.forEach(sound => sound.stop())
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

