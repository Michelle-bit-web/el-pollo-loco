/**
 * Base class for all game objects that can move, be affected by gravity,
 * take damage, and interact with collectibles and the world.
 *
 * Extends {@link DrawableObject}.
 */
class MovableObject extends DrawableObject {
  /**
   * @property {number} speed - Horizontal movement speed.
   * @property {boolean} otherDirection - Indicates if the object is facing the opposite direction.
   * @property {number} speedY - Vertical speed used for jumping or falling.
   * @property {number} acceleration - Gravity acceleration factor.
   * @property {number} energy - Health points of the object.
   * @property {number} coins - Number of collected coins.
   * @property {number} bottles - Number of collected bottles.
   * @property {number} lastHit - Timestamp of the last time the object was hit.
   * @property {Object.<string, number>} animationIntervals - Stores animation interval IDs.
   * @property {number} levelEndX - X-coordinate marking the level's end.
   */
  speed = 0.4;
  otherDirection = false;
  speedY = 0;
  acceleration = 3;
  energy = 100;
  coins = 0;
  bottles = 0;
  lastHit = 0;
  animationIntervals = {};
  levelEndX = 3800;

  /**
   * Moves the object to the right, increasing its x position.
   */
  moveRight() {
    if (!controlEnabled) return;
    this.x += this.speed;
  }

  /**
   * Moves the object to the left, decreasing its x position.
   */
  moveLeft() {
    if (!controlEnabled) return;
    this.x -= this.speed;
  }

  /**
   * Stops all movement (horizontal and vertical).
   */
  stopMoving() {
    this.speed = 0;
    this.speedY = 0;
  }

