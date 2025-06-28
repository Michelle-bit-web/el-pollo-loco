class World {
  camera_x = 0;
  fightScene = false;
  // isFading = false;
  throwTimeout = false;
  character = new Character(this);
  energyStatusbar = new Statusbar("energy", 10, 5, this);
  coinStatusbar = new Statusbar("coin", 10, 45, this);
  bottleStatusbar = new Statusbar("bottle", 10, 85, this);
  throwableObjects = [];
  

  constructor(canvas, keyboard, level, controlEnabled) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level;
    this.controlEnabled = controlEnabled;
    this.setWorld();
    this.draw();
    this.run();
    audioList.gamePlay.play();
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
      if (this.character.isColliding(enemy) && !enemy.isDead && !this.fightScene && !this.level.endboss.firstContactCharacter) {
        if (this.character.isAboveGround() && this.character.speedY < 0) {
          this.level.enemies[enemyIndex].markAsDead();
        } else if (!this.character.isDead() && !enemy.isDead) {
          this.character.takeDamage(10);
        }
      }
    });
  }

  collisionsCharacterEndboss() {
    if (
      this.character.isAboveGround() &&
      this.character.isColliding(this.level.endboss) &&
      this.level.endboss.isJumping
    ) {
      this.level.endboss.takeDamage(5);
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
        this.level.endboss.takeDamage(2);
        
      }
    });
  }

  collisionsBottleChicken() {
    this.level.enemies.forEach((enemy, enemyIndex) => {
      this.throwableObjects.forEach((bottle) => {
        if (bottle.isColliding(enemy, enemyIndex) && !enemy.isDead && !bottle.isSplashing) {
          this.handleBottleCollision(bottle, enemyIndex);
          if (!AudioManager.isMuted) {
            audioList.bottleBreaks.play();
            audioList.bottleSplash.play();
          }
        }
        this.removeDeadEnemy(enemy, enemyIndex);
      });
    });
  }

  handleBottleCollision(bottle, enemyIndex) {
    bottle.splash();
    this.level.enemies[enemyIndex].markAsDead();
  }

  removeDeadEnemy(enemy, enemyIndex) {
    setTimeout(() => {
      if (enemy.isDead) {
        this.level.enemies.splice(enemyIndex, 1);
        audioList.ghost.play();
      }
    }, 100);
  }

  collisionsWithCollectables() {
    this.level.collectableObjects.forEach((item, index) => {
      if (this.character.isColliding(item)) {
        if (item.imageType === "coin") {
          this.character.collectCoin();
        } else if (item.imageType === "bottle" || item.imageType === "bottleGround") {
          this.character.collectBottle();
        }
        // Collectable entfernen
        this.level.collectableObjects.splice(index, 1);
      }
    });
  }

  checkIsThrowing() {
    if (this.keyboard.THROW && !this.throwTimeout) {
      this.character.lastTimeMoved = new Date().getTime();
      let percentageSingleBottle = 100 / this.bottleStatusbar.maxBottles;
      if (this.character.bottles >= 1 && this.bottleStatusbar.percentage >= percentageSingleBottle) {
        let bottle = new ThrowableObject(this.character.x, this.character.y, this.character.otherDirection, this);
        this.throwableObjects.push(bottle);
        this.character.bottles--;
        bottle.throw();
        this.character.updateStatusbar("bottle");
        this.throwTimeout = true;
        setTimeout(() => {
          this.throwTimeout = false;
        }, 300);
      }
    }
  }

  checkCharacterDistance() {
    const treshold = [0, 800, 1600, 2800, this.level.endArrowPosition];
    treshold.forEach((treshold, index) => {
      if (this.character.x > treshold && !this[`collectableObjectsGenerated${index}`]) {
        this[`collectableObjectsGenerated${index}`] = true;
      }
    });
    if (
      this.character.x  > this.level.endArrowPosition + 100 &&
      !this.fightScene &&
      !this.level.endboss.firstContactCharacter
    ) {
      this.startFightScene();
    }
  }

  startFightScene() {
    audioList.gamePlay.stop();
    audioList.fightScene.play();
    const endbossX = this.level.endboss.x - 400;
    this.level.endboss.x = 2900;
    this.focusCameraOnEndboss(endbossX);
    this.level.endboss.handleFirstContact();
  }

  focusCameraOnEndboss(endbossX) {
    this.fightScene = true;
    this.controlEnabled = false;
    let cameraLocked = false;
    let startFightPrompt = document.getElementById("overlay");

    const cameraMovingInterval = setInterval(() => {
      if (this.fightScene && this.camera_x >=  -endbossX && !cameraLocked) {
        this.keyboard.RIGHT = false;
        this.camera_x -= 10;
      } else {
        this.camera_x = -endbossX;
        cameraLocked = true;

          setTimeout(() => {
          clearInterval(cameraMovingInterval);
          startFightPrompt.style.display = "flex";
          startFightPrompt.style.fontSize = "6vw";
          startFightPrompt.style.textAlign = "center";
          startFightPrompt.style.backgroundColor = "rgba(60, 24, 2, 0.43)";
          startFightPrompt.innerHTML = "Let´s salsa it!";
        }, 1000);
      
        setTimeout(() => {
          clearInterval(cameraMovingInterval);
          this.returnCameraToCharacter();
          startFightPrompt.style.display = "none";
          this.controlEnabled = true;
        }, 4000)};
    }, 10);
        
        this.level.endboss.handleFirstContact(); 
        this.level.endboss.firstContactCharacter = true;
  }

  returnCameraToCharacter() {
    const cameraMovingToCharacter = setInterval(() => {
      if (this.camera_x < -(this.character.x - 100)) {
        this.camera_x += 20; 
      } else {
         this.camera_x = -(this.character.x - 100)
        clearInterval(cameraMovingToCharacter);
      }
    }, 300);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.drawBackgrounds();
    this.ctx.translate(-this.camera_x, 0);
    this.drawFixedObj();
    this.ctx.translate(this.camera_x, 0);
    this.drawMovableObj();
    this.ctx.translate(-this.camera_x, 0);
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

  checkGameEnd() {
    let overlay = document.getElementById("overlay");
    let endScreenImage;
    if (!this.character.isDead() && !this.level.endboss.isDead()) return;
    // this.fadeToBlack();
    if (this.character.isDead()) {
      endScreenImage = "assets/img/You won, you lost/Game Over.png";
      audioList.gameOver.play();
    } else if (this.level.endboss.isDead()) {
      endScreenImage = "assets/img/You won, you lost/You Win A.png";
      audioList.gameWin.play();
    }
    overlay.innerHTML = getEndScreenTemplate(endScreenImage);
    overlay.style.display = "flex";
    this.stopIntervals();
    setTimeout(() => {
      audioList.mainTheme.play();
    }, 2000);
    this.character.bottles = 0;
    this.character.coins = 0;
    this.throwableObjects = [];
  }

  stopIntervals() {
    intervals.forEach((interval) => clearInterval(interval));
    AudioManager.sounds.forEach((sound) => sound.stop());
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

//------Vllt außerhalb der Klasse noch:
//let requestAnimationFrameId = 0;
