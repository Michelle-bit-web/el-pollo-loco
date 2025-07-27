/** @type {boolean} Indicates if the device is in portrait mode. */
let isInPortrait = false;

/** @type {boolean} Indicates if the start prompt was already removed. */
let startPromptRemoved = false;

/** @type {boolean} Indicates if the toch events are allowed. */
let touchControlEnabled = true;

/**
 * Maps keyboard key codes to control actions.
 * Used for mapping physical keyboard input to game actions.
 */
const keyMap = {
  37: "LEFT",
  38: "UP",
  39: "RIGHT",
  40: "DOWN",
  32: "SPACE",
  68: "THROW",
};

/**
 * Maps mobile button element IDs to control actions.
 * Used for mapping on-screen touch controls to game actions.
 */
const buttonMap = {
  "mobile-left": "LEFT",
  "mobile-right": "RIGHT",
  "mobile-jump": "SPACE",
  "mobile-throw": "THROW",
};

/**
 * Registers global keyboard event listeners for gameplay control.
 * Maps `keydown` and `keyup` events to the corresponding actions in the `keyboard` object.
 * Only triggers input if `world.controlEnabled` is `true`.
 */
function keyboardEvents() {
  window.addEventListener("keydown", (event) => {
    if (world.controlEnabled && keyMap[event.keyCode]) {
      keyboard[keyMap[event.keyCode]] = true;
    }
  });
  window.addEventListener("keyup", (event) => {
    if (world.controlEnabled && keyMap[event.keyCode]) {
      keyboard[keyMap[event.keyCode]] = false;
    }
  });
}

/**
 * Initializes touch controls for mobile devices.
 * Binds touch events (`touchstart` and `touchend`) to all buttons defined in `buttonMap`.
 */
function touchEvents() {
  Object.values(buttonMap).forEach((buttonId) => {
    setButtonEvent(buttonId);
  });
}

/**
 * Binds `touchstart` and `touchend` events to a specific on-screen control button.
 * Simulates keyboard input using the `keyboard` object.
 *
 * @param {string} buttonId - The ID of the button element to bind events to.
 */
function setButtonEvent(buttonId) {
  const button = document.getElementById(`${buttonId}`);
  button.addEventListener("touchstart", (event) => {
    if (!touchControlEnabled) return;
    event.preventDefault();
    button.classList.add("active");
    keyboard[buttonId] = true;
  });
  button.addEventListener("touchend", (event) => {
    if (!touchControlEnabled) return;
    event.preventDefault();
    button.classList.remove("active");
    keyboard[buttonId] = false;
  });
}

function blockTouchInput() {
  touchControlEnabled = false;
  const overlay = document.getElementById("prompt-mobile");
  if (!overlay) {
    console.warn("Element with ID 'block-touch-overlay' not found.");
    return;
  }
  overlay.style.display = "block";
}

function unblockTouchInput() {
  touchControlEnabled = true;
  document.getElementById("prompt-mobile").style.pointerEvents = "auto";
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
    if (!AudioManager.isMuted) {
      toggleSoundSetting();
    }
  } else {
    setKeySetting(promptText);
  }
  prompts.forEach((prompt) => setPromptFadingInterval(prompt, mobilePortraitIcon, mobileLandscapeIcon));
  monitorOrientationDuringGame();
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
  startPromptRemoved = true;
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
  }, 120);
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
  if (!touchControlEnabled) return;
  const promptContainer = document.getElementById("div_prompt");
  document.addEventListener(
    "touchstart",
    () => {
      if (touchControlEnabled) removePrompt(prompt, promptContainer);
    },
    { once: true }
  );
}

/**
 * Starts monitoring the device orientation and handles prompt visibility and game state accordingly.
 * Especially relevant for touch devices.
 */
function monitorOrientationDuringGame() {
  setInterval(() => {
    const currentlyPortrait = isPortraitMode();
    if (isTouchDevice()) {
      handleOrientationChange(currentlyPortrait);
      checkTouchResponse();
    }
  }, 300);
}

/**
 * Checks if the device is currently in portrait mode.
 *
 * @returns {boolean} True if portrait mode is active, otherwise false.
 */
function isPortraitMode() {
  return window.matchMedia("(orientation: portrait)").matches;
}

/**
 * Handles game and UI behavior based on orientation changes.
 *
 * @param {boolean} currentlyPortrait - Indicates whether the device is currently in portrait mode.
 */
function handleOrientationChange(currentlyPortrait) {
  if (currentlyPortrait && !isInPortrait) {
    onPortraitEnter();
  } else if (!currentlyPortrait && isInPortrait) {
    onPortraitExit();
  }
}

/**
 * Executes behavior when the device switches into portrait mode.
 * Pauses the game and shows the orientation prompt.
 */
function onPortraitEnter() {
  isInPortrait = true;
  touchControlEnabled = false;
  pauseGame();
  showPrompt(document.getElementById("mobile-prompt-img-portrait"));
  showPrompt(document.getElementById("div_prompt"));
  blockTouchInput();
}

/**
 * Executes behavior when the device switches from portrait to landscape mode.
 * Resumes the game if the start prompt has already been removed.
 */
function onPortraitExit() {
  isInPortrait = false;
  touchControlEnabled = true;
  if (startPromptRemoved) {
  hidePrompt(document.getElementById("mobile-prompt-img-portrait"));
  hidePrompt(document.getElementById("div_prompt"));
  unblockTouchInput();
  continueGame();
  }
}

/**
 * Attaches a click event to the sound button to toggle mute/unmute.
 */
function soundEvent() {
  document.getElementById("sound_btn").addEventListener("click", toggleSoundSetting);
}

/**
 * Renders the controls overlay, applies styling, and injects the controls menu HTML.
 * Can optionally be used in-game to pause gameplay and show controls.
 *
 * @param {string} [initializer] - Optional flag to show overlay (e.g., "inGame").
 */
function renderControls(initializer) {
  const controls = getMenuOverlayElement();
  if (!controls) return;
  if (initializer === "inGame") showOverlay();
  styleMenuOverlay(controls);
  controls.innerHTML = controlsHtmlTemplate();
  pauseGame();
}

/**
 * Retrieves the DOM element used for the in-game menu overlay.
 * Logs an error if the element is not found.
 *
 * @returns {HTMLElement|null} The overlay element or `null` if not found.
 */
function getMenuOverlayElement() {
  const el = document.getElementById("menu-overlay");
  if (!el) {
    console.error("Element with ID 'menu-overlay' not found in the DOM.");
    return null;
  }
  return el;
}

/**
 * Displays the main overlay container by setting `display: flex`.
 */
function showOverlay() {
  const overlay = document.getElementById("overlay");
  if (overlay) overlay.style.display = "flex";
}

/**
 * Applies standard styling to the menu overlay (dark background, white text).
 *
 * @param {HTMLElement} el - The overlay element to style.
 */
function styleMenuOverlay(el) {
  el.style.backgroundColor = "rgba(0, 0, 0, 0.797)";
  el.style.color = "white";
}

/**
 * Renders the main menu content into the overlay.
 * Also resets overlay styles to default for the main menu view.
 */
function renderMainMenu() {
  let controls = document.getElementById("menu-overlay");
  controls.style.backgroundColor = "unset";
  controls.style.color = "white";
  controls.innerHTML = mainMenuHtmlTemplate();
}