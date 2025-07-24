/**
 * Base class for all drawable objects in the game.
 * Provides fundamental properties and methods for rendering images on the canvas.
 *
 * This class handles image loading, caching, and drawing, and is typically extended by other object types.
 */
class DrawableObject {
  /**
   * The horizontal position of the object on the canvas.
   * @type {number}
   */
  x = 10;

  /**
   * The vertical position of the object on the canvas.
   * @type {number}
   */
  y = 350;

  /**
   * Height of the object in pixels.
   * @type {number}
   */
  height = 200;

  /**
   * Width of the object in pixels.
   * @type {number}
   */
  width = 170;

  /**
   * The current image to be drawn.
   * @type {HTMLImageElement}
   */
  img;

  /**
   * A cache for multiple images, used for animations.
   * The keys are image paths, and the values are loaded Image objects.
   * @type {Object.<string, HTMLImageElement>}
   */
  imageCache = {};

  /**
   * Index of the currently displayed image in an animation sequence.
   * @type {number}
   */
  currentImage = 0;

  /**
   * Collision offset used for hit detection or boundary adjustments.
   * @type {{ top: number, left: number, right: number, bottom: number }}
   */
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  /**
   * Optional opacity used for fade-out effects.
   * If defined, this value is used for drawing transparency.
   * @type {number | undefined}
   */
  fadeOutOpacity;

  /**
   * Loads a single image from the given file path and sets it as the main image.
   *
   * @param {string} path - Path to the image file.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Loads multiple images and stores them in the image cache.
   * Useful for animated objects that require several frames.
   *
   * @param {string[]} arr - Array of image file paths.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Draws the current image onto the canvas at the object's position and size.
   * If `fadeOutOpacity` is defined, it adjusts the canvas opacity temporarily.
   *
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
   */
  draw(ctx) {
    if (this.fadeOutOpacity !== undefined) {
      ctx.globalAlpha = this.fadeOutOpacity;
    }
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    ctx.globalAlpha = 1.0;
  }
}