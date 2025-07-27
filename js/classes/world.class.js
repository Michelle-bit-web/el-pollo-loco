/**
 * Represents the main game world.
 * Handles rendering, game logic, collisions, object interactions, animations, camera movement, audio control, and game state transitions.
 */
class World {
  /**
   * @property {number} camera_x - Horizontal offset for the camera view.
   * @property {boolean} fightScene - Indicates if the endboss fight scene is active.
   * @property {boolean} throwTimeout - Prevents rapid bottle throws by applying a short delay.
   * @property {Character} character - The main character controlled by the player.
   * @property {Statusbar} energyStatusbar - UI element displaying character's health.
   * @property {Statusbar} coinStatusbar - UI element displaying collected coins.
   * @property {Statusbar} bottleStatusbar - UI element displaying available bottles.
   * @property {ThrowableObject[]} throwableObjects - Active thrown bottles in the world.
   * @property {boolean} intervalsStoped - Flag to indicate if all game intervals are stopped.
   */
  camera_x = 0;
  fightScene = false;
  throwTimeout = false;
  character = new Character(this);
  energyStatusbar = new Statusbar("energy", 10, 5, this);
  coinStatusbar = new Statusbar("coin", 10, 45, this);
  bottleStatusbar = new Statusbar("bottle", 10, 85, this);
  throwableObjects = [];
  intervalsStoped = false;

