/**
 * Returns the HTML string for the controls overlay,
 * which shows keyboard mappings and a back button.
 *
 * @returns {string} HTML string for the controls overlay.
 */
function controlsHtmlTemplate() {
  return `
    <div class="controls-overlay">
      <div class="exit-btn-container">
        <p>Keyboard :</p>
          <button class="exit-btn" onclick="handleExitButton()">
            Back
          </button>
      </div>
      <div class="key-controls">
        <div>
          <img src="./assets/img/controls/left.png" />
          <p> &larr;</p>
        </div>
        <div>
          <img src="./assets/img/controls/right.png" />
          <p>&rarr;</p>
        </div>
        <div>
          <img src="./assets/img/controls/jump.png" />
          <p>Space</p>
        </div>
        <div>
          <img class="img-throw-bottle" src="./assets/img/controls/throw.png" />
          <p>D</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Returns the HTML string for the main menu interface,
 * including start, controls, and imprint buttons.
 * Also includes a hidden touch control panel for mobile devices.
 *
 * @returns {string} HTML string for the main menu layout.
 */
function mainMenuHtmlTemplate() {
  return `
    <div class="panel-menu">
      <button id="startButton" class="menu-btn" onclick="startGame()">
        Start Game
      </button>
      <button id="controls" class="menu-btn" onclick="renderControls()">
        Controls
      </button>
      <button class="menu-btn">
        <a class="menu-btn" href="./impressum.html">Imprint</a>
       </button>
    </div>
    <div id="panel" class="panel" style="display: none">
      <div class="panel-wrapper">
        <button id="LEFT">
          &larr;
        </button>
        <button id="SPACE">
          &uarr;
        </button>
      </div>
      <div class="panel-wrapper">
        <button id="THROW">
          <img class="throw-img" src="./assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png" alt="" />
        </button>
        <button id="RIGHT">
          &rarr;
        </button>
      </div>
    </div>
  `;
}

/**
 * Returns the HTML string for the gameplay interface,
 * including sound settings, controls button and mobile touch panel.
 *
 * @returns {string} HTML string for the gameplay overlay.
 */
function gamePlayHtmlTemplate() {
  return `
    <div class="gameplay-div">
      <div class="gameplay-settings">
        <button id="sound_btn" class="sound-btn-gameplay" onclick="toggleSoundSetting()">
          <img id="sound_btn_img_gameplay" class="sound-btn-gameplay" src="./assets/img/icons/sound-on-blk.png" alt="mute-sound-option" />
        </button>
        <button id="controls" class="controls-btn-gameplay" onclick="renderControls('inGame')">
          &#x2699;
        </button>
      </div>
      <div id="panel" class="panel" style="display: none">
        <div class="panel-wrapper">
          <button id="SPACE">
            &uarr;
          </button>
          <button id="THROW">
            <img class="throw-img" src="./assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png" alt="" />
          </button>
        </div>
        <div class="panel-wrapper">
          <button id="LEFT">
            &larr;
            </button>
          <button id="RIGHT">
            &rarr;
            </button>
        </div>
       </div>
     </div>
  `;
}

/**
 * Returns the HTML string for the end screen layout.
 * This screen appears when the game is won or lost.
 *
 * @param {string} endScreenImage - The path to the image that should be shown (win or game over).
 * @returns {string} HTML string for the end screen layout.
 */
function getEndScreenTemplate(endScreenImage) {
  return `
    <div id="end-screen-div" class="end-screen-div">
      <img id="end-screen-img" class="end-screen-img" src="${endScreenImage}" alt="mute-sound-option"/>
      <button id="play-again-btn" class="menu-btn endscreen disabled_btn" onclick="resetGame()" disabled>Play again</button>
      <button id="to-menu-btn" class="menu-btn endscreen disabled_btn" onclick="backToMenu()" disabled>To menu</button>
    </div>
  `;
}
