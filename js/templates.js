function controlsHtmlTemplate(){
   return `
    <div class="controls-overlay">
        <div class="exit-btn-container">
            <p>Keyboard :</p>
            <button class="exit-btn" onclick="renderMainMenu()">Back</button>
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

function mainMenuHtmlTemplate(){
  return `
    <div class="panel-menu">
        <button id="startButton" class="menu-btn" onclick="startGame()">Start Game</button>
        <button id="controls" class="menu-btn" onclick="renderControls()">Controls</button>
        <button class="menu-btn"><a class="menu-btn" href="./impressum.html" target="_blank">Imprint</a></button>
      </div>
       <div id="panel" class="panel" style="display: none">
         <div class="panel-wrapper">
           <button id="LEFT">&larr;</button>
          <button id="SPACE">&uarr;</button>
        </div>
        <div class="panel-wrapper">
           <button id="THROW">
            <img class="throw-img" src="./assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png" alt="" />
           </button>
           <button id="RIGHT">&rarr;</button>
         </div>
       </div>
    </div>
  `;
}

function gamePlayHtmlTemplate(){
   return `
      <div class="gameplay-div">
        <div class="gameplay-settings">
          <button id="sound_btn" class="sound-btn-gameplay">
            <img id="sound_btn_img" class="sound-btn-gameplay" src="./assets/img/icons/sound-on-blk.png" alt="mute-sound-option" />
          </button>
          <button id="controls" class="controls-btn-gameplay" onclick="renderControls()">&#x2699;</button>
        </div>
        <div id="panel" class="panel" style="display: none">
          <div class="panel-wrapper">
            <button id="LEFT">&larr;</button>
            <button id="SPACE">&uarr;</button>
          </div>
          <div class="panel-wrapper">
            <button id="THROW">
               <img class="throw-img" src="./assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png" alt="" />
            </button>
            <button id="RIGHT">&rarr;</button>
           </div>
         </div>
      </div>
    `; 
}

function getEndScreenTemplate(endScreenImage){
 return `
    <div class="end-screen-div">
      <img id="end-screen-img" class="end-screen-img" src="${endScreenImage}" alt="mute-sound-option" />
      <button id="play-again-btn" class="menu-btn" onclick="resetGame()">Play again</button>
      <button id="to-menu-btn" class="menu-btn" onclick="backToMenu()">To menu</button>
    </div>
          
    `;
}