  /**
   * Creates a new World instance.
   * @param {HTMLCanvasElement} canvas - The canvas on which the game is rendered.
   * @param {Keyboard} keyboard - The object that tracks key states.
   * @param {Level} level - The current level object containing enemies, objects, endboss, etc.
   * @param {boolean} controlEnabled - Flag indicating if character controls are currently enabled.
   */
  constructor(canvas, keyboard, level, controlEnabled) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level;
    this.controlEnabled = controlEnabled;
    this.setWorld();
    this.draw();
    this.run();
    AudioController.playGamePlay();
  }

  /**
   * Links this world instance to the endboss object.
   */
  setWorld() {
    this.level.endboss.world = this;
  }

  /**
   * Starts the main game loop that handles collisions and logic checks.
   */
  run() {
    let checkingInterval = setInterval(() => {
      this.checkCollisions();
      this.checkIsThrowing();
      this.checkCharacterDistance();
      this.checkGameEnd();
    }, 10);
    intervals.push(checkingInterval);
  }

  /**
   * Runs all collision checks in the game.
   */
  checkCollisions() {
    this.collisionsCharacterChicken();
    this.collisionsCharacterEndboss();
    this.collisionsWithCollectables();
    this.collisionsBottleChicken();
    this.collisionsBottleEndboss();
  }

  /**
   * Checks for collisions between the character and enemies (chickens).
   */
  collisionsCharacterChicken() {
    this.level.enemies.forEach((enemy, enemyIndex) => {
      if (
        this.character.isColliding(enemy) &&
        !enemy.isDead &&
        !this.fightScene &&
        !this.level.endboss.firstContactCharacter
      ) {
        if (this.character.isAboveGround() && this.character.speedY < 0) {
          this.level.enemies[enemyIndex].markAsDead();
        } else if (!this.character.isDead() && !enemy.isDead) {
          this.character.takeDamage(10);
        }
      }
    });
  }

  /**
   * Handles collisions between the character and the endboss.
   */
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

  /**
   * Handles collisions between bottles and the endboss.
   */
  collisionsBottleEndboss() {
    this.throwableObjects.forEach((bottle) => {
      if (!bottle.isSplashing && bottle.isColliding(this.level.endboss)) {
        bottle.splash();
        this.level.endboss.takeDamage(20);
      }
    });
  }

  /**
   * Handles collisions between bottles and regular enemies.
   */
  collisionsBottleChicken() {
    this.level.enemies.forEach((enemy, enemyIndex) => {
      this.throwableObjects.forEach((bottle) => {
        if (bottle.isColliding(enemy, enemyIndex) && !enemy.isDead && !bottle.isSplashing) {
          this.handleBottleCollision(bottle, enemyIndex);
          AudioController.playBottleSounds();
        }
        this.removeDeadEnemy(enemy, enemyIndex);
      });
    });
  }

  /**
   * Handles bottle hitting an enemy and playing associated effects.
   *
   * @param {ThrowableObject} bottle - The thrown object.
   * @param {number} enemyIndex - The index of the impacted enemy.
   */
  handleBottleCollision(bottle, enemyIndex) {
    bottle.splash();
    this.level.enemies[enemyIndex].markAsDead();
  }

  /**
   * Removes a defeated enemy from the enemy list after a delay.
   *
   * @param {Enemy} enemy - The enemy object.
   * @param {number} enemyIndex - Index of the enemy in the array.
   */
  removeDeadEnemy(enemy, enemyIndex) {
    setTimeout(() => {
      if (enemy.isDead) {
        this.level.enemies.splice(enemyIndex, 1);
        AudioController.playGhostSound();
      }
    }, 100);
  }

  /**
   * Handles collection of items (coins, bottles) by the character.
   */
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

  /**
   * Detects if the character is attempting to throw a bottle and creates it if possible.
   */
  checkIsThrowing() {
    if (this.keyboard.THROW && !this.throwTimeout) {
      this.character.lastTimeMoved = new Date().getTime();
      if (this.character.bottles >= 1) {
        let bottle = this.createThrowableObject();
        bottle.throw();
        this.character.updateStatusbar("bottle");
        this.throwTimeout = true;
        this.delayToThrowAgain();
      }
    }
  }

  /**
   * Instantiates and returns a new throwable object (bottle).
   *
   * @returns {ThrowableObject} The newly created throwable object.
   */
  createThrowableObject() {
    let bottle = new ThrowableObject(this.character.x, this.character.y, this.character.otherDirection, this);
    this.throwableObjects.push(bottle);
    this.character.bottles--;
    return bottle;
  }

  /**
   * Prevents bottle throwing for a short cooldown period.
   */
  delayToThrowAgain() {
    setTimeout(() => {
      this.throwTimeout = false;
    }, 300);
  }

  /**
   * Triggers the endboss fight scene if the character moves far enough.
   */
  checkCharacterDistance() {
    if (
      this.character.x > this.level.endArrowPosition + 100 &&
      !this.fightScene &&
      !this.level.endboss.firstContactCharacter
    )
      this.startFightScene();
  }

  /**
   * Begins the fight scene sequence with sound and camera transition.
   */
  startFightScene() {
    AudioController.stopGamePlay();
    AudioController.startFightScene();
    const endbossX = this.level.endboss.x - 400;
    this.level.endboss.x = 2900;
    this.focusCameraOnEndboss(endbossX);
    this.level.endboss.handleFirstContact();
  }

  /**
   * Moves the camera to focus on the endboss.
   *
   * @param {number} endbossX - Target X-position for the camera to focus on.
   */
  focusCameraOnEndboss(endbossX) {
    this.fightScene = true;
    this.controlEnabled = false;
    const overlay = document.getElementById("overlay");
    this.moveCameraToEndboss(endbossX, overlay);
    this.level.endboss.handleFirstContact();
    this.level.endboss.firstContactCharacter = true;
  }

  /**
   * Moves the camera smoothly toward the endboss position.
   *
   * @param {number} endbossX - Target X-position.
   * @param {HTMLElement} overlay - The overlay element used for messages.
   */
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

  /**
   * Locks the camera at the endboss and displays a fight message.
   *
   * @param {number} interval - Camera movement interval ID.
   * @param {HTMLElement} overlay - Overlay to show the prompt.
   * @param {number} endbossX - X-coordinate to lock the camera on.
   */
  lockCamera(interval, overlay, endbossX) {
    this.camera_x = -endbossX;
    setTimeout(() => StartFightScreen.showFightPrompt(interval, overlay), 1000);
    setTimeout(() => StartFightScreen.resumeGameFromPrompt(this, overlay), 4000);
  }

  /**
   * Moves the camera back to the player character after the fight prompt.
   */
  returnCameraToCharacter() {
    const cameraMovingToCharacter = setInterval(() => {
      if (this.camera_x < -(this.character.x - 100)) {
        this.camera_x += 20;
      } else {
        this.camera_x = -(this.character.x - 100);
        clearInterval(cameraMovingToCharacter);
      }
    }, 300);
  }

  /**
   * Main draw loop for the canvas that handles rendering of backgrounds, status bars, objects and character.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    DrawHelpers.drawBackgrounds(this.ctx, this.level, this.camera_x, this.addObjectsToMap.bind(this));
    DrawHelpers.drawFixedObjects(this.ctx, this.energyStatusbar, this.coinStatusbar, this.bottleStatusbar, this.level.endboss.statusbar, this.addToMap.bind(this));
    DrawHelpers.drawMovableObjects(this.ctx, this.level, this.character, this.throwableObjects, this.addObjectsToMap.bind(this), this.addToMap.bind(this), this.camera_x);
    requestAnimationFrame(() => this.draw());
  }

  /**
   * Adds an array of objects to the canvas.
   *
   * @param {GameObject[]} objects - Objects to render.
   */
  addObjectsToMap(objects) {
    objects.forEach((obj) => this.addToMap(obj));
  }

  /**
   * Adds a single object to the canvas and handles flipping if needed.
   *
   * @param {GameObject} mo - The game object to add.
   */
  addToMap(mo) {
    if (mo.otherDirection) { this.flipImage(mo); }
    mo.draw(this.ctx);
    if (mo.otherDirection) { this.flipImageBack(mo);}
  }

  /**
   * Flips the object horizontally for left-facing movement.
   *
   * @param {GameObject} mo - The object to flip.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Reverts the object flip to restore the original orientation.
   *
   * @param {GameObject} mo - The object to flip back.
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Checks if the game should end based on character or boss state.
   */
  checkGameEnd() {
    EndgameController.checkGameEnd(this), this.character.isDead(), this.level.endboss.isDead();
  }

  /**
   * Stops all ongoing game sounds.
   */
  stopSounds() {
    AudioController.stopFightScene();
    AudioController.stopGamePlay();
    this.character.stopIdleSoundLogic();
  }

  /**
   * Prepares and displays the end screen with final status.
   *
   * @param {string} endScreenImage - Path to the image shown on game over or win.
   */
  prepareEndSequence(endScreenImage) {
    const overlay = document.getElementById("overlay");
    setTimeout(() => {
      this.handleEndAudio();
      overlay.innerHTML = getEndScreenTemplate(endScreenImage);
      overlay.style.display = "flex";
    }, 1500);
  }

  /**
   * Plays the appropriate end audio clip.
   */
  handleEndAudio() {
    AudioController.handleEndAudio (this.character.isDead(), this.level.endboss.isDead())
  }

  /**
   * Stops all animation and logic intervals in the game.
   */
  stopIntervals() {
    intervals.forEach((interval) => clearInterval(interval));
    this.character.stopAllAnimations();
    this.level.enemies.forEach((enemy) => enemy.stopAllAnimations);
    this.level.endboss.stopAllAnimations();
    this.throwableObjects.forEach((bottle) => bottle.stopAllAnimations());
  }
}