/**
 * Initializes and defines the first game level (`level1`) with enemies, clouds,
 * collectable objects, background assets, and difficulty settings.
 */
let level1 = new Level({
  difficulty: "easy",
  enemyResistance: 1,
  endboss: new Endboss(2900),
  enemies: generateObject(SmallChicken, 5, 2000, 20, 370, 0.5, 0.1).concat(
    generateObject(Chicken, 5, 2000, 20, 350, 0.5, 0.1)
  ),
  clouds: generateObject(Cloud, 8, 3000, 110, -5, 0.5, 0.1),
  collectableObjects: setCollectableObjects(),
  backgroundObjectsTemplate: "assets/img/5_background/layers",
});

/**
 * Dynamically generates an array of game objects (e.g. enemies, clouds) with randomized positions and speeds.
 *
 * @param {Function} objectType - The constructor function or class of the object to generate (e.g. `Chicken`, `Cloud`).
 * @param {number} numberOfObject - The total number of objects to create.
 * @param {number} maxX - Maximum X value used for random horizontal positioning.
 * @param {number} maxY - Maximum Y value added to `minY` for random vertical positioning.
 * @param {number} minY - Minimum Y value for object vertical positioning.
 * @param {number} maxSpeed - Maximum speed range added to `minSpeed`.
 * @param {number} minSpeed - Minimum speed value.
 * @returns {Object[]} An array of generated game object instances.
 */
function generateObject(objectType, numberOfObject, maxX, maxY, minY, maxSpeed, minSpeed) {
  let objArr = [];
  for (let i = 0; i < numberOfObject; i++) {
    let x = Math.random() * maxX + 300;
    let y = Math.random() * maxY + minY;
    let speed = Math.random() * maxSpeed + minSpeed;
    objArr.push(new objectType(x, y, speed));
  }
  return objArr;
}

/**
 * Creates a predefined collection of collectable objects (coins and bottles)
 * and distributes them across the level at spaced intervals.
 *
 * @returns {CollectableObject[]} An array of initialized collectable objects.
 */
function setCollectableObjects() {
  let collectableObjects = [];
  let distanceX = 0;
  for (let i = 0; i < 4; i++) {
    distanceX += 700 * i;
    setCollactablesPosition(distanceX, collectableObjects);
  }
  return collectableObjects;
}

/**
 * Pushes a set of collectable items into the given array at positions relative to the given X offset.
 *
 * @param {number} distanceX - Horizontal offset used to place the collectables.
 * @param {CollectableObject[]} collectableObjects - The array to which collectables will be added.
 */
function setCollactablesPosition(distanceX, collectableObjects) {
  collectableObjects.push(
    new CollectableObject("coin", distanceX + 140, 150),
    new CollectableObject("coin", distanceX + 200, 100),
    new CollectableObject("coin", distanceX + 260, 100),
    new CollectableObject("coin", distanceX + 320, 150),
    new CollectableObject("bottle", distanceX + 260, 200),
    new CollectableObject("bottleGround", distanceX + 200, 350)
  );
}

/**
 * Factory function that creates a fresh instance of Level 1.
 * Useful for restarting or resetting the game.
 *
 * @returns {Level} A new Level instance pre-filled with all configured game objects and parameters.
 */
function createLevelOne() {
  return new Level({
    difficulty: "easy",
    enemyResistance: 1,
    endboss: new Endboss(2900),
    enemies: generateObject(SmallChicken, 5, 2000, 20, 370, 0.5, 0.1).concat(
      generateObject(Chicken, 5, 2000, 20, 350, 0.5, 0.1)
    ),
    clouds: generateObject(Cloud, 8, 3000, 110, -5, 0.5, 0.1),
    collectableObjects: setCollectableObjects(),
    backgroundObjectsTemplate: "assets/img/5_background/layers",
  });
}