  /**
   * Cycles through the provided image array to animate the object.
   *
   * @param {string[]} images - Array of image paths for animation.
   */
  playAnimation(images) {
    if (!controlEnabled) return;
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Stops a specific animation and optionally sets a static image.
   *
   * @param {string} intervalType - Key of the interval to clear.
   * @param {string} [path] - Optional path to set as a static image.
   */
  stopAnimation(intervalType, path) {
    if (path) {
      this.loadImage(path);
    }
    if (this.animationIntervals[intervalType]) {
      clearInterval(this.animationIntervals[intervalType]);
      delete this.animationIntervals[intervalType];
    }
  }

  /**
   * Stops all running animations and optionally sets a static image.
   *
   * @param {string} [path] - Optional path to set as a static image.
   */
  stopAllAnimations(path) {
    for (let key in this.animationIntervals) {
      clearInterval(this.animationIntervals[key]);
      delete this.animationIntervals[key];
    }
    clearInterval(this.endbossInterval);
    if (path) {
      this.loadImage(path);
    }
  }

  /**
   * Makes the object jump by setting its vertical speed.
   *
   * @param {number} [higherJump] - Optional custom jump height.
   */
  jump(higherJump) {
    if (!controlEnabled) return;
    if (higherJump == undefined) {
      this.speedY = 30;
    } else {
      this.speedY = higherJump;
    }
  }

  /**
   * Applies gravity to the object by adjusting its vertical position over time.
   * Starts a recurring interval.
   */
  applyGravity() {
    this.gravityInterval = setInterval(() => {
      if (this.isSplashing) return;
      if (this.isAboveGround() || this.speedY > 0) this.applyVerticalMotion();
      else if (this instanceof ThrowableObject) this.handleThrowable();
      if (this instanceof Chicken || this instanceof SmallChicken) this.applyVerticalMotion();
      if (this instanceof Endboss) this.limitEndbossHeight();
    }, 1000 / 25);
  }

  /**
   * Updates vertical position and simulates gravitational acceleration.
   */
  applyVerticalMotion() {
    this.y -= this.speedY;
    this.speedY -= this.acceleration;
  }

  /**
   * Handles vertical landing behavior for throwable objects (e.g., bottles).
   * If object hits the ground, it triggers a splash.
   */
  handleThrowable() {
    if (this.y >= 350) {
      this.y = 350;
      this.splash();
    }
  }

  /**
   * Prevents the endboss from falling below a certain Y-position.
   * Resets vertical speed and triggers landing callback.
   */
  limitEndbossHeight() {
    if (this.y > 120) {
      this.y = 120;
      this.speedY = 0;
      this.onLand();
    }
  }

  /**
   * Checks if the object is currently above ground.
   *
   * @returns {boolean} True if object is in the air.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) return this.y < 350;
    if (this instanceof Endboss) return this.y < 120;
    else return this.y < 155;
  }

  /**
   * Checks if the object is colliding with another MovableObject.
   * Uses bounding box with individual offsets.
   *
   * @param {MovableObject} mo - Another object to check collision against.
   * @returns {boolean} True if both objects collide.
   */
  isColliding(mo) {
    const offsetX = this.x + this.offset.left;
    const offsetY = this.y + this.offset.top;
    const offsetWidth = this.width - this.offset.left - this.offset.right;
    const offsetHeight = this.height - this.offset.top - this.offset.bottom;
    const moOffsetX = mo.x + mo.offset.left;
    const moOffsetY = mo.y + mo.offset.top;
    const moOffsetWidth = mo.width - mo.offset.left - mo.offset.right;
    const moOffsetHeight = mo.height - mo.offset.top - mo.offset.bottom;
    return (
      offsetX + offsetWidth > moOffsetX &&
      offsetY + offsetHeight > moOffsetY &&
      offsetX < moOffsetX + moOffsetWidth &&
      offsetY < moOffsetY + moOffsetHeight
    );
  }

  /**
   * Reduces the object's energy when taking damage.
   * Applies damage delay and updates the energy status bar.
   *
   * @param {number} damage - Amount of energy to subtract.
   */
  takeDamage(damage) {
    if (!controlEnabled) return;
    if (this.isHurt()) return;
    this.energy = Math.max(0, this.energy - damage);
    this.updateStatusbar("energy");
    this.lastHit = new Date().getTime();
    if (this.energy == 0) {
      this.isDead();
    }
  }

  /**
   * Restores energy by a given amount, up to a maximum of 100.
   *
   * @param {number} amount - Amount of energy to restore.
   */
  recoverEnergy(amount) {
    this.energy = Math.min(100, this.energy + amount);
    this.updateStatusbar("energy");
  }

  /**
   * Checks if the object is currently in a hurt state (i.e., recently damaged).
   *
   * @returns {boolean} True if within invincibility/hurt timeout.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  /**
   * Checks whether the object has no remaining energy.
   *
   * @returns {boolean} True if the object is dead.
   */
  isDead() {
    return this.energy <= 0;
  }

  /**
   * Collects a coin and updates the coin status bar.
   * If max coin count is reached, restores some energy.
   */
  collectCoin() {
    this.coins++;
    this.updateStatusbar("coin");
    if (this.coins >= this.world.coinStatusbar.maxCoins) {
      this.recoverEnergy(20);
      this.coins = 0;
      this.updateStatusbar("coin");
      audioList.energyRecovery.play();
    } else {
      audioList.coinCollected.play();
    }
  }

  /**
   * Collects a bottle and updates the bottle status bar.
   */
  collectBottle() {
    this.bottles++;
    this.updateStatusbar("bottle");
    audioList.bottleCollected.play();
  }

  /**
   * Updates the appropriate status bar based on the type.
   *
   * @param {"energy"|"coin"|"bottle"} type - Type of status bar to update.
   */
  updateStatusbar(type) {
    if (type === "energy") {
      this.world.energyStatusbar.setPercentage(this.energy);
    } else if (type === "coin") {
      const coinPercentage = (this.coins / this.world.coinStatusbar.maxCoins) * 100;
      this.world.coinStatusbar.setPercentage(coinPercentage);
    } else if (type === "bottle") {
      const bottlePercentage = (this.bottles / this.world.bottleStatusbar.maxBottles) * 100;
      this.world.bottleStatusbar.setPercentage(bottlePercentage);
    }
  }
}
