/**
 * Represents a throwable salsa bottle in the game.
 *
 * The object is thrown in a direction and plays rotation and splash animations.
 * It also handles sound effects and automatic removal after splashing.
 *
 * Inherits from {@link MovableObject}.
 */
class ThrowableObject extends MovableObject {
  /**
   * @property {string[]} IMAGES_ROTATION - Image sequence used while the bottle is flying (rotation effect).
   * @property {string[]} IMAGES_SPLASH - Image sequence used for the splash animation on impact.
   * @property {boolean} otherDirection - Indicates if the object moves left (true) or right (false).
   * @property {boolean} remove - Set to true when the object should be removed from the world.
   * @property {boolean} isSplashing - Whether the splash animation is currently active.
   * @property {number} rotationIndex - Tracks the current frame in the rotation animation.
   * @property {number} fadeOutOpacity - Current opacity value during fade-out effect (1 to 0).
   * @property {Object} world - Reference to the current game world context.
   */
  IMAGES_ROTATION = [
    "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];
  IMAGES_SPLASH = [
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /**
   * Creates a new throwable object instance (salsa bottle) at the given position.
   * Starts flying immediately upon creation.
   *
   * @param {number} x - The horizontal position to throw from.
   * @param {number} y - The vertical position to throw from.
   * @param {boolean} otherDirection - Whether the object moves left (true) or right (false).
   * @param {Object} world - The game world context where this object lives.
   */
  constructor(x, y, otherDirection, world) {
    super();
    this.loadImage("assets/img/7_statusbars/3_icons/icon_salsa_bottle.png");
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x + 60;
    this.y = y + 40;
    this.otherDirection = otherDirection;
    this.throw();
    this.height = 70;
    this.width = 70;
    this.remove = false;
    this.isSplashing = false;
    this.world = world;
    this.rotationIndex = 0;
  }

  /**
   * Initiates the throwing motion: applies upward speed, gravity,
   * rotation animation, interval movement, and sound effect.
   */
  throw() {
    this.speedY = 20;
    this.applyGravity();
    this.startFlyingAnimation();
    this.setThrowingInterval();
    this.playThrowingSound();
  }

  /**
   * Sets an interval to continuously move the object horizontally,
   * depending on its direction.
   */
  setThrowingInterval() {
    this.animationIntervals["throwInterval"] = setInterval(() => {
      if (this.isSplashing) return;
      if (this.otherDirection) {
        this.x -= 10;
      } else {
        this.x += 10;
      }
    }, 25);
  }

  /**
   * Plays the sound associated with throwing a bottle.
   * Only plays if the game is not muted.
   */
  playThrowingSound() {
    if (!AudioManager.isMuted) {
      audioList.throw.play();
    }
  }

  /**
   * Starts the rotation animation using the IMAGES_ROTATION sequence.
   */
  startFlyingAnimation() {
    this.animationIntervals["rotationBottleInterval"] = setInterval(() => {
      if (this.isSplashing) return;
      this.playAnimation(this.IMAGES_ROTATION);
      this.rotationIndex = (this.rotationIndex + 1) % this.IMAGES_ROTATION.length;
    }, 100);
  }

  /**
   * Triggers the splash animation and sound, then begins the fade-out process.
   */
  splash() {
    if (this.isSplashing) return;
    this.isSplashing = true;
    this.playSplashSound();
    clearInterval(this.animationIntervals["rotationBottleInterval"]);
    clearInterval(this.animationIntervals["throwInterval"]);
    this.playAnimation(this.IMAGES_SPLASH);
    this.setFadeOutDelay();
  }

  /**
   * Plays sound effects for the bottle splash and break.
   */
  playSplashSound() {
    audioList.bottleBreaks.play();
    audioList.bottleSplash.play();
  }

  /**
   * Delays the start of the fade-out after the splash animation.
   */
  setFadeOutDelay() {
    setTimeout(() => {
      this.fadeOutOpacity = 1;
      this.startFadeOut();
    }, 500);
  }

  /**
   * Starts the fade-out process and removes the object from the world's throwableObjects list.
   */
  startFadeOut() {
    this.setFadeOutInterval();
    this.world.throwableObjects.splice(0, 1);
  }

  /**
   * Gradually decreases the object's opacity until it becomes invisible,
   * then marks it for removal.
   */
  setFadeOutInterval() {
    this.animationIntervals["fadeoutInterval"] = setInterval(() => {
      this.fadeOutOpacity -= 0.05;
      if (this.fadeOutOpacity <= 0) {
        this.remove = true;
        clearInterval(this.animationIntervals["fadeoutInterval"]);
      }
    }, 50);
  }
}