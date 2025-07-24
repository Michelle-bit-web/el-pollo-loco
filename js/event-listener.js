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
    event.preventDefault();
    button.classList.add("active");
    keyboard[buttonId] = true;
  });
  button.addEventListener("touchend", (event) => {
    event.preventDefault();
    button.classList.remove("active");
    keyboard[buttonId] = false;
  });
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