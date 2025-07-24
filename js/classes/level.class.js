/**
 * Represents a game level, including all enemies, objects, background, and layout data.
 * 
 * The `Level` class is used to initialize and organize all components of a playable level,
 * including enemies, endboss, collectibles, clouds, background layers, and difficulty settings.
 */
class Level{
    /**
     * @property {MovableObject[]} enemies - Array of enemy objects in the level.
     * @property {Endboss} endboss - The main boss character of the level.
     * @property {Cloud[]} clouds - Decorative clouds in the level.
     * @property {CollectableObject[]} collectableObjects - Items that can be collected (e.g., coins, bottles).
     * @property {BackgroundObject[]} backgroundObjects - All background layer elements.
     * @property {number} levelEndX - The X-coordinate marking the end of the level.
     * @property {string} difficulty - Difficulty setting (e.g., "easy", "medium", "hard").
     * @property {number} endArrowPosition - X-position of the arrow indicating the level's end.
     * @property {BackgroundObject[]} collectedImages - Internally used to collect all background image instances.
     * @property {number} maxCoins - Maximum number of coins in the level.
     * @property {number} maxBottles - Maximum number of throwable bottles in the level.
     * @property {number} enemyResistance - Modifier for how much damage enemies can withstand.
     */
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
     * Creates a new Level instance with all required components.
     *
     * @param {Object} levelSettings - Configuration object for the level.
     * @param {MovableObject[]} levelSettings.enemies - Enemies to populate the level.
     * @param {Endboss} levelSettings.endboss - The final boss of the level.
     * @param {Cloud[]} levelSettings.clouds - Cloud decorations.
     * @param {string} levelSettings.difficulty - Difficulty setting.
     * @param {number} levelSettings.maxCoins - Maximum number of collectible coins.
     * @param {number} levelSettings.maxBottles - Maximum number of throwable bottles.
     * @param {number} levelSettings.enemyResistance - Health/damage resistance modifier for enemies.
     * @param {CollectableObject[]} levelSettings.collectableObjects - Items to be collected.
     * @param {string} levelSettings.backgroundObjectsTemplate - Path to background image templates.
     */
    constructor(levelSettings){
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
     * Dynamically builds the background layers and special marker images (start and end arrows)
     * based on a provided path template.
     *
     * @param {string} pathTemplate - Base path for background images.
     * @returns {BackgroundObject[]} An array of all constructed background image objects.
     */
    collectBgImages(pathTemplate){
        let position;
        for (let i = -1; i <= 4; i++) {
            position = 719 * i;
            let number = i % 2 === -1 ? 2 : i % 2 === 1 ? 2 : 1;
            this.setStartArrowImage(position, i); 
            this.setBackgroundLayerImages(pathTemplate, number, position);
            if(i === 3) {
                this.setEndArrowImage(position);
                this.endArrowPosition = position - 200;
            }
        };  
        this.collectedImages.push(new BackgroundObject(`assets/img/5_background/level-end/level-end-zone.png`, 3000, 220, 120, 200));
        return this.collectedImages;
    };

    /**
     * Adds the starting arrow image to the background, if the position matches the start index.
     *
     * @param {number} position - X-coordinate where the image should be placed.
     * @param {number} i - Loop index used to determine placement logic.
     */
    setStartArrowImage(position, i) {
        if(i === 1) {
            this.collectedImages.push(new BackgroundObject(`assets/img/5_background/level-end/level-start.png`, position - 750, 220, 120, 200));
        }
    }

    /**
     * Adds a set of background layers (air, third, second, and first layer) at the given position.
     * 
     * @param {string} pathTemplate - Base path for the images.
     * @param {number} number - Used to choose between different variants (e.g., 1 or 2).
     * @param {number} position - X-coordinate for placing the background images.
     */
    setBackgroundLayerImages(pathTemplate, number, position) {
        this.collectedImages.push(
            new BackgroundObject(`${pathTemplate}/air.png`, position),
            new BackgroundObject(`${pathTemplate}/3_third_layer/${number}.png`, position),
            new BackgroundObject(`${pathTemplate}/2_second_layer/${number}.png`, position),
            new BackgroundObject(`${pathTemplate}/1_first_layer/${number}.png`, position),
        )
    }

    /**
     * Adds the ending arrow image and stores its position.
     *
     * @param {number} position - X-coordinate where the end arrow should be placed.
     */
    setEndArrowImage(position) {
        this.collectedImages.push(new BackgroundObject(`assets/img/5_background/level-end/level-end-arrow.png`, position - 200, 295, 120, 120));
    }
}