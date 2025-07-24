/**
 * Represents a background object in the game world (e.g. scenery layer).
 * Inherits from `MovableObject` and can optionally be assigned a custom size and position.
 */
class BackgroundObject extends MovableObject {
  /** @type {number} Default height of the background object */
  height = 480;

  /** @type {number} Default width of the background object */
  width = 720;

  /**
   * Creates a new instance of BackgroundObject.
   *
   * @param {string} imagePath - The path to the image to be used as the background.
   * @param {number} x - The x-position of the background object.
   * @param {number} [y] - Optional y-position (default is 0 unless explicitly set).
   * @param {number} [w] - Optional custom width of the object.
   * @param {number} [h] - Optional custom height of the object.
   */
  constructor(imagePath, x, y, w, h) {
    super().loadImage(imagePath);
    this.y = 0;
    this.x = x;
    if (w !== undefined && h !== undefined && y !== undefined) {
      this.width = w;
      this.height = h;
      this.y = y;
    }
  }
}