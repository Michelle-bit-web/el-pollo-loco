let canvas;
let world;
let gameIsRunning = false;
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
    removeOverlay("overlay");
    getGameplayOverlay();
    loadLevel();
    setSoundImage();
    if(isTouchDevice()){
        document.getElementById("panel").style.display = "flex";
    };
}

function removeOverlay(currentOverlay){
    const overlay = document.getElementById(currentOverlay);
    overlay.style.display = "none";
}

function getGameplayOverlay(){
    let gameplayOverlay = document.getElementById("overlay-gameplay");
    gameplayOverlay.style.display = "flex";
    gameplayOverlay.innerHTML = gamePlayHtmlTemplate();
}

function loadLevel() {
    canvas = document.getElementById("canvas");
    gameIsRunning = true;
    world = new World(canvas, keyboard, level1, controlEnabled); //gibt man level2 mit, würde das level 2 integriert werden
    if (isTouchDevice()) {
        touchEvents();
    } else {
        keyboardEvents();
    };
}

function startPrompt(){
    const promptOverlay = document.getElementById("prompt-overlay");
    if (isTouchDevice()) {
        monitorOrientation();
        if (window.screen.orientation.type.startsWith("portrait")) {
            promptOverlay.innerText = "Rotate device  \u21BB"; 
            promptOverlay.style.textAlign = "center";
            checkOrientation(promptOverlay); 
        } else {
            promptOverlay.innerHTML = "Touch screen";
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
    }, { once: true }); // Listener nur 1x ausgeführt
    document.addEventListener("touchstart", () => {
       if (window.screen.orientation.type.startsWith("landscape")) {
            removePrompt(promptOverlay, promptContainer);
        }
    }, { once: true });
}

function removePrompt(promptOverlay, promptContainer) {
    if (promptOverlay) {
        promptOverlay.style.display = "none";
    } 

    if (promptContainer) {
        promptContainer.style.display = "none";
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

function handleExitButton(){
if(!gameIsRunning){
    renderMainMenu();
} else{
    document.getElementById("overlay").style.display = "none";
}
}

function backToMenu(){
    window.location.reload();
}

function resetGame(){
    console.log('play again clicked')
    // document.getElementById("overlay").style.display = "none";
    keyboard = new Keyboard();
    intervals = [];
    world = null;
    startGame();
}