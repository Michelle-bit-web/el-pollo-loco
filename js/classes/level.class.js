class Level{
    enemies;
    clouds;
    backgroundObjects;

    constructor(enemies, clouds, backgroundObjectsTemplate){
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = this.collectBgImages(backgroundObjectsTemplate);
    }

    collectBgImages(pathTemplate){
        let result = [];
 
         for (let i = 0; i <= 4; i++) {
             let position = 719 * i;
             let number = i % 2 === 1 ? 1 : 2;
            result.push(
                new BackgroundObject(`${pathTemplate}/air.png`, position),
                new BackgroundObject(`${pathTemplate}/3_third_layer/${number}.png`, position),
                new BackgroundObject(`${pathTemplate}/2_second_layer/${number}.png`, position),
                new BackgroundObject(`${pathTemplate}/1_first_layer/${number}.png`, position),
            )
        };
        return result;
    }
}
// collectBgImages(){
//     for (let i = 0; i <= 4; i++) {
//         let position = 719 * i;
//         let number = i % 2 === 1 ? 1 : 2;
//         this.backgroundObjects.push(
//             new BackgroundObject('../assets/img/5_background/layers/air.png', position),
//             new BackgroundObject(`../assets/img/5_background/layers/3_third_layer/${number}.png`, position),
//             new BackgroundObject(`../assets/img/5_background/layers/2_second_layer/${number}.png`, position),
//             new BackgroundObject(`../assets/img/5_background/layers/1_first_layer/${number}.png`, position),
//         )
//     }
// }