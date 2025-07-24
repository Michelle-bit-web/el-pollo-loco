class World {
  camera_x = 0;
  fightScene = false;
  throwTimeout = false;
  character = new Character(this);
  energyStatusbar = new Statusbar("energy", 10, 5, this);
  coinStatusbar = new Statusbar("coin", 10, 45, this);
  bottleStatusbar = new Statusbar("bottle", 10, 85, this);
  throwableObjects = [];
  intervalsStoped = false;

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
        this.level.endboss.takeDamage(20);
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
        this.level.collectableObjects.splice(index, 1);
      }
    });
  }

  checkIsThrowing() {
    if (this.keyboard.THROW && !this.throwTimeout) {
      this.character.lastTimeMoved = new Date().getTime();
      if (this.character.bottles >= 1 ) {
        let bottle = this.createThrowableObject();
        bottle.throw();
        this.character.updateStatusbar("bottle");
        this.throwTimeout = true;
        this.delayToThrowAgain();
      }
    }
  }

  createThrowableObject() {
    let bottle = new ThrowableObject(this.character.x, this.character.y, this.character.otherDirection, this);
    this.throwableObjects.push(bottle);
    this.character.bottles--;
    return bottle;
  }

  delayToThrowAgain() {
    setTimeout(() => {
      this.throwTimeout = false;
    }, 300);
  }

  checkCharacterDistance() {
    // const treshold = [0, 800, 1600, 2800, this.level.endArrowPosition];
    // treshold.forEach((treshold, index) => {
    //   if (this.character.x > treshold && !this[`collectableObjectsGenerated${index}`]) {
    //     this[`collectableObjectsGenerated${index}`] = true;
    //   }
    // });
    if (
      this.character.x  > this.level.endArrowPosition + 100 &&
      !this.fightScene &&
      !this.level.endboss.firstContactCharacter
    ) this.startFightScene();
  }

  startFightScene() {
    audioList.gamePlay.stop();
    audioList.fightScene.shouldPlay = true;
    audioList.fightScene.play();
    const endbossX = this.level.endboss.x - 400;
    this.level.endboss.x = 2900;
    this.focusCameraOnEndboss(endbossX);
    this.level.endboss.handleFirstContact();
  }

  focusCameraOnEndboss(endbossX) {
    this.fightScene = true;
    this.controlEnabled = false;
    const overlay = document.getElementById("overlay");
    this.moveCameraToEndboss(endbossX, overlay);
    this.level.endboss.handleFirstContact();
    this.level.endboss.firstContactCharacter = true;
  }

  moveCameraToEndboss(endbossX, overlay) {
    let cameraLocked = false;
    const interval = setInterval(() => {
      if (this.fightScene && this.camera_x >= -endbossX && !cameraLocked) {
        this.keyboard.RIGHT = false;
        this.camera_x -= 10;
      } else {
        this.lockCamera(interval, overlay, endbossX);
        cameraLocked = true;
      }
    }, 10);
  }

  lockCamera(interval, overlay, endbossX) {
    this.camera_x = -endbossX;
    setTimeout(() => this.showFightPrompt(interval, overlay), 1000);
    setTimeout(() => this.resumeGameFromPrompt(overlay), 4000);
  }

  showFightPrompt(interval, overlay) {
    clearInterval(interval);
    Object.assign(overlay.style, {
      display: "flex",
      fontSize: "6vw",
      textAlign: "center",
      backgroundColor: "rgba(60, 24, 2, 0.43)",
    });
    overlay.innerHTML = "Let´s salsa it!";
  }

  // showFightPrompt(interval, overlay) {
  //   clearInterval(interval);
  //   Object.assign(overlay.style, {
  //     display: "flex",
  //     fontSize: "5.5vw",
  //     textAlign: "center",
  //     backgroundColor: "rgba(60, 24, 2, 0.43)",
  //   });
  //   document.getElementById("menu-overlay").style.display = "none";
  //   document.getElementById("fight-message").style.display = "flex";
  // }

  resumeGameFromPrompt(overlay) {
    this.returnCameraToCharacter();
    // document.getElementById("fight-message").style.display = "none";
    // document.getElementById("menu-overlay").style.display = "flex";
    overlay.style.display = "none";
    this.controlEnabled = true;
    this.resetOverlay();
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
    if (this.intervalsStoped) {
      this.intervalsStoped = true;
      this.stopIntervals();
    }
    if (!this.character.isDead() && !this.level.endboss.isDead()) return;
    const endScreenImage = this.getEndScreenImage();
    this.prepareEndSequence(endScreenImage);
    this.resetCharacterState();
    this.scheduleAudioReset();
    this.resetOverlay();
  }

  getEndScreenImage() {
    if (this.character.isDead()) {
      return "assets/img/You won, you lost/Game Over.png";
    }
    if (this.level.endboss.isDead()) {
      return "assets/img/You won, you lost/You Win A.png";
    }
    return "";
  }

  prepareEndSequence(endScreenImage) {
    const overlay = document.getElementById("overlay");
    setTimeout(() => {
        this.handleEndAudio();
        overlay.innerHTML = getEndScreenTemplate(endScreenImage);
        overlay.style.display = "flex";
    }, 2500);
  }

  handleEndAudio() {
    if (this.character.isDead()) {
      this.playAudioWithStop(audioList.gameOver);
    } else if (this.level.endboss.isDead()) {
      this.playAudioWithStop(audioList.gameWin);
    }
  }

  playAudioWithStop(audio) {
    audio.shouldPlay = true;
    audio.play();
    setTimeout(() => this.stopIntervals(), 1000);
  }

  resetCharacterState() {
    this.character.bottles = 0;
    this.character.coins = 0;
    this.throwableObjects = [];
  }

  scheduleAudioReset() {
    setTimeout(() => {
      audioList.gameWin.stop();
      audioList.gameOver.stop();
      audioList.mainTheme.shouldPlay = true;
      audioList.mainTheme.play();
    }, 5500);
  }

  resetOverlay() {
    document.getElementById("overlay").innerHTML = originalOverlay;
    console.log(originalOverlay)
  }

  stopIntervals() {
    intervals.forEach((interval) => clearInterval(interval));
    AudioManager.sounds.forEach((sound) => sound.stop());
    this.character.stopAllAnimations();
    this.level.enemies.forEach(enemy => enemy.stopAllAnimations);
    this.level.endboss.stopAllAnimations();
    this.throwableObjects.forEach(bottle => bottle.stopAllAnimations());
  }
}