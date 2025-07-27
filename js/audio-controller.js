// window.AudioController = {
//   playGamePlay() {
//     audioList.gamePlay.play();
//   },

//   stopGamePlay() {
//     audioList.gamePlay.stop();
//     audioList.gamePlay.shouldPlay = false;
//   },

//   startFightScene() {
//     audioList.gamePlay.stop();
//     if (!audioList.fightScene.loop) {
//       audioList.fightScene.loop = true;
//     }
//     audioList.fightScene.shouldPlay = true;
//     audioList.fightScene.play();
//   },

//   stopFightScene() {
//     audioList.fightScene.loop = false;
//     audioList.fightScene.stop();
//   },

//   playBottleSounds() {
//     if (!AudioManager.isMuted) {
//       audioList.bottleBreaks.play();
//       audioList.bottleSplash.play();
//     }
//   },

//   playGhostSound() {
//     audioList.ghost.play();
//   },
  
//   handleEndAudio(characterIsDead, endbossIsDead) {
//     if (characterIsDead) {
//       playAudioWithStop(audioList.gameOver);
//     } else if (endbossIsDead) {
//       playAudioWithStop(audioList.gameWin);
//     }
//   }
// };