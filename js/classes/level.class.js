/**
 * Represents a game level, including all enemies, objects, background, and layout data.
 *
 * The `Level` class is used to initialize and organize all components of a playable level,
 * including enemies, endboss, collectibles, clouds, background layers, and difficulty settings.
 */
class Level {
  enemies;
  endboss;
  clouds;
  collectableObjects;
  backgroundObjects;
  levelEndX = 3800;
  difficulty = "easy";
  endArrowPosition;
  collectedImages = [];

    /**
     * @param {Object} levelSettings - Configuration object for the level.
     * @param {MovableObject[]} levelSettings.enemies
     * @param {Endboss} levelSettings.endboss
     * @param {Cloud[]} levelSettings.clouds
     * @param {string} levelSettings.difficulty
     * @param {number} levelSettings.maxCoins
     * @param {number} levelSettings.maxBottles
     * @param {number} levelSettings.enemyResistance
     * @param {CollectableObject[]} levelSettings.collectableObjects
     * @param {string} levelSettings.backgroundObjectsTemplate
     */
    constructor(levelSettings) {
        this.enemies = levelSettings.enemies;
        this.endboss = levelSettings.endboss;
        this.clouds = levelSettings.clouds;
        this.difficulty = levelSettings.difficulty;
        this.maxCoins = levelSettings.maxCoins;
        this.maxBottles = levelSettings.maxBottles;
        this.enemyResistance = levelSettings.enemyResistance;
        this.collectableObjects = levelSettings.collectableObjects;
        this.backgroundObjects = this.collectBgImages(levelSettings.backgroundObjectsTemplate);
    }

    /**
     * Builds the background layers and special marker images.
     * @param {string} pathTemplate
     * @returns {BackgroundObject[]}
     */
    collectBgImages(pathTemplate) {
        let position;
        for (let i = -1; i <= 4; i++) {
        position = 719 * i;
        let number = i % 2 === -1 || i % 2 === 1 ? 2 : 1;
        this.setStartArrowImage(position, i);
        this.setBackgroundLayerImages(pathTemplate, number, position);
        if (i === 3) {
            this.setEndArrowImage(position);
            this.endArrowPosition = position - 200;
        }
        }
        this.collectedImages.push(
        new BackgroundObject(`assets/img/5_background/level-end/level-end-zone.png`, 3000, 220, 120, 200)
        );
        return this.collectedImages;
    }

    /**
     * Adds the starting arrow image.
     * @param {number} position
     * @param {number} i
     */
    setStartArrowImage(position, i) {
        if (i === 1) {
        this.collectedImages.push(
            new BackgroundObject(`assets/img/5_background/level-end/level-start.png`, position - 750, 220, 120, 200)
        );
        }
    }

    /**
     * Adds a set of background layers.
     * @param {string} pathTemplate
     * @param {number} number
     * @param {number} position
     */
    setBackgroundLayerImages(pathTemplate, number, position) {
        this.collectedImages.push(
        new BackgroundObject(`${pathTemplate}/air.png`, position),
        new BackgroundObject(`${pathTemplate}/3_third_layer/${number}.png`, position),
        new BackgroundObject(`${pathTemplate}/2_second_layer/${number}.png`, position),
        new BackgroundObject(`${pathTemplate}/1_first_layer/${number}.png`, position)
        );
    }

    /**
     * Adds the ending arrow image.
     * @param {number} position
     */
    setEndArrowImage(position) {
        this.collectedImages.push(
        new BackgroundObject(`assets/img/5_background/level-end/level-end-arrow.png`, position - 200, 295, 120, 120)
        );
    }
}