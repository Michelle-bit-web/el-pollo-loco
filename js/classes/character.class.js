/**
 * Represents the main playable character (Pepe) in the game.
 * Inherits from `MovableObject` and handles player movement, animation states, sound effects, and interactions with the game world.
 */
class Character extends MovableObject {
  /** @type {number} Character's height */
  height = 280;

  /** @type {number} Character's movement speed */
  speed = 15;

  /** @type {number} Vertical position offset for start */
  y = 155;

  /** @type {boolean} Indicates if dying animation is currently playing */
  isPlayingDyingAnimation = false;

  /** @type {number} Sombrero vertical offset */
  sombreroY = 0;

  /** @type {number} Sombrero horizontal offset */
  sombreroX = 0;

  /** @type {number} Direction in which the sombrero flies (1 or -1) */
  sombreroDirection = 1;

  /** @type {boolean} Flag indicating if the dying animation has already been played */
  dyingAnimationPlayed = false;

  /** @type {string[]} Idle animation image paths */
  IMAGES_IDLE = [
    "assets/img/2_character_pepe/1_idle/idle/I-1.png",
    "assets/img/2_character_pepe/1_idle/idle/I-2.png",
    "assets/img/2_character_pepe/1_idle/idle/I-3.png",
    "assets/img/2_character_pepe/1_idle/idle/I-4.png",
    "assets/img/2_character_pepe/1_idle/idle/I-5.png",
    "assets/img/2_character_pepe/1_idle/idle/I-6.png",
    "assets/img/2_character_pepe/1_idle/idle/I-7.png",
    "assets/img/2_character_pepe/1_idle/idle/I-8.png",
    "assets/img/2_character_pepe/1_idle/idle/I-9.png",
    "assets/img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  /** @type {string[]} Long idle animation image paths for being away from keyboard */
  IMAGES_IDLE_LONG = [
    "assets/img/2_character_pepe/1_idle/long_idle/I-11.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-12.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-13.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-14.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-15.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-16.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-17.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-18.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-19.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  /** @type {string[]} Walking animation image paths */
  IMAGES_WALKING = [
    "assets/img/2_character_pepe/2_walk/W-21.png",
    "assets/img/2_character_pepe/2_walk/W-22.png",
    "assets/img/2_character_pepe/2_walk/W-23.png",
    "assets/img/2_character_pepe/2_walk/W-24.png",
    "assets/img/2_character_pepe/2_walk/W-25.png",
    "assets/img/2_character_pepe/2_walk/W-26.png",
  ];

  /** @type {string[]} Jumping animation image paths */
  IMAGES_JUMPING = [
    "assets/img/2_character_pepe/3_jump/J-31.png",
    "assets/img/2_character_pepe/3_jump/J-32.png",
    "assets/img/2_character_pepe/3_jump/J-33.png",
    "assets/img/2_character_pepe/3_jump/J-34.png",
    "assets/img/2_character_pepe/3_jump/J-35.png",
    "assets/img/2_character_pepe/3_jump/J-36.png",
    "assets/img/2_character_pepe/3_jump/J-37.png",
    "assets/img/2_character_pepe/3_jump/J-38.png",
    "assets/img/2_character_pepe/3_jump/J-39.png",
  ];

  /** @type {string[]} Hurt animation image paths */
  IMAGES_HURT = [
    "assets/img/2_character_pepe/4_hurt/H-41.png",
    "assets/img/2_character_pepe/4_hurt/H-42.png",
    "assets/img/2_character_pepe/4_hurt/H-43.png",
  ];

  /** @type {string[]} Dying animation image paths */
  IMAGES_DYING = [
    "assets/img/2_character_pepe/5_dead/D-51.png",
    "assets/img/2_character_pepe/5_dead/D-52.png",
    "assets/img/2_character_pepe/5_dead/D-53.png",
    "assets/img/2_character_pepe/5_dead/D-54.png",
    "assets/img/2_character_pepe/5_dead/D-55.png",
    "assets/img/2_character_pepe/5_dead/D-56.png",
    "assets/img/2_character_pepe/5_dead/D-57.png",
  ];

  /** @type {string[]} RIP image paths shown after death */
  IMAGES_RIP = ["assets/img/2_character_pepe/5_dead/rip.png", "assets/img/2_character_pepe/5_dead/sombrero.png"];

  /**
   * Defines the collision box offset for more accurate hit detection.
   * @type {{top: number, left: number, right: number, bottom: number}}
   */
  offset = {
    top: 140,
    left: 45,
    right: 47,
    bottom: 13,
  };

  /**
   * Creates a new character instance and initializes animations and gravity.
   * @param {World} world - The game world the character belongs to.
   */
  constructor(world) {
    super().loadImage("assets/img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_IDLE_LONG);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DYING);
    this.loadImages(this.IMAGES_RIP);
    this.world = world;
    this.animate();
    this.applyGravity();
    this.lastTimeMoved = new Date().getTime();
  }

  /** Initializes all animation intervals. */
  animate() {
    this.setMovingInterval();
    this.setAnimationInterval();
  }

  /** Handles movement controls and camera focus, updated on a regular interval. */
  setMovingInterval() {
    this.animationIntervals["movement"] = setInterval(() => {
      this.moveCharacterRight();
      this.moveCharacterLeft();
      this.letCharacterJump();
      this.cameraFocusOncharacter();
    }, 1000 / 30);
  }

  /** Moves the character to the right if the right arrow key is pressed. */
  moveCharacterRight() {
    if (this.world.keyboard.RIGHT && this.x < this.world.level.levelEndX) {
      this.moveRight();
      this.otherDirection = false;
      audioList.walking.shouldPlay = true;
      audioList.walking.play();
      this.lastTimeMoved = new Date().getTime();
    }
  }

  /** Moves the character to the left if the left arrow key is pressed. */
  moveCharacterLeft() {
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      audioList.walking.shouldPlay = true;
      audioList.walking.play();
      this.lastTimeMoved = new Date().getTime();
    }
  }

  /** Makes the character jump if space is pressed and character is on the ground. */
  letCharacterJump() {
    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
      audioList.walking.stop();
      audioList.jump.play();
      this.lastTimeMoved = new Date().getTime();
    }
  }

  /** Adjusts the camera to follow the character unless in fight scene. */
  cameraFocusOncharacter() {
    if (!this.world.fightScene) {
      this.world.camera_x = -this.x + 100;
    }
  }

  /** Sets up intervals for animation state checking and idle sound logic. */
  setAnimationInterval() {
    this.animationIntervals["animation"] = setInterval(() => {
      this.checkCharacterStatus();
    }, 200);
    this.animationIntervals["dying"] = setInterval(() => {
      this.checkDeadStatus();
    }, 1000 / 30);
    this.animationIntervals["idleSoundLogic"] = setInterval(() => {
      if (this.checkMovementStatus()) {
        this.checkIdleStatus();
      } else {
        this.stopIdleSoundLogic();
      }
    }, 300);
  }

  /** Checks the character’s current status and plays appropriate animations and sounds. */
  checkCharacterStatus() {
    if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
      audioList.characterHurt.play();
    } else if (this.isAboveGround()) {
      this.playAnimation(this.IMAGES_JUMPING);
    } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
    } else if (this.checkMovementStatus()) {
      this.playIdleAnimation();
    } else {
      this.loadImage("assets/img/2_character_pepe/2_walk/W-21.png");
    }
  }

  /** Handles dying animation and transition to RIP image. */
  checkDeadStatus() {
    if (this.isDead() && !this.isPlayingDyingAnimation && !this.dyingAnimationPlayed) {
      this.isPlayingDyingAnimation = true;
      this.playDyingAnimationThenRip();
    }
  }

  /** Sequentially plays all dying frames, then calls RIP handler. */
  playDyingAnimationThenRip() {
    let i = 0;
    const dyingImages = this.IMAGES_DYING;
    this.animationIntervals["dyingAnimation"] = setInterval(() => {
      if (i < dyingImages.length) {
        this.img = this.imageCache[dyingImages[i]];
        i++;
      } else {
        this.prepareForRipAnimation();
      }
    }, 100);
  }

  /** Cleans up dying animation and starts the RIP animation. */
  prepareForRipAnimation() {
    this.dyingAnimationPlayed = true;
    clearInterval(this.animationIntervals["dyingAnimation"]);
    clearInterval(this.animationIntervals["animation"]);
    audioList.characterDead.play();
    this.handleRipAnimation();
  }

  /** Loads the RIP image and starts the sombrero falling effect. */
  handleRipAnimation() {
    if (this.otherDirection) {
      this.otherDirection = false;
    }
    this.loadImage("assets/img/2_character_pepe/5_dead/rip.png");
    this.height = 120;
    this.width = 70;
    this.y = 0;
    this.setRipFallingInterval();
    audioList.onLanding.play();
  }

  /**
   * Checks if the player is currently idle (not pressing any movement keys).
   * @returns {boolean} Whether the character is idle.
   */
  checkMovementStatus() {
    return (
      !this.world.keyboard.RIGHT &&
      !this.world.keyboard.LEFT &&
      !this.world.keyboard.SPACE &&
      !this.world.keyboard.THROW
    );
  }

  /** Checks how long the character has been idle and plays idle or snoring sounds. */
  checkIdleStatus() {
    const pastTime = (new Date().getTime() - this.lastTimeMoved) / 1000;
    if (pastTime > 10) {
      if (!audioList.snoring.isPlaying()) {
        this.playSnoringSound();
      }
    } else if (pastTime > 5) {
      if (!audioList.idle.isPlaying()) {
        this.playIdleSound();
      }
    }
  }

  /** Plays snoring sound effect if idle long enough. */
  playSnoringSound() {
    audioList.idle.stop();
    audioList.snoring.shouldPlay = true;
    audioList.snoring.play();
  }

  /** Plays idle sound effect after a few seconds of inactivity. */
  playIdleSound() {
    audioList.snoring.stop();
    audioList.idle.shouldPlay = true;
    audioList.idle.play();
  }

  /** Stops idle and snoring sound effects. */
  stopIdleSoundLogic() {
    audioList.idle.stop();
    audioList.snoring.stop();
  }

  /** Animates the RIP image falling down to the ground. */
  setRipFallingInterval() {
    this.animationIntervals["fallInterval"] = setInterval(() => {
      if (this.y + this.height < 420) {
        this.y += 5;
      } else {
        clearInterval(this.animationIntervals["fallInterval"]);
      }
    }, 1000 / 60);
  }

  /** Plays the correct idle animation depending on how long the character was inactive. */
  playIdleAnimation() {
    let pastTime = new Date().getTime() - this.lastTimeMoved;
    pastTime = pastTime / 1000;
    if (pastTime > 10) {
      this.playAnimation(this.IMAGES_IDLE_LONG);
    } else {
      this.playAnimation(this.IMAGES_IDLE);
    }
  }

  /**
   * Helper to draw an image directly on the canvas.
   * @param {string} imagePath - Path to the image file.
   * @param {number} x - X-position on canvas.
   * @param {number} y - Y-position on canvas.
   * @param {number} width - Image width.
   * @param {number} height - Image height.
   */
  drawImage(imagePath, x, y, width, height) {
    const img = new Image();
    img.src = imagePath;
    img.onload = () => {
      this.ctx.drawImage(img, x, y, width, height);
    };
  }
}