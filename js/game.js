let canvas;
let world;
let gameIsRunning = true;
let soundStartScreen = new AudioManager("assets/audio/background/Faster_Version-2024-02-19_-_Mexican_Cowboys_-_www.FesliyanStudios.com.mp3", 0.5, true, 1)
let keyboard = new Keyboard();
let intervals = [];
let fadingOut = true;
let alpha = 1;

function init() {
    AudioManager.loadMuteStatus(); //Mute-Status des localStorage über AM
    setSoundImage();
    startPrompt();
    soundEvent();
}

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
   // Überprüfe, ob es ein Touch-Gerät ist
    if (isTouchDevice()) {
        // Überprüfe die aktuelle Geräteausrichtung
        if (window.screen.orientation.type.startsWith("portrait")) {
            promptOverlay.innerText = "Rotate device  \u21BB"; // Nachricht zum Drehen
            promptOverlay.style.textAlign = "center";
            checkOrientation(promptOverlay); // Warte auf Änderung der Ausrichtung
        } else {
            promptOverlay.innerHTML = "Touch screen"; // Standardnachricht
        }
    }
    let showPromptInterval = setInterval(() => {
        alpha = fadeOutPrompt();
        promptOverlay.style.opacity = alpha; //fading in and out prompt
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
    AudioManager.toggleMute();
    setSoundImage();
}

function setSoundImage(){
    const soundImage = document.getElementById("sound_btn_img");
    if (AudioManager.isMuted) {
        soundImage.src = "assets/img/icons/sound-off.png"; 
    } else {
        soundImage.src = "assets/img/icons/sound-on-blk.png"; 
    }
}