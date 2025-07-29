/** @type {HTMLCanvasElement} The game's rendering canvas. */
let canvas;

/** @type {World} The main game world instance. */
let world;

/** @type {boolean} Indicates whether the game is currently running. */
let gameIsRunning = false;

/** @type {boolean} Indicates whether player controls are currently enabled. */
let controlEnabled = true;

/** @type {boolean} Tracks the prompt image switch state for mobile orientation. */
let switchedPromptImage = false;

/** @type {Keyboard} The current keyboard input state. */
let keyboard = new Keyboard();

/** @type {number[]} A list of active interval IDs. */
let intervals = [];

/** @type {boolean} Indicates if the prompt is currently fading out. */
let fadingOut = true;

/** @type {number} Current opacity level of the prompt (0–1). */
let alpha = 1;

/** @type {string} Path to muted sound icon. */
let srcMuted;

/** @type {string} Path to unmuted sound icon. */
let srcUnmuted;

/** @type {string} Path to the currently active sound icon. */
let currentSrc;

/** @type {string} Storage for overlay html content to reset the overlay at the end. */
let originalOverlay = "";

/**
 * Initializes the game: loads mute status, sets sound icon, plays theme, and starts start prompt.
 */
function init() {
  AudioManager.loadMuteStatus();
  setSoundImage();
  audioList.mainTheme.shouldPlay = true;
  startPrompt();
  soundEvent();
}

/**
 * Starts the game: activates sounds, loads the level, and displays UI overlays.
 */
function startGame() {
  audioList.mainTheme.stop();
  audioList.mainTheme.shouldPlay = false;
  originalOverlay = document.getElementById("overlay").innerHTML;
  removeOverlay("overlay");
  getGameplayOverlay();
  loadLevel();
  setSoundImage();
  if (isTouchDevice()) {
    document.getElementById("panel").style.display = "flex";
  }
}

/**
 * Hides the specified overlay element.
 * @param {string} currentOverlay - ID of the overlay to hide.
 */
function removeOverlay(currentOverlay) {
  const overlay = document.getElementById(currentOverlay);
  overlay.style.display = "none";
}

/**
 * Displays the gameplay overlay and injects its HTML content.
 */
function getGameplayOverlay() {
  let gameplayOverlay = document.getElementById("overlay-gameplay");
  gameplayOverlay.style.display = "flex";
  gameplayOverlay.innerHTML = gamePlayHtmlTemplate();
}

/**
 * Initializes the game world and sets up input handling based on device type.
 */
function loadLevel() {
  AudioManager.sounds.forEach((audio) => (audio.shouldPlay = true));
  audioList.mainTheme.shouldPlay = false;
  audioList.fightScene.shouldPlay = false;
  AudioController.playGamePlay();
  canvas = document.getElementById("canvas");
  gameIsRunning = true;
  world = new World(canvas, keyboard, level1, controlEnabled);
  if (isTouchDevice()) {
    touchEvents();
  } else {
    keyboardEvents();
  }
}

/**
 * Adds an interval ID to the intervals list for later cleanup.
 * @param {number} interval - The interval ID to store.
 */
function addInterval(interval) {
  intervals.push(interval);
}

/**
 * Clears and resets all stored intervals.
 */
function stopAllIntervals() {
  intervals.forEach((interval) => clearInterval(interval));
  intervals = [];
}

/**
 * Pauses the game and mutes audio if not already muted.
 */
function pauseGame() {
  if (gameIsRunning) {
    controlEnabled = false;
    if (world) world.controlEnabled = false;
    if (!AudioManager.isMuted) {
      AudioManager.toggleMute();
    }
  }
}

/**
 * Resumes the game and unmutes audio if appropriate.
 */
function continueGame() {
  if (gameIsRunning) {
    controlEnabled = true;
    if (world) world.controlEnabled = true;
    if (AudioManager.isMuted && currentSrc == srcMuted) {
      return;
    } else {
      AudioManager.toggleMute();
    }
  }
}

/**
 * Toggles the mute setting and updates the sound icon.
 */
function toggleSoundSetting() {
  AudioManager.toggleMute();
  setSoundImage();
}

/**
 * Updates the sound icon based on mute state.
 */
function setSoundImage() {
  const soundImage = document.getElementById("sound_btn_img");
  const soundImageGameplay = document.getElementById("sound_btn_img_gameplay");
  srcMuted = "assets/img/icons/sound-off.png";
  srcUnmuted = "assets/img/icons/sound-on-blk.png";
  currentSrc = AudioManager.isMuted ? srcMuted : srcUnmuted;
  if (soundImage) soundImage.src = currentSrc;
  if (soundImageGameplay) soundImageGameplay.src = currentSrc;
}

/**
 * Handles exit button behavior: shows menu if game not running, otherwise resumes game.
 */
function handleExitButton() {
  if (!gameIsRunning) {
    renderMainMenu();
  } else {
    document.getElementById("overlay").style.display = "none";
    continueGame();
  }
}

/**
 * Reloads the page to return to the main menu.
 */
function backToMenu() {
  window.location.reload();
}

/**
 * Fully resets the game state, sounds, overlays and world.
 */
function resetGame() {
  EndgameController.disableButtons();
  resetOverlay();
  resetAudio();
  clearAllIntervals();
  destroyWorld();
  resetControls();
  restartLevel();
  startGame();
  setTimeout(() =>
    finalizeReset(), 200);
}

/**
 * Resets and stops all audio files.
 */
function resetAudio() {
  Object.values(audioList).forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
    audio.shouldPlay = false;
  });
  audioList.gamePlay.shouldPlay = true;
  audioList.mainTheme.loop = false;
  audioList.fightScene.loop = false;
}

/**
 * Clears all stored intervals and resets the list.
 */
function clearAllIntervals() {
  intervals.forEach(clearInterval);
  intervals = [];
}

/**
 * Destroys the current game world and clears gravity intervals.
 */
function destroyWorld() {
  if (world?.character?.gravityInterval) clearInterval(world.character.gravityInterval);
  world?.stopIntervals?.();
  world = null;
}

/**
 * Reinitializes the keyboard input handler.
 */
function resetControls() {
  keyboard = new Keyboard();
}

/**
 * Recreates the level instance for a new game.
 */
function restartLevel() {
  level1 = createLevelOne();
}

/**
 * Finalizes reset after short delay: hides overlay, loads mute status and sound icon.
 */
function finalizeReset() {
  AudioManager.loadMuteStatus();
  setSoundImage();
}

/**
 * Overwrite the overlays with the original html content.
 */
function resetOverlay() {
  document.getElementById("overlay").innerHTML = originalOverlay;
  if (isTouchDevice()) {
    document.getElementById("panel").style.display = "flex";
  }
}