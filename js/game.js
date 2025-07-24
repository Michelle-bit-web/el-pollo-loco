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
 * Checks if the current device supports touch input.
 * @returns {boolean} True if touch is supported, false otherwise.
 */
function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

/**
 * Starts the game: activates sounds, loads the level, and displays UI overlays.
 */
function startGame() {
  AudioManager.sounds.forEach((audio) => (audio.shouldPlay = true));
  audioList.mainTheme.stop();
  audioList.mainTheme.shouldPlay = false;
  audioList.gamePlay.play();
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
 * Displays the prompt overlay and sets fading behavior based on device type.
 */
function startPrompt() {
  const promptText = document.getElementById("prompt-overlay");
  const touchPrompt = document.getElementById("prompt-touch");
  const mobilePromptText = document.getElementById("prompt-mobile");
  const mobilePortraitIcon = document.getElementById("mobile-prompt-img-portrait");
  const mobileLandscapeIcon = document.getElementById("mobile-prompt-img-landscape");
  let prompts = [promptText, touchPrompt, mobilePromptText, mobilePortraitIcon, mobileLandscapeIcon];
  if (isTouchDevice()) {
    setTouchSetting(touchPrompt);
    if(!AudioManager.isMuted) {
      toggleSoundSetting();
    }
  } else {
    setKeySetting(promptText);
  }
  prompts.forEach((prompt) => setPromptFadingInterval(prompt, mobilePortraitIcon, mobileLandscapeIcon));
}

/**
 * Configures the prompt text and interaction for touch devices.
 * @param {HTMLElement} touchPrompt - The touch prompt element.
 */
function setTouchSetting(touchPrompt) {
  setPrompt("Touch screen", touchPrompt);
  checkTouchResponse(touchPrompt);
}

/**
 * Configures the prompt text and interaction for keyboard users.
 * @param {HTMLElement} promptText - The key prompt element.
 */
function setKeySetting(promptText) {
  setPrompt("Press Any Key", promptText);
  checkKeyResponse(promptText);
}

/**
 * Sets the prompt text and text alignment.
 * @param {string} text - The prompt message.
 * @param {HTMLElement} overlay - The prompt element to update.
 */
function setPrompt(text, overlay) {
  return (overlay.innerText = `${text}`), (overlay.style.textAlign = "center");
}

/**
 * Hides a prompt element.
 * @param {HTMLElement} prompt - The element to hide.
 */
function hidePrompt(prompt) {
  prompt.style.display = "none";
}

/**
 * Shows a prompt element.
 * @param {HTMLElement} prompt - The element to show.
 */
function showPrompt(prompt) {
  prompt.style.display = "flex";
}

/**
 * Removes the prompt, stops intervals, and resumes theme audio.
 * @param {HTMLElement} prompt - The prompt element to remove.
 * @param {HTMLElement} promptContainer - The container element.
 */
function removePrompt(prompt, promptContainer) {
  if (prompt) {
    hidePrompt(prompt);
  }
  if (promptContainer) {
    hidePrompt(promptContainer);
  }
  stopAllIntervals();
  audioList.mainTheme.play();
  AudioManager.loadMuteStatus();
}

/**
 * Fades a prompt element in/out over time and rotates orientation icon if on mobile.
 * @param {HTMLElement} prompt - The prompt element.
 * @param {HTMLElement} mobilePortraitIcon - Icon for portrait mode.
 * @param {HTMLElement} mobileLandscapeIcon - Icon for landscape mode.
 */
function setPromptFadingInterval(prompt, mobilePortraitIcon, mobileLandscapeIcon) {
  let showPromptInterval = setInterval(() => {
    alpha = fadeOutPrompt();
    prompt.style.opacity = alpha;
    if (window.screen.orientation.type.startsWith("portrait")) {
      rotateMobileIcon(mobilePortraitIcon, mobileLandscapeIcon, alpha);
    }
  }, 150);
  intervals.push(showPromptInterval);
}

/**
 * Switches between portrait and landscape prompt icons based on alpha value.
 * @param {HTMLElement} promptImagePortrait
 * @param {HTMLElement} promptImageLandscape
 * @param {number} alpha - Current opacity value.
 */
function rotateMobileIcon(promptImagePortrait, promptImageLandscape, alpha) {
  if (!switchedPromptImage && alpha <= 0.1) {
    hidePrompt(promptImagePortrait);
    showPrompt(promptImageLandscape);
    switchedPromptImage = true;
  } else if (switchedPromptImage && alpha >= 0.9) {
    showPrompt(promptImagePortrait);
    hidePrompt(promptImageLandscape);
    switchedPromptImage = false;
  }
}

/**
 * Handles fading effect for prompt and returns the current alpha value.
 * @returns {number} Updated alpha value.
 */
function fadeOutPrompt() {
  if (fadingOut) {
    reduceTransparence();
    return alpha;
  } else {
    increaseTransparence();
    return alpha;
  }
}

/**
 * Decreases prompt opacity and toggles direction if minimum reached.
 */
function reduceTransparence() {
  alpha -= 0.02;
  if (alpha <= 0) {
    alpha = 0;
    fadingOut = false;
  }
}

/**
 * Increases prompt opacity and toggles direction if maximum reached.
 */
function increaseTransparence() {
  alpha += 0.02;
  if (alpha >= 1) {
    alpha = 1;
    fadingOut = true;
  }
}

/**
 * Waits for a key press and removes the start prompt.
 * @param {HTMLElement} prompt - The prompt element.
 */
function checkKeyResponse(prompt) {
  const promptContainer = document.getElementById("div_prompt");
  document.addEventListener(
    "keydown",
    () => {
      removePrompt(prompt, promptContainer);
    },
    { once: true }
  );
}

/**
 * Waits for a touch input and removes the start prompt.
 * @param {HTMLElement} prompt - The prompt element.
 */
function checkTouchResponse(prompt) {
  const promptContainer = document.getElementById("div_prompt");
  document.addEventListener(
    "touchstart",
    () => {
      removePrompt(prompt, promptContainer);
    },
    { once: true }
  );
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
  resetOverlay();
  resetAudio();
  clearAllIntervals();
  destroyWorld();
  resetControls();
  restartLevel();
  startGame();
  setTimeout(() => finalizeReset(), 100);
}

/**
 * Resets and stops all audio files.
 */
function resetAudio() {
  // Audiomanager.sounds = [];
  // Object.values(audioList).forEach((audio) => {
  //   audio.pause();
  //   audio.currentTime = 0;
  //   audio.shouldPlay = false;
  // });
  createNewAudioList();
  audioList.mainTheme.stop();
  audioList.mainTheme.shouldPlay = false;
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
  // document.getElementById("overlay").style.display = "none";
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
