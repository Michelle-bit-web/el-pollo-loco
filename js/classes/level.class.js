class Level{
    enemies;
    endboss;
    clouds;
    collectableObjects;
    backgroundObjects;
    levelEndX = 3300;
    difficulty = "easy";
    endArrowPosition;

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

    collectBgImages(pathTemplate){
        let collectedImages = [];
        let position;
         for (let i = -1; i <= 4; i++) {
            position = 719 * i;
             let number = i % 2 === -1 ? 2 : i % 2 === 1 ? 2 : 1;
             if(i === 1){
                collectedImages.push(new BackgroundObject(`assets/img/5_background/level-end/level-start.png`, position - 750, 220, 120, 200));
            } 
            collectedImages.push(
                new BackgroundObject(`${pathTemplate}/air.png`, position),
                new BackgroundObject(`${pathTemplate}/3_third_layer/${number}.png`, position),
                new BackgroundObject(`${pathTemplate}/2_second_layer/${number}.png`, position),
                new BackgroundObject(`${pathTemplate}/1_first_layer/${number}.png`, position),
            )
            if(i === 3){
                collectedImages.push(new BackgroundObject(`assets/img/5_background/level-end/level-end-arrow.png`, position - 200, 295, 120, 120));
                this.endArrowPosition = position - 200;
            }
        };  
        collectedImages.push(new BackgroundObject(`assets/img/5_background/level-end/level-end-zone.png`, 3000, 220, 120, 200));
        
        console.log(position)
        // console.log(collectedImages[0].img) //Die MEthode gibt den Pfad aus
        return collectedImages;
    }
}