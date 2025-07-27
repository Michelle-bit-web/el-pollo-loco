/**
 * Represents the final boss enemy in the game.
 *
 * The Endboss class extends `MovableObject` and manages the boss's states, animations,
 * energy, and interactions with the player character. It includes behavior for
 * walking, attacking, reacting to damage, and dying.
 *
 * @extends MovableObject
 */
class Endboss extends MovableObject {
  /** @property {World} world - Reference to the game world. */
  world;

  /** @property {number} height - Height of the boss sprite. */
  height = 400;

  /** @property {number} width - Width of the boss sprite. */
  width = 250;

  /** @property {number} y - Vertical position of the boss. */
  y = 60;

  /** @property {number} energy - Current energy/health level of the boss. */
  energy = 100;

  /** @property {Statusbar} statusbar - UI element displaying boss's energy. */
  statusbar;

  /** @property {boolean} isBeingHit - Whether the boss is currently being hit. */
  isBeingHit = false;

  /** @property {boolean} dead - Whether the boss is dead. */
  dead = false;

  /** @property {boolean} firstContactCharacter - Whether the boss has made first contact with the character. */
  firstContactCharacter = false;

  /** @property {number} totalContacts - Total frames since the first contact began.*/
  totalContacts = 0;

  /** @property {number} speed - Movement speed of the boss. */
  speed = 2;

  /** @property {number} speedLevel - Current speed level (used to scale difficulty). */
  speedLevel = 1;

  /** @property {boolean} isJumping - Indicates if the boss is currently jumping. */
  isJumping = false;

  /** @property {boolean} walkTowardsCharacter - Flag to control delayed movement logic. */
  walkTowardsCharacter = false;

