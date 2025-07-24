/**
 * Checks if the current device supports touch input.
 * @returns {boolean} True if touch is supported, false otherwise.
 */
function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
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
 * Resets the HTML overlay content.
 */
function resetOverlay() {
  document.getElementById("overlay").innerHTML = game.originalOverlay;
}

/**
 * Resets audio flags and prepares for returning to the main menu.
 */
function scheduleAudioReset() {
  setTimeout(() => {
    audioList.gameWin.stop();
    audioList.gameOver.stop();
    AudioManager.sounds.forEach((audio) => {
      audio.shouldPlay = false;
      audio.stop();
    });
    audioList.mainTheme.shouldPlay = true;
    audioList.mainTheme.play();
  }, 3500);
}

/**
 * Plays the given audio and flags it as not repeatable.
 *
 * @param {Audio} audio - Audio object to play.
 */
function playAudioWithStop(audio) {
  audio.play();
  audio.shouldPlay = false;
}