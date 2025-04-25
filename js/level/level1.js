const level1 = new Level(
[
    new Chicken(),
    new Chicken(),
    new Chicken(),
],
[
    new Cloud()
],
[
    '../assets/img/5_background/layers'
   
]
);

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