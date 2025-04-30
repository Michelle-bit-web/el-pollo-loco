class Level{
    enemies;
    clouds;
    collectableObjects;
    backgroundObjects;
    levelEndX = 2800;
    difficulty = 'easy';

    constructor(levelSettings){
        
        this.enemies = levelSettings.enemies;
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
             
            collectedImages.push(
                new BackgroundObject(`${pathTemplate}/air.png`, position),
                new BackgroundObject(`${pathTemplate}/3_third_layer/${number}.png`, position),
                new BackgroundObject(`${pathTemplate}/2_second_layer/${number}.png`, position),
                new BackgroundObject(`${pathTemplate}/1_first_layer/${number}.png`, position),
            )
        };  collectedImages.push(new BackgroundObject(`assets/img/5_background/level-end/level-end-arrow.png`, position - 200, 295, 120, 120));
        // console.log(collectedImages[0].img) //Die MEthode gibt den Pfad aus
        return collectedImages;
    }
}