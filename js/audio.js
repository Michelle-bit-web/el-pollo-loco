/**
 * A collection of audio tracks used throughout the game, each represented by an instance of AudioManager.
 * 
 * The keys represent the context or event in which the sound is used (e.g., `mainTheme`, `jump`, `coinCollected`),
 * and the values are initialized AudioManager objects with the respective sound file, volume, and loop settings.
 *
 * @type {Object.<string, AudioManager>}
 *
 * @property {AudioManager} mainTheme        - Main menu theme music (looped, low volume).
 * @property {AudioManager} gamePlay         - Background music during gameplay (looped).
 * @property {AudioManager} chicken          - Sound when a chicken makes a noise.
 * @property {AudioManager} onLanding        - Sound effect played when character lands.
 * @property {AudioManager} jumpOnChicken    - Sound effect for jumping on a chicken.
 * @property {AudioManager} chickenDead      - Sound effect for a chicken dying.
 * @property {AudioManager} jump             - Character jump sound.
 * @property {AudioManager} coinCollected    - Coin collection sound.
 * @property {AudioManager} bottleCollected  - Sound when a bottle is picked up.
 * @property {AudioManager} fightScene       - Music used during fight scenes.
 * @property {AudioManager} endbossHurt      - Sound played when the endboss takes damage.
 * @property {AudioManager} ghost            - Sound for ghost appearance.
 * @property {AudioManager} throw            - Sound for throwing a bottle.
 * @property {AudioManager} bottleBreaks     - Sound when a bottle breaks.
 * @property {AudioManager} bottleSplash     - Splash sound after bottle impact.
 * @property {AudioManager} characterHurt    - Sound when the player takes damage.
 * @property {AudioManager} energyRecovery   - Sound when recovering health or energy.
 * @property {AudioManager} walking          - Footstep sound during walking.
 * @property {AudioManager} characterDead    - Sound played when the player character dies.
 * @property {AudioManager} gameOver         - Sound played on game over.
 * @property {AudioManager} gameWin          - Sound played when the game is won.
 * @property {AudioManager} idle             - Ambient sound while idle.
 * @property {AudioManager} snoring          - Snoring sound, possibly during idle animations.
 */
audioList = {
  mainTheme: new AudioManager("assets/audio/mainTheme.mp3", 0.08, true),
  gamePlay: new AudioManager("assets/audio/gamePlay.mp3", 0.08, true),
  chicken: new AudioManager("assets/audio/chicken.wav", 0.2, false),
  onLanding: new AudioManager("assets/audio/onLanding.wav", 0.2, false),
  jumpOnChicken: new AudioManager("assets/audio/jumpOnChicken.wav", 0.5 , false),
  chickenDead: new AudioManager("assets/audio/chickenDead.mp3", 0.2, false),
  jump: new AudioManager("assets/audio/jump.mp3", 0.5, false),
  coinCollected: new AudioManager("assets/audio/coinCollected.wav", 0.2, false),
  bottleCollected: new AudioManager("assets/audio/bottleCollected.wav", 0.2, false),
  fightScene: new AudioManager("assets/audio/fightScene.mp3",0.3, true),
  endbossHurt: new AudioManager("assets/audio/endbossHurt.wav", 0.5, false),
  ghost: new AudioManager("assets/audio/ghost.wav", 0.2, false),
  throw: new AudioManager("assets/audio/throw.mp3", 0.5, false),
  bottleBreaks: new AudioManager("assets/audio/bottleBreaks.wav", 0.1, false),
  bottleSplash: new AudioManager("assets/audio/bottleSplash.wav", 0.08, false),
  characterHurt: new AudioManager("assets/audio/characterHurt.wav", 0.08, false),
  energyRecovery: new AudioManager("assets/audio/energyRecovery.wav", 0.08, false),
  walking: new AudioManager("assets/audio/walk.mp3", 0.3, false),
  characterDead: new AudioManager("assets/audio/characterDead.wav", 0.5, false),
  gameOver: new AudioManager("assets/audio/gameOver.wav", 0.5, false),
  gameWin: new AudioManager("assets/audio/gameWin.wav", 0.5, false),
  idle: new AudioManager("assets/audio/idle.mp3", 0.5, false),
  snoring: new AudioManager("assets/audio/snoring.mp3", 0.1, false),
};