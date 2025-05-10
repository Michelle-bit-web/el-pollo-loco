let canvas;
let world;
let gameIsRunning = true;
let soundStartScreen = new AudioManager("assets/audio/background/Faster_Version-2024-02-19_-_Mexican_Cowboys_-_www.FesliyanStudios.com.mp3", 0.5, true, 1)
let keyboard = new Keyboard();
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
    loadLevel();
}

function loadLevel() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard, level1);
    keyboardEvents();
}


function startPrompt(){
    const audioPrompt = document.getElementById("prompt-overlay");
    let showPromptInterval = setInterval(() => {
        alpha = fadeOutPrompt();
        audioPrompt.style.opacity = alpha; //fading in and out the prompt
    }, 50); 
    intervals.push(showPromptInterval)
    startMusic(audioPrompt,);
}

function fadeOutPrompt(){
    if (fadingOut) {
       reduceTransparence();
        return alpha;
    } else {
       increaseTransparence();
        return alpha;
    };
}

function reduceTransparence(){
     alpha -= 0.05; // Transparenz verringern
        if (alpha <= 0) {
            alpha = 0;
           fadingOut = false; // Richtung ändern, wenn vollständig transparent
        };
}

function increaseTransparence(){
     alpha += 0.05; // Transparenz erhöhen
        if (alpha >= 1) {
            alpha = 1;
            fadingOut = true; // Richtung ändern, wenn vollständig sichtbar
        };
}

function startMusic(audioPrompt){
    const promptContainer = document.getElementById("div_prompt");

    document.addEventListener("keydown", () => {
        playSounds(soundStartScreen);
        stopAllIntervals();
        audioPrompt.style.display = "none";
        promptContainer.style.display = "none";
    }, { once: true }); // Der Listener wird nur einmal ausgeführt
}

function stopAllIntervals(){
    intervals.forEach(interval => clearInterval(interval));
    intervals = [];
}

function switchSoundSetting(){
    let soundImage = document.getElementById("sound_btn_img");
    if(soundImage.src.includes("sound-on-blk.png")){
    soundImage.src = "assets/img/icons/sound-off.png";
    muteSounds(soundStartScreen);
    } else{
    soundImage.src = "assets/img/icons/sound-on-blk.png";
    playSounds(soundStartScreen);
    }
}

function muteSounds(audio){
   audio.pause();
}

function playSounds(audio){
    audio.play();
}

