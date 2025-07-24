/**
 * Represents a Chicken enemy in the game.
 * The chicken walks left continuously and can be marked as dead,
 * after which it plays a death animation followed by a ghost rising animation.
 *
 * Inherits from MovableObject.
 */
class Chicken extends MovableObject {
  /**
   * The height of the chicken sprite in pixels.
   * @type {number}
   */
  height = 70;

  /**
   * The width of the chicken sprite in pixels.
   * @type {number}
   */
  width = 50;

  /**
   * Whether the chicken has been marked as dead.
   * @type {boolean}
   */
  isDead = false;

  /**
   * Whether the ghost version is currently fading away.
   * @type {boolean}
   */
  isFading = false;

  /**
   * Paths to the walking animation frames.
   * @type {string[]}
   */
  IMAGES_WALKING = [
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  /**
   * Path to the dead chicken image.
   * @type {string}
   */
  IMAGE_DEAD = "assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png";

  /**
   * Path to the ghost image shown after the chicken dies.
   * @type {string}
   */
  IMAGE_GHOST = "assets/img/3_enemies_chicken/chicken_ghost.png";

  /**
   * Offset values for the chicken's hitbox.
   * @type {{ top: number, left: number, right: number, bottom: number }}
   */
  offset = {
    top: 8,
    left: 5,
    right: 10,
    bottom: 10,
  };

  /**
   * Creates a new Chicken instance at the given position with the given speed.
   * @param {number} x - The x-coordinate of the chicken's position.
   * @param {number} y - The y-coordinate of the chicken's position.
   * @param {number} speed - The speed at which the chicken moves left.
   */
  constructor(x, y, speed) {
    super().loadImage("assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.loadImages(this.IMAGES_WALKING);
    this.animate();
  }

  /**
   * Starts the movement and animation intervals for the chicken.
   * The chicken moves left and plays walking animation frames.
   */
  animate() {
    this.animationIntervals["ChickenMovesLeft"] = setInterval(() => {
        this.moveLeft();
        if (!this.isDead) {
            audioList.chicken.play();
        };
    }, 1000 / 60);

    this.animationIntervals["ChickenPlayAnimation"] = setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 1000 / 6);
  }

  /**
   * Marks the chicken as dead, plays death animation and transitions to ghost.
   * Removes walking and animation intervals.
   */
  markAsDead() {
    audioList.jumpOnChicken.shouldPlay = true;
    audioList.jumpOnChicken.play();
    this.isDead = true;
    this.stopAnimation("ChickenMovesLeft");
    this.stopAnimation("ChickenPlayAnimation");
    this.loadImage(this.IMAGE_DEAD);
    setTimeout(() => {
      audioList.jumpOnChicken.stop();
      audioList.chicken.stop();
      this.startGhostAnimation();
      this.checkGhostPosition();
    }, 1000);
  }

  /**
   * Starts the ghost animation after death, making the ghost float upwards.
   * Gravity is applied in reverse to simulate upward motion.
   */
  startGhostAnimation() {
    this.loadImage(this.IMAGE_GHOST);
    this.speedY = -10;
    this.acceleration = -1;
    this.applyGravity();
    audioList.ghost.shouldPlay = true;
    audioList.ghost.play();
  }

  /**
   * Checks continuously whether the ghost has floated off-screen.
   * If so, the chicken is removed from the level.
   */
  checkGhostPosition() {
    this.removalCheckInterval = setInterval(() => {
        if (this.y + this.height < 0) {
            this.removeFromLevel();
            clearInterval(this.removalCheckInterval);
            audioList.ghost.stop();
        };
    }, 1000 / 30);
  }

  /**
   * Removes the chicken from the level's enemies array.
   */
  removeFromLevel() {
    if (world && world.level && Array.isArray(world.level.enemies)) {
        const index = world.level.enemies.indexOf(this);
        if (index !== -1) {
            world.level.enemies.splice(index, 1);
        };
    };
  }
}