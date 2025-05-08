let canvas;
let world;
let keyboard = new Keyboard();
const keyMap = {
    37: "LEFT",
    38: "UP",
    39: "RIGHT",
    40: "DOWN",
    32: "SPACE",
    68: "THROW" // Key D
};

function init() {
 // Zeige das Canvas
//  const canvasElement = document.getElementById("canvas");
//  canvasElement.style.display = "block";
}

function startGame() {
    const startButton = document.getElementById("startButton");
    startButton.style.display = "none";
    // new Audio("../assets/audio/game-start/mixkit-retro-game-notification-212.wav").play()
    loadGame();
}

function loadGame() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);

window.addEventListener("keydown", event => {
    if (world.controlEnabled && keyMap[event.keyCode]) {
        keyboard[keyMap[event.keyCode]] = true;
    }
});

window.addEventListener("keyup", event => {
    if (world.controlEnabled &&keyMap[event.keyCode]) 
        {keyboard[keyMap[event.keyCode]] = false;
        }
});

}

function toggleSoundEffect(){
    let soundImage = document.getElementById("sound_btn_img");
    if(soundImage.src.includes("sound-on-blk.png")){
    soundImage.src = "assets/img/icons/sound-off.png";
    } else{
    soundImage.src = "assets/img/icons/sound-on-blk.png";
    }
}
