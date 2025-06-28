const level1 = new Level({
    difficulty: "easy",
    enemyResistance: 1,
    endboss: new Endboss(2900),
    enemies: generateObject(SmallChicken, 5, 2000, 20, 370, 0.5, 0.1)
    .concat(generateObject(Chicken, 5, 2000, 20, 350, 0.5, 0.1)),
    clouds: generateObject(Cloud, 8, 3000, 110, -5, 0.5, 0.1),
    collectableObjects: setCollectableObjects(),
    backgroundObjectsTemplate: "assets/img/5_background/layers",
}
); 

function generateObject(objectType, numberOfObject, maxX, maxY, minY, maxSpeed, minSpeed) {
    let objArr = [];
    for (let i = 0; i < numberOfObject; i++) {
        let x = Math.random() * maxX + 300;
        let y = Math.random() * maxY + minY;
        let speed = Math.random() * maxSpeed + minSpeed ; 
        objArr.push(new objectType(x, y, speed));
    }
    return objArr;
}

function setCollectableObjects(){
    let collectableObjects = [];
    let distanceX = 0;
     for (let i = 0; i < 4; i++) {
     distanceX += 800 * i;  
     
    collectableObjects.push(
         new CollectableObject("coin", distanceX + 140, 150),
         new CollectableObject("coin", distanceX + 200, 100),
         new CollectableObject("coin", distanceX + 260, 100),
         new CollectableObject("coin", distanceX + 320, 150),
         new CollectableObject("bottle", distanceX + 260, 200),
         new CollectableObject("bottleGround", distanceX + 240 , 350),
        )
     };
     return collectableObjects;
 }