  /** @property {string[]} IMAGES_WALKING - Image paths for the walking animation. */
  IMAGES_WALKING = [
    "assets/img/4_enemie_boss_chicken/1_walk/G1.png",
    "assets/img/4_enemie_boss_chicken/1_walk/G2.png",
    "assets/img/4_enemie_boss_chicken/1_walk/G3.png",
    "assets/img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  /** @property {string[]} IMAGES_ALERT - Image paths for the alert (pre-fight) animation.*/
  IMAGES_ALERT = [
    "assets/img/4_enemie_boss_chicken/2_alert/G5.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G6.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G7.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G8.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G9.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G10.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G11.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  /** @property {string[]} IMAGES_ATTACK - Image paths for the attack animation. */
  IMAGES_ATTACK = [
    "assets/img/4_enemie_boss_chicken/3_attack/G13.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G14.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G15.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G16.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G17.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G18.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G19.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  /** @property {string[]} IMAGES_HURT - Image paths for the hurt animation. */
  IMAGES_HURT = [
    "assets/img/4_enemie_boss_chicken/4_hurt/G21.png",
    "assets/img/4_enemie_boss_chicken/4_hurt/G22.png",
    "assets/img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  /** @property {string[]} IMAGES_DEAD - Image paths for the death animation. */
  IMAGES_DEAD = [
    "assets/img/4_enemie_boss_chicken/4_hurt/G21.png",
    "assets/img/4_enemie_boss_chicken/4_hurt/G22.png",
    "assets/img/4_enemie_boss_chicken/4_hurt/G23.png",
    "assets/img/4_enemie_boss_chicken/5_dead/G24.png",
    "assets/img/4_enemie_boss_chicken/5_dead/G25.png",
    "assets/img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  /** @property {string[]} IMAGES_DIZY - Image paths for the temporary dizzy animation after being hit. */
  IMAGES_DIZY = ["assets/img/4_enemie_boss_chicken/4_hurt/G23.png"];

  /** @property {object} offset - Collision box offset (top, left, right, bottom).*/
  offset = {
    top: 80,
    left: 40,
    right: 40,
    bottom: 40,
  };

  /**
   * Creates an instance of the Endboss.
   * Loads images and starts the animation loop.
   *
   * @param {number} x - Initial horizontal position of the boss.
   */
  constructor(x) {
    super().loadImage("assets/img/4_enemie_boss_chicken/1_walk/G1.png");
    this.x = x;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DIZY);
    this.loadImages(this.IMAGES_DEAD);
    this.animate();
  }

  /**
   * Starts the main animation loop which updates the current animation
   * depending on the boss state (idle, attack, hurt, etc.).
   */
  animate() {
    this.animationIntervals.endbossInterval = setInterval(() => {
      if (this.energy <= 0) return;
      this.chooseRightAnimation();
    }, 100);
  }

  /**
   * Decides which animation to play based on the boss's state.
   */
  chooseRightAnimation() {
    if (this.energy <= 0) return;
    if (this.isBeingHit) {
      this.hurtAnimation();
    } else if (this.firstContactCharacter && this.totalContacts > 30) {
      this.attackAnimation();
    } else if (this.firstContactCharacter) {
      this.handleFirstContact();
      this.totalContacts++;
      this.updateSpeedBasedOnEnergy();
    } else {
      this.walkingAnimation();
    }
  }

  /**
   * Handles first contact with the player character.
   * Initializes the status bar and switches to alert animation.
   */
  handleFirstContact() {
    audioList.gamePlay.stop();
    audioList.chicken.stop();
    this.statusbar = new Statusbar("energyEndboss", 500, 5);
    this.x = 2500;
    this.playAnimation(this.IMAGES_ALERT);
  }

  /**
   * Adjusts boss speed and behavior based on current energy level.
   * Triggers jump if energy is low and speed level conditions are met.
   */
  updateSpeedBasedOnEnergy() {
    if (this.energy >= 10 && this.energy <= 40 && this.speedLevel == 2 && !this.isJumping) {
      this.letEndbossJump();
    } else if (this.energy <= 80) {
      this.speedLevel = 2;
      this.speedUpEndboss();
      this.moveTowardCharacter();
    } else {
      this.moveTowardCharacter();
    }
  }

  /**
   * Increases speed, initiates jump and movement toward character.
   */
  letEndbossJump() {
    this.speedUpEndboss();
    this.jump();
    this.isJumping = true;
    this.moveTowardCharacter();
  }

  /**
   * Increases the boss's movement speed slightly.
   */
  speedUpEndboss() {
    this.speed += 0.2;
  }

  /**
   * Makes the boss jump by setting a vertical speed and applying gravity.
   */
  jump() {
    if (!this.isJumping) {
      this.isJumping = true;
      this.speedY = 30;
      this.applyGravity();
    }
  }

  /**
   * Triggers a jump in the player character when the boss lands.
   */
  onLand() {
    this.world.character.jump(35);
  }

  /**
   * Plays the dizzy animation and triggers the hurt animation afterwards.
   */
  hurtAnimation() {
    this.setDizyInterval();
    this.resetHurtStatus();
  }

  /**
   * Plays the dizzy animation in a short interval loop.
   * Also plays hurt sound.
   */
  setDizyInterval() {
    let frameCount = 0;
    const dizyInterval = setInterval(() => {
      audioList.endbossHurt.play();
      this.playAnimation(this.IMAGES_DIZY);
      // frameCount++;
      // if (frameCount >= 5) {
        clearInterval(dizyInterval);
      // }
    }, 500);
  }

  /**
   * Resets the `isBeingHit` flag and plays the hurt animation after a short delay.
   */
  resetHurtStatus() {
    setTimeout(() => {
      audioList.endbossHurt.play();
      this.playAnimation(this.IMAGES_HURT);
      this.isBeingHit = false;
    }, 200);
  }

  /**
   * Plays the attack animation and moves toward the player if boss is still alive.
   */
  attackAnimation() {
    if (this.energy <= 0) {
      this.stopAllAnimations();
      return;
    }
    this.moveTowardCharacter();
    this.playAnimation(this.IMAGES_ATTACK);
  }

  /**
   * Plays the walking animation and makes the boss move left and right within bounds.
   */
  walkingAnimation() {
    this.playAnimation(this.IMAGES_WALKING);
    if (!this.otherDirection) {
      this.moveLeft();
      if (this.x <= 2400) {
        this.otherDirection = true;
      }
    } else {
      this.moveRight();
      if (this.x >= 2700) {
        this.otherDirection = false;
      }
    }
  }

  /**
   * Plays the death animation in a timed interval and stops the fight scene when finished.
   */
  setDeadInterval() {
    let frameCount = 0;
    audioList.chickenDead.play();
    const deadInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_DEAD);
      frameCount++;
      if (frameCount >= 3  ) {
        clearInterval(deadInterval);
        this.loadImage("assets/img/4_enemie_boss_chicken/5_dead/G26.png");
        this.world.fightScene = false;
      }
    }, 200);
  }

  /**
   * Reduces the boss's energy by a specified amount and triggers hurt/death logic.
   *
   * @param {number} amount - The amount of damage to apply.
   */
  takeDamage(amount) {
    this.energy -= amount;
    if (this.energy <= 0) {
      this.dead = true;
      clearInterval(this.animationIntervals.endbossInterval);
      this.setDeadInterval();
    }
    if (this.statusbar) {
      const percentage = (this.energy / 100) * 100;
      this.statusbar.setPercentage(percentage);
      audioList.endbossHurt.play();
      this.hurtAnimation();
    }
  }

  /**
   * Moves the boss toward the player's character.
   * Applies a delay and prevents rapid re-triggering via a flag.
   */
  moveTowardCharacter() {
    if (!this.walkTowardsCharacter && this.world.character.x >= this.x) {
      this.setDelayOnMovingRight();
    } else if (!this.walkTowardsCharacter) {
      this.setDelayOnMovingLeft();
    }
    this.walkTowardsCharacter = true;
    setTimeout(() => {
      this.walkTowardsCharacter = false;
    }, 4000);
  }

  /**
   * Delays movement to the right and flips the direction flag.
   */
  setDelayOnMovingRight() {
    setTimeout(() => {
      this.moveRight();
      this.otherDirection = true;
    }, 1000);
  }

  /**
   * Delays movement to the left and flips the direction flag.
   */
  setDelayOnMovingLeft() {
    setTimeout(() => {
      this.moveLeft()
      this.otherDirection = false;
    }, 1000);
  }

  /**
   * Flags the boss as currently being hit.
   */
  hit() {
    this.isBeingHit = true;
  }
}
