const level2 = new Level({
    difficulty: "hard",
    maxCoins: 10,
    maxBottles: 4,
    enemyResistance: 1,
    endboss: new Endboss(450),
    enemies: generateObject(SmallChicken, 5, 2500, 20, 370, 0.5, 0.1)
    .concat(generateObject(Chicken, 5, 2500, 20, 350, 0.5, 0.1)),
    clouds: generateObject(Cloud, 8, 3000, 110, -5, 0.5, 0.1),
    collectableObjects: setCollectableObjects(),
    backgroundObjectsTemplate: "assets/img/5_background/layers",
}
); 