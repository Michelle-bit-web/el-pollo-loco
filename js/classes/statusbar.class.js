/**
 * Represents a status bar (UI element) that displays progress or quantity information
 * for energy, coins, bottles, or the endboss's energy.
 *
 * Extends {@link DrawableObject} and uses preloaded image assets to visually reflect
 * percentage-based values.
 */
class Statusbar extends DrawableObject {
  /**
   * @property {number} percentage - Current fill percentage of the status bar (0–100).
   * @property {number} bottle - Current number of collected bottles (for internal tracking).
   * @property {number} coins - Current number of collected coins (for internal tracking).
   * @property {string} type - Type of status bar: "energy", "coin", "bottle", or "energyEndboss".
   * @property {string[]} images - Image paths corresponding to the current type and percentage.
   * @property {number} maxCoins - Maximum number of coins before a reward is triggered.
   * @property {number} maxBottles - Maximum number of bottles that can be collected.
   * @property {string[]} IMAGES_ENERGY - Image paths for the player’s energy status bar.
   * @property {string[]} IMAGES_COIN - Image paths for the coin status bar.
   * @property {string[]} IMAGES_BOTTLE - Image paths for the bottle status bar.
   * @property {string[]} IMAGES_ENERGY_ENDBOSS - Image paths for the endboss energy status bar.
   */
  percentage = 0;
  bottle = 0;
  coins = 0;
  type;
  images;
  maxCoins = 9;
  maxBottles = 6;
  IMAGES_ENERGY = [
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
  ];
  IMAGES_COIN = [
    "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
    "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
    "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
  ];
  IMAGES_BOTTLE = [
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
  ];
  IMAGES_ENERGY_ENDBOSS = [
    "assets/img/7_statusbars/2_statusbar_endboss/orange/orange0.png",
    "assets/img/7_statusbars/2_statusbar_endboss/orange/orange20.png",
    "assets/img/7_statusbars/2_statusbar_endboss/orange/orange40.png",
    "assets/img/7_statusbars/2_statusbar_endboss/orange/orange60.png",
    "assets/img/7_statusbars/2_statusbar_endboss/orange/orange80.png",
    "assets/img/7_statusbars/2_statusbar_endboss/orange/orange100.png",
  ];

  /**
   * Creates a new `Statusbar` instance of a specified type at the given position.
   *
   * @param {"energy" | "coin" | "bottle" | "energyEndboss"} type - The type of status bar.
   * @param {number} x - The horizontal screen position.
   * @param {number} y - The vertical screen position.
   * @param {Object} world - Reference to the game world (used to access shared data).
   */
  constructor(type, x, y, world) {
    super();
    this.world = world;
    this.x = x;
    this.y = y;
    this.type = type;
    this.width = 200;
    this.height = 50;
    this.loadTypeImages();
    this.percentage = this.type === "energy" || this.type === "energyEndboss" ? 100 : 0;
    this.setPercentage(this.percentage);
  }

  /**
   * Loads the correct set of images based on the status bar's type.
   */
  loadTypeImages() {
    if (this.type == "energy") {
      this.images = this.IMAGES_ENERGY;
    } else if (this.type == "coin") {
      this.images = this.IMAGES_COIN;
    } else if (this.type == "bottle") {
      this.images = this.IMAGES_BOTTLE;
    } else if (this.type == "energyEndboss") {
      this.images = this.IMAGES_ENERGY_ENDBOSS;
    }
    this.loadImages(this.images);
  }

  /**
   * Draws the current image of the status bar to the canvas.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
   */
  draw(ctx) {
    let path = this.images[this.resolveImageIndex()];
    this.img = this.imageCache[path];
    super.draw(ctx);
  }

  /**
   * Sets the fill percentage of the status bar (clamped between 0 and 100).
   * Updates the visual representation accordingly.
   *
   * @param {number} percentage - A number from 0 to 100.
   */
  setPercentage(percentage) {
    this.percentage = Math.max(0, Math.min(percentage, 100));
    this.updateBarImage();
  }

  /**
   * Updates the image used to represent the current percentage.
   */
  updateBarImage() {
    let path = this.images[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Resolves which image index should be used based on the current percentage.
   *
   * @returns {number} The index of the image corresponding to the current fill level.
   */
  resolveImageIndex() {
    if (this.percentage >= 100) return 5;
    if (this.percentage >= 80) return 4;
    if (this.percentage >= 60) return 3;
    if (this.percentage >= 40) return 2;
    if (this.percentage > 0) return 1;
    return 0;
  }
}
