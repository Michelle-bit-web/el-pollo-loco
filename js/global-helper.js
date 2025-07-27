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

/**
 * Global AudioController object that manages audio playback throughout the game.
 * Controls background music, sound effects, and endgame audio transitions.
 */
window.AudioController = {
  /**
   * Plays the main background music for gameplay.
   */
  playGamePlay() {
    audioList.gamePlay.play();
  },

  /**
   * Stops the main gameplay background music and disables future playback.
   */
  stopGamePlay() {
    audioList.gamePlay.stop();
    audioList.gamePlay.shouldPlay = false;
  },

  /**
   * Starts the fight scene music, enabling looping and stopping the main gameplay music.
   */
  startFightScene() {
    audioList.gamePlay.stop();
    if (!audioList.fightScene.loop) {
      audioList.fightScene.loop = true;
    }
    audioList.fightScene.shouldPlay = true;
    audioList.fightScene.play();
  },

  /**
   * Stops the fight scene music and disables looping.
   */
  stopFightScene() {
    audioList.fightScene.loop = false;
    audioList.fightScene.stop();
  },

  /**
   * Plays bottle break and splash sound effects,
   * if the global audio is not muted.
   */
  playBottleSounds() {
    if (!AudioManager.isMuted) {
      audioList.bottleBreaks.play();
      audioList.bottleSplash.play();
    }
  },

  /**
   * Plays the ghost sound effect.
   */
  playGhostSound() {
    audioList.ghost.play();
  },

  /**
   * Plays the appropriate endgame audio based on who is dead.
   *
   * @param {boolean} characterIsDead - Indicates if the player character has died.
   * @param {boolean} endbossIsDead - Indicates if the end boss has died.
   */
  handleEndAudio(characterIsDead, endbossIsDead) {
    if (characterIsDead) {
      playAudioWithStop(audioList.gameOver);
    } else if (endbossIsDead) {
      playAudioWithStop(audioList.gameWin);
    }
  },
};

/**
 * Main draw loop for the canvas.
 * Handles rendering of backgrounds, status bars, objects and character.
 */
window.DrawHelpers = {
  /**
   * Draws background elements such as sky, mountains, clouds, etc.
   */
  drawBackgrounds(ctx, level, camera_x, addObjectsToMap) {
    ctx.translate(camera_x, 0);
    addObjectsToMap(level.backgroundObjects, ctx);
    addObjectsToMap(level.clouds, ctx);
    ctx.translate(-camera_x, 0);
  },
  /**
   * Draws fixed UI elements like status bars.
   */
  drawFixedObjects(ctx, energyBar, coinBar, bottleBar, bossBar, addToMap) {
    if (bossBar) addToMap(bossBar, ctx);
    addToMap(energyBar, ctx);
    addToMap(coinBar, ctx);
    addToMap(bottleBar, ctx);
  },
  /**
   * Draws movable game elements like enemies, projectiles, character, etc.
   */
  drawMovableObjects(ctx, level, character, throwableObjects, addObjectsToMap, addToMap, camera_x) {
    ctx.translate(camera_x, 0);
    addToMap(level.endboss, ctx);
    addObjectsToMap(level.enemies, ctx);
    addObjectsToMap(throwableObjects, ctx);
    addObjectsToMap(level.collectableObjects, ctx);
    addToMap(character, ctx);
    ctx.translate(-camera_x, 0);
  },
};

/**
 * Global EndgameController object that manages the end game sequences.
 */
window.EndgameController = {
  /**
   * Checks if the game should end based on character or boss state.
   */
  checkGameEnd(world) {
    const bossDead = world.level.endboss.isDead();
    const playerDead = world.character.isDead();
    if (!bossDead && !playerDead) return;
    AudioController.stopFightScene();
    AudioController.stopGamePlay();
    world.character.stopIdleSoundLogic();
    this.setEndscreenDelay(world);
  },

  /**
   * Sets a delay before end game screen and music get started.
   */
  setEndscreenDelay(world) {
    setTimeout(() => {
      world.stopIntervals();
      const img = this.getEndScreenImage(world);
      world.prepareEndSequence(img);
      world.resetCharacterState();
      scheduleAudioReset();
    }, 1500);
  },

  /**
   * Determines which image to use for the end screen.
   *
   * @returns {string} - Path to the end screen image.
   */
  getEndScreenImage() {
    if (world.character.isDead()) {
      return "assets/img/10_game_end/game_over.png";
    }
    if (world.level.endboss.isDead()) {
      return "assets/img/10_game_end/you_win.png";
    }
    return "";
  },
};

/**
 * Global FightScreenController object that manages the screen text for the fight scene the game.
 */
window.StartFightScreen = {
  /**
   * Shows the fight message overlay.
   *
   * @param {number} interval - Camera movement interval ID.
   * @param {HTMLElement} overlay - The DOM overlay element.
   */
  showFightPrompt(interval, overlay) {
    clearInterval(interval);
    Object.assign(overlay.style, {
      display: "flex",
      fontSize: "6vw",
      textAlign: "center",
      backgroundColor: "rgba(60, 24, 2, 0.43)",
    });
    overlay.innerHTML = "Let´s salsa it!";
  },

  /**
   * Hides the overlay and resumes gameplay after the fight prompt.
   *
   * @param {HTMLElement} overlay - The DOM overlay element.
   */
  resumeGameFromPrompt(world, overlay) {
    world.returnCameraToCharacter();
    overlay.style.display = "none";
    world.controlEnabled = true;
    resetOverlay();
  },
};