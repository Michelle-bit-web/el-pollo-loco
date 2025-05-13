let canvas;
let world;
let gameIsRunning = true;
let controlEnabled = true;
let soundStartScreen = new AudioManager("assets/audio/background/Faster_Version-2024-02-19_-_Mexican_Cowboys_-_www.FesliyanStudios.com.mp3", 0.2, true, 1)
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
    const menuOverlay = document.getElementById("overlay");
    menuOverlay.style.display = "none";
    getGameplayOverlay();
    loadLevel();
}

function getGameplayOverlay(){
    let gameplayOverlay = document.getElementById("overlay-gameplay");
    gameplayOverlay.style.display = "flex";
    gameplayOverlay.innerHTML = gamePlayHtmlTemplate();
}

function loadLevel() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard, level1, controlEnabled); //gibt man level2 mit, würde das level 2 integriert werden
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
        monitorOrientation();
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
       if (window.screen.orientation.type.startsWith("landscape")) {
            removePrompt(promptOverlay, promptContainer);
        }
    }, { once: true }); // Der Listener wird nur einmal ausgeführt
}

function removePrompt(promptOverlay, promptContainer) {
    if (promptOverlay) {
        promptOverlay.style.display = "none";
    } else {
        console.warn("Prompt overlay not found.");
    }

    if (promptContainer) {
        promptContainer.style.display = "none";
    } else {
        console.warn("Prompt container not found.");
    }
    AudioManager.sounds.push(soundStartScreen);
    stopAllIntervals();
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

function monitorOrientation(){
    let monitorOrientationInterval = setInterval(() => {
        if (!window.screen.orientation.type.startsWith("landscape")) {
            if (gameIsRunning) {
                pauseGame();
                showOrientationWarning();
            }
        } else {
            if (gameIsRunning) {
                 const promptOverlay = document.getElementById("prompt-overlay");
                resumeGame();
                checkOrientation(promptOverlay)
            }else return;
        }
    }, 500);
    intervals.push(monitorOrientationInterval);
}

function pauseGame() {
    console.log("Game paused due to incorrect orientation.");
    gameIsRunning = true;
    controlEnabled = false; // Deaktiviere Steuerung
    AudioManager.pauseAll();
}

function resumeGame() {
    console.log("Game resumed after orientation corrected.");
    gameIsRunning = false;
    controlEnabled = true; // Aktiviere Steuerung
    AudioManager.resumeAll();
}

function showOrientationWarning() {
    const promptOverlay = document.getElementById("prompt-overlay");
    promptOverlay.style.display = "flex"; // Zeige den Overlay
    promptOverlay.innerText = "Rotate device  \u21BB"; // Nachricht zum Drehen
    promptOverlay.style.textAlign = "center";
}

function hideOrientationWarning() {
    const promptOverlay = document.getElementById("prompt-overlay");
    promptOverlay.style.display = "none"; // Verstecke den Overlay
}

function backToMenu(){
    document.getElementById("overlay-gameplay").style.display = "none";
    init();
    // document.getElementById("prompt-overlay").style.display = "none";
}

function resetGame(){
    document.getElementById("overlay-gameplay").style.display = "none";
    startGame();
}