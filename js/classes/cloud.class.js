/**
 * Represents a moving cloud in the game background.
 * The cloud continuously moves to the left and resets its position
 * when it goes off-screen to create an infinite scrolling effect.
 * 
 * Inherits from MovableObject.
 */
class Cloud extends MovableObject {
  /**
   * Width of the cloud image in pixels.
   * @type {number}
   */
  width = 450;

  /**
   * Creates a new Cloud instance at the specified position with the given speed.
   * Automatically starts the movement animation.
   * 
   * @param {number} x - The initial x-coordinate of the cloud.
   * @param {number} y - The initial y-coordinate of the cloud.
   * @param {number} speed - The speed at which the cloud moves left.
   */
  constructor(x, y, speed) {
    super().loadImage("assets/img/5_background/layers/4_clouds/1.png");
    this.speed = speed;
    this.x = x;
    this.y = y;
    this.animate();
  }

  /**
   * Starts the leftward movement animation of the cloud.
   * When the cloud moves off-screen (left), it resets to the end of the level,
   * enabling a seamless scrolling effect.
   */
  animate() {
    this.animationIntervals["cloudMoves"] = setInterval(() => {
        if (this.x + this.width < 0) {
            this.x = this.levelEndX;
        };
        this.moveLeft();
    }, 100);
  }
}