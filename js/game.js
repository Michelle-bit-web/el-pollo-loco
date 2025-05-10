let canvas;
let world;
let gameIsRunning = true;
let soundStartScreen = new AudioManager("assets/audio/background/Faster_Version-2024-02-19_-_Mexican_Cowboys_-_www.FesliyanStudios.com.mp3", 0.5, true, 1)
let keyboard = new Keyboard();
const keyMap = {
    37: "LEFT",
    38: "UP",
    39: "RIGHT",
    40: "DOWN",
    32: "SPACE",
    68: "THROW" // Key D
};
let intervals = [];
let fadingOut = true;
let alpha = 1;

function init() {
    startPrompt();

}

function startGame() {
    soundStartScreen.stop();
    const startButton = document.getElementById("startButton");
    startButton.style.display = "none";
    // new Audio("../assets/audio/game-start/mixkit-retro-game-notification-212.wav").play()
    loadLevel();
}

function loadLevel() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard, level1);

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

function startPrompt(){
    const audioPrompt = document.getElementById("audio_prompt");
    let showPromptInterval = setInterval(() => {
        alpha = fadeOutPrompt();
        audioPrompt.style.opacity = alpha; //fading in and out the prompt
    }, 50); 
    intervals.push(showPromptInterval)
    startMusic(audioPrompt,);
}

function fadeOutPrompt(){
    if (fadingOut) {
        alpha -= 0.05; // Transparenz verringern
        if (alpha <= 0) {
            alpha = 0;
           fadingOut = false; // Richtung ändern, wenn vollständig transparent
        };
        return alpha;
    } else {
        alpha += 0.05; // Transparenz erhöhen
        if (alpha >= 1) {
            alpha = 1;
            fadingOut = true; // Richtung ändern, wenn vollständig sichtbar
        };
        return alpha;
    };
}

function startMusic(audioPrompt){
    const promptContainer = document.getElementById("div_prompt");

    document.addEventListener("keydown", () => {
        soundStartScreen.play();
        stopAllIntervals();
        audioPrompt.style.display = "none";
        promptContainer.style.display = "none";
    }, { once: true }); // Der Listener wird nur einmal ausgeführt
}

function stopAllIntervals(){
    intervals.forEach(interval => clearInterval(interval));
    intervals = [];
}

function toggleSoundEffect(){
    let soundImage = document.getElementById("sound_btn_img");
    if(soundImage.src.includes("sound-on-blk.png")){
    soundImage.src = "assets/img/icons/sound-off.png";
    } else{
    soundImage.src = "assets/img/icons/sound-on-blk.png";
    }
}

