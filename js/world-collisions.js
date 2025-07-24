// export function handleCollisions(world) {
//   world.collisionsCharacterChicken();
//   world.collisionsCharacterEndboss();
//   world.handleBottleCollision();
//   world.collisionsWithCollectables();
//   world.collisionsBottleChicken();
//   world.collisionsBottleEndboss();
// }

// /**
//    * Checks for collisions between the character and enemies (chickens).
//    */
// export function  collisionsCharacterChicken() {
//     this.level.enemies.forEach((enemy, enemyIndex) => {
//       if (
//         this.character.isColliding(enemy) &&
//         !enemy.isDead &&
//         !this.fightScene &&
//         !this.level.endboss.firstContactCharacter
//       ) {
//         if (this.character.isAboveGround() && this.character.speedY < 0) {
//           this.level.enemies[enemyIndex].markAsDead();
//         } else if (!this.character.isDead() && !enemy.isDead) {
//           this.character.takeDamage(10);
//         }
//       }
//     });
//   }

//   /**
//    * Handles collisions between the character and the endboss.
//    */
// export function  collisionsCharacterEndboss() {
//     if (
//       this.character.isAboveGround() &&
//       this.character.isColliding(this.level.endboss) &&
//       this.level.endboss.isJumping
//     ) {
//       this.level.endboss.takeDamage(5);
//     } else if (this.character.isColliding(this.level.endboss)) {
//       this.character.takeDamage(15);
//     }
//   }

//   /**
//    * Handles collisions between bottles and the endboss.
//    */
// export function  collisionsBottleEndboss() {
//     this.throwableObjects.forEach((bottle) => {
//       if (!bottle.isSplashing && bottle.isColliding(this.level.endboss)) {
//         bottle.splash();
//         this.level.endboss.takeDamage(20);
//       }
//     });
//   }

//   /**
//    * Handles collisions between bottles and regular enemies.
//    */
// export function  collisionsBottleChicken() {
//     this.level.enemies.forEach((enemy, enemyIndex) => {
//       this.throwableObjects.forEach((bottle) => {
//         if (bottle.isColliding(enemy, enemyIndex) && !enemy.isDead && !bottle.isSplashing) {
//           this.handleBottleCollision(bottle, enemyIndex);
//           if (!AudioManager.isMuted) {
//             audioList.bottleBreaks.play();
//             audioList.bottleSplash.play();
//           }
//         }
//         this.removeDeadEnemy(enemy, enemyIndex);
//       });
//     });
//   }

//  /**
//    * Handles bottle hitting an enemy and playing associated effects.
//    *
//    * @param {ThrowableObject} bottle - The thrown object.
//    * @param {number} enemyIndex - The index of the impacted enemy.
//    */
// export function   handleBottleCollision(bottle, enemyIndex) {
//     bottle.splash();
//     this.level.enemies[enemyIndex].markAsDead();
//   }

//   /**
//    * Handles collection of items (coins, bottles) by the character.
//    */
// export function collisionsWithCollectables() {
//     this.level.collectableObjects.forEach((item, index) => {
//       if (this.character.isColliding(item)) {
//         if (item.imageType === "coin") {
//           this.character.collectCoin();
//         } else if (item.imageType === "bottle" || item.imageType === "bottleGround") {
//           this.character.collectBottle();
//         }
//         this.level.collectableObjects.splice(index, 1);
//       }
//     });
//   }