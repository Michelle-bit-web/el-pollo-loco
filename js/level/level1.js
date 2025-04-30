const level1 = new Level({
    difficulty: 'easy',
    maxCoins: 10,
    maxBottles: 4,
    enemyResistance: 1,
    enemies: generateObject(Chicken, 10, 2500, 20, 350, 0.5, 0.1),
    clouds: generateObject(Cloud, 10, 2900, 100, 0, 0.5, 0.1),
    backgroundObjectsTemplate: 'assets/img/5_background/layers',
}
); 

function generateObject(objectType, numberOfObject, maxX, maxY, minY, maxSpeed, minSpeed) {
    let objArr = [];
    for (let i = 0; i < numberOfObject; i++) {
        let x = Math.random() * maxX;
        let y = Math.random() * maxY + minY;
        let speed = Math.random() * maxSpeed + minSpeed ; 
        objArr.push(new objectType(x, y, speed));
    }
    return objArr;
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