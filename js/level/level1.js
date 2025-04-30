const level1 = new Level({
    difficulty: 'easy',
    maxCoins: 10,
    maxBottles: 4,
    enemyResistance: 1,
    enemies: [
        new Chicken(), 
        new Chicken(), 
        new Chicken()
    ],
    clouds: generateClouds(10),
    backgroundObjectsTemplate: 'assets/img/5_background/layers',
}
); 

function generateClouds(numberOfClouds) {
    let clouds = [];
    for (let i = 0; i < numberOfClouds; i++) {
        let x = Math.random() * 2900;
        let y = Math.random() * 100;
        let speed = Math.random() * 0.5 + 0.1 ; // Random speed between 0.1 and 0.6
        clouds.push(new Cloud(x, y, speed));
    }
    return clouds;
}
// console.log(level1) //Die Bilder werden richtig erzeugt



//falls nötig die Level in eigene js-Dateien auslagern und im html verknüpfen

// const level2 = new Level({
//     difficulty: 'medium',
//     maxCoins: 10,
//     maxBottles: 3,
//     enemyResistance: 2,
//     enemies: [
//         new Chicken(), 
//         new Chicken(), 
//         new Chicken()
//     ],
//     clouds: [
//         new Cloud(),
//         new Cloud()
//     ],
//     backgroundObjectsTemplate: 'assets/img/5_background/layers'
// });

// const level3 = new Level({
//     difficulty: 'hard',
//     maxCoins: 10,
//     maxBottles: 2,
//     enemyResistance: 3,
//     enemies: [
//         new Chicken(), 
//         new Chicken(), 
//         new Chicken(),
//         new Endboss()
//     ],
//     clouds: [
//         new Cloud(),
//         new Cloud()
//     ],
//     backgroundObjectsTemplate: 'assets/img/5_background/layers'
// });