/**
 * Represents a small enemy chicken that moves from right to left and can be defeated by the player.
 *
 * Inherits from {@link MovableObject} and includes behavior for walking, dying, and transforming into a ghost.
 */
class SmallChicken extends MovableObject {
  /**
   * @property {number} height - Height of the chicken sprite.
   * @property {number} width - Width of the chicken sprite.
   * @property {boolean} isDead - Indicates whether the chicken is dead.
   * @property {string[]} IMAGES_WALKING - Paths to walking animation frames.
   * @property {string} IMAGE_DEAD - Path to the dead chicken image.
   * @property {string} IMAGE_GHOST - Path to the ghost image that appears after death.
   * @property {{top: number, left: number, right: number, bottom: number}} offset - Collision box offset.
   */
  height = 40;
  width = 30;
  isDead = false;
  IMAGES_WALKING = [
    "assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];
  IMAGE_DEAD = "assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png";
  IMAGE_GHOST = "assets/img/3_enemies_chicken/chicken_ghost.png";
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  /**
   * Creates a new `SmallChicken` instance at a specific position with a given speed.
   *
   * @param {number} x - Initial X position.
   * @param {number} y - Initial Y position.
   * @param {number} speed - Movement speed to the left.
   */
  constructor(x, y, speed) {
    super().loadImage("assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.loadImages(this.IMAGES_WALKING);
    this.animate();
  }

  /**
   * Starts movement and animation intervals for walking and sound playback.
   * The chicken continuously moves left and plays walking animation frames.
   */
  animate() {
    this.animationIntervals["smallChickenMovesLeft"] = setInterval(() => {
      this.moveLeft();
      if (!this.isDead) audioList.chicken.play();
    }, 1000 / 60);
    this.animationIntervals["smallChickenPlayAnimation"] = setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 1000 / 6);
  }

  /**
   * Marks the chicken as dead, stops movement and animation,
   * switches to the dead sprite, and schedules ghost transformation.
   */
  markAsDead() {
    audioList.jumpOnChicken.shouldPlay = true;
    audioList.jumpOnChicken.play();
    this.isDead = true;
    this.stopAnimation("smallChickenMovesLeft");
    this.stopAnimation("smallChickenPlayAnimation");
    this.loadImage(this.IMAGE_DEAD);
    setTimeout(() => {
      this.setGhostAnimation();
      this.checkGhostPosition();
    }, 1000);
  }

  /**
   * Switches the sprite to a ghost, applies upward motion using gravity,
   * and plays ghost sound effects.
   */
  setGhostAnimation() {
    audioList.jumpOnChicken.stop();
    audioList.chicken.stop();
    this.loadImage(this.IMAGE_GHOST);
    this.speedY = -0.1;
    this.acceleration = -1;
    this.applyGravity();
    audioList.ghost.shouldPlay = true;
    audioList.ghost.play();
  }

  /**
   * Starts a recurring check to determine if the ghost has left the visible screen.
   * If so, the chicken is removed from the current level.
   */
  checkGhostPosition() {
    this.removalCheckInterval = setInterval(() => {
      if (this.y + this.height < 0) {
          this.removeFromLevel();
          clearInterval(this.removalCheckInterval);
          audioList.ghost.stop();
        }
    }, 1000 / 30);
  }

  /**
   * Removes the chicken from the current level's enemy array if present.
   */
  removeFromLevel() {
    if (world && world.level && Array.isArray(world.level.enemies)) {
      let index = world.level.enemies.indexOf(this);
      if (index !== -1) world.level.enemies.splice(index, 1);
    }
  }
}