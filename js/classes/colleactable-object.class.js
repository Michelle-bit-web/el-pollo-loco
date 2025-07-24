/**
 * Represents a collectable item in the game, such as coins or bottles.
 * Each collectable has a specific type that determines its image, size, and behavior.
 *
 * Inherits from MovableObject.
 */
class CollectableObject extends MovableObject {
  /**
   * Type of the collectable (e.g., "coin", "bottle", "bottleGround").
   * @type {string}
   */
  imageType;

  /**
   * Array of coin animation frames.
   * @type {string[]}
   */
  IMAGES_COIN = ["assets/img/8_coin/coin_1.png", "assets/img/8_coin/coin_2.png"];

  /**
   * Image for a single bottle.
   * @type {string}
   */
  IMAGE_BOTTLE = "assets/img/7_statusbars/3_icons/icon_salsa_bottle.png";

  /**
   * Array of bottle-on-ground images.
   * @type {string[]}
   */
  IMAGE_BOTTLE_GROUND = [
    "assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  /**
   * Creates a new CollectableObject at a given position and of a given type.
   * Sets the appropriate image(s), size, and optional animation based on the type.
   *
   * @param {string} imageType - Type of the collectable ("coin", "bottle", "bottleGround").
   * @param {number} x - The initial x-coordinate.
   * @param {number} y - The initial y-coordinate.
   */
  constructor(imageType, x, y) {
    super();
    this.y = y;
    this.imageType = imageType;
    this.x = this.setXValue(x);
    this.getImageType();
  }

  /**
   * Adjusts the x-coordinate based on the image type.
   * "bottleGround" gets a random offset to spread bottles along the level.
   *
   * @param {number} x - Base x-coordinate.
   * @returns {number} - Possibly adjusted x-coordinate.
   */
  setXValue(x) {
    if (this.imageType === "bottleGround") {
      return x + Math.random() * 300;
    } else {
      return x;
    }
  }

  /**
   * Loads the appropriate image(s), sets size, and starts animation if needed
   * based on the collectable's type.
   */
  getImageType() {
    if (this.imageType == "coin") {
      this.setSize(130, 130);
      this.loadImages(this.IMAGES_COIN);
      this.loadImage(this.IMAGES_COIN[0]);
      this.animate();
    } else if (this.imageType == "bottle") {
      this.setSize(70, 70);
      this.loadImage(this.IMAGE_BOTTLE);
    } else if (this.imageType == "bottleGround") {
      this.setSize(70, 70);
      this.loadImage(this.IMAGE_BOTTLE_GROUND[0]);
    }
  }

  /**
   * Sets the size of the collectable object.
   *
   * @param {number} height - Height in pixels.
   * @param {number} width - Width in pixels.
   */
  setSize(height, width) {
    this.height = height;
    this.width = width;
  }

  /**
   * Starts the animation for animated collectables like coins.
   */
  animate() {
    this.animationIntervals["collectableAnimation"] = setInterval(() => {
      this.playAnimation(this.IMAGES_COIN);
    }, 400);
  }
}