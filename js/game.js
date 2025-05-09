let canvas;
let backgroundMusicIntro = new AudioManager("assets/audio/background/Faster_Version-2024-02-19_-_Mexican_Cowboys_-_www.FesliyanStudios.com.mp3", 0.5, true, 1)
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
    const audioPrompt = document.getElementById("audio_prompt");
    const promptContainer = document.getElementById("div_prompt");
    let alpha = 1;
    let fadingOut = true;
    let firstUIInterval = setInterval(() => {
        if (fadingOut) {
            alpha -= 0.05; // Transparenz verringern
            if (alpha <= 0) {
                alpha = 0;
                fadingOut = false; // Richtung ändern, wenn vollständig transparent
            }
        } else {
            alpha += 0.05; // Transparenz erhöhen
            if (alpha >= 1) {
                alpha = 1;
                fadingOut = true; // Richtung ändern, wenn vollständig sichtbar
            }
        }
        audioPrompt.style.opacity = alpha; // Aktualisiere die Transparenz
    }, 50); // Aktualisierung alle 50ms für flüssige Animation

    document.addEventListener("keydown", () => {
        backgroundMusicIntro.play();
        console.log("Hintergrundmusik gestartet.");
        clearInterval(firstUIInterval);
        audioPrompt.style.display = "none";
        promptContainer.style.display = "none";
    }, { once: true }); // Der Listener wird nur einmal ausgeführt
 // Zeige das Canvas
//  const canvasElement = document.getElementById("canvas");
//  canvasElement.style.display = "block";
}

function startGame() {
    backgroundMusicIntro.stop();
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
