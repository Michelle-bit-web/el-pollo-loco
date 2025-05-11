let canvas;
let world;
let gameIsRunning = true;
// let sounds = [];
// let isMuted = false;
let soundStartScreen = new AudioManager("assets/audio/background/Faster_Version-2024-02-19_-_Mexican_Cowboys_-_www.FesliyanStudios.com.mp3", 0.5, true, 1)
let keyboard = new Keyboard();
let intervals = [];
let fadingOut = true;
let alpha = 1;

function init() {
    AudioManager.loadMuteStatus(); //Mute-Status des localStorage über AM
    toggleSoundSetting(); // Initialisiere den Sound-Status
    startPrompt();
    soundEvent();
}

// Funktion zur Erkennung von Touch-Geräten
function isTouchDevice() {
    return (
        "ontouchstart" in window || // Prüft, ob das Gerät Touch-Events unterstützt
        navigator.maxTouchPoints > 0 || // Für neuere Geräte mit mehreren Touchpunkten
        navigator.msMaxTouchPoints > 0 // Für ältere Microsoft-Geräte
    );
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
      // Geräteabhängig Events hinzufügen
    if (isTouchDevice()) {
        console.log("Touch device detected. Initializing touch events...");
        touchEvents();
    } else {
        console.log("Non-touch device detected. Initializing keyboard events...");
        keyboardEvents();
    };
}

function startPrompt(){
    const promptOverlay = document.getElementById("prompt-overlay");
    if(isTouchDevice()){
        promptOverlay.innerText = "Touch screen";
    }
    let showPromptInterval = setInterval(() => {
        alpha = fadeOutPrompt();
        promptOverlay.style.opacity = alpha; //fading in and out the prompt
    }, 50); 
    intervals.push(showPromptInterval);
    checkUserResponse(promptOverlay);
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

function checkUserResponse(promptOverlay){
    const promptContainer = document.getElementById("div_prompt");

    document.addEventListener("keydown", () => {
        removePrompt(promptOverlay, promptContainer);
    }, { once: true }); // Der Listener wird nur einmal ausgeführt
   
    document.addEventListener("touchstart", () => {
        removePrompt(promptOverlay, promptContainer);
    }, { once: true }); // Der Listener wird nur einmal ausgeführt
}

function removePrompt(promptOverlay, promptContainer) {
    AudioManager.sounds.push(soundStartScreen);
    stopAllIntervals();
    promptOverlay.style.display = "none";
    promptContainer.style.display = "none";
    AudioManager.loadMuteStatus();
}

function stopAllIntervals(){
    intervals.forEach(interval => clearInterval(interval));
    intervals = [];
}

function toggleSoundSetting() {
    // Schalte den globalen Mute-Status um
    AudioManager.toggleMute();

    // Aktualisiere das Sound-Icon basierend auf dem Mute-Status
    const soundImage = document.getElementById("sound_btn_img");
    if (AudioManager.isMuted) {
        soundImage.src = "assets/img/icons/sound-off.png"; // Icon für "Sound aus"
    } else {
        soundImage.src = "assets/img/icons/sound-on-blk.png"; // Icon für "Sound an"
    }
}


// function switchSoundSetting(){
//     let soundImage = document.getElementById("sound_btn_img");
//     if(!isMuted){
//     soundImage.src = "assets/img/icons/sound-off.png";
//     muteSounds(soundStartScreen);
//      isMuted = true;
//     } else if (isMuted){
//     soundImage.src = "assets/img/icons/sound-on-blk.png";
//     playSounds(soundStartScreen);
//     isMuted = false;
//     };

//     saveToLocalStorage();
// }

// function muteSounds(audio){
//     if(audio == undefined){
//         sounds.forEach(sound => {
//             sound.pause();
//         })
//     } else{
//         audio.pause();
//     };
    
// }

// function playSounds(audio){
//     if(audio == undefined){
//         sounds.forEach(sound => {
//             sound.play();
//         })
//     } else{
//         audio.play();
//     };
// }

// function applyMuteStatus(){
//      let soundImage = document.getElementById("sound_btn_img");
//     if(isMuted){
//     soundImage.src = "assets/img/icons/sound-off.png";
//     muteSounds(soundStartScreen);
//     } else{
//     soundImage.src = "assets/img/icons/sound-on-blk.png";
//     playSounds(soundStartScreen);
//     }
// }
