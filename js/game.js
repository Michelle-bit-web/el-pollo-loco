let canvas;
let world;
let gameIsRunning = false;
let controlEnabled = true;
let switchedPromptImage = false;
let keyboard = new Keyboard();
let intervals = [];
let fadingOut = true;
let alpha = 1;

function init() {
    AudioManager.loadMuteStatus(); //Mute-Status des localStorage über AM
    setSoundImage();
    audioList.mainTheme.shouldPlay = true;
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
    
    AudioManager.sounds.forEach(audio => audio.shouldPlay = true)
    audioList.mainTheme.stop();
    audioList.mainTheme.shouldPlay = false;
    audioList.gamePlay.play();
    
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
    if(isTouchDevice()){
        touchEvents();
    } else{
        keyboardEvents();
    }
}

function startPrompt(){
    const promptText = document.getElementById("prompt-overlay");
    const touchPrompt = document.getElementById("prompt-touch");
    const mobilePromptText = document.getElementById("prompt-mobile");
    const mobilePortraitIcon = document.getElementById("mobile-prompt-img-portrait");
    const mobileLandscapeIcon = document.getElementById("mobile-prompt-img-landscape");
    let prompts = [promptText, touchPrompt,  mobilePromptText, mobilePortraitIcon, mobileLandscapeIcon];
    if (isTouchDevice()) {
        setTouchSetting(touchPrompt);
    } else{
        setKeySetting(promptText);
    }
    prompts.forEach(prompt => setPromptFadingInterval(prompt, mobilePortraitIcon, mobileLandscapeIcon));
}

function setTouchSetting(touchPrompt){
    setPrompt("Touch screen", touchPrompt);
    // touchEvents();
    checkTouchResponse(touchPrompt);
}

function setKeySetting(promptText){
    setPrompt("Press Any Key", promptText);
    // keyboardEvents();
    checkKeyResponse(promptText);
}

function setPrompt(text, overlay){
    return overlay.innerText = `${text}`,
    overlay.style.textAlign = "center";
}

function hidePrompt(prompt){
     prompt.style.display = "none";
}

function showPrompt(prompt){
    prompt.style.display = "flex";
}

function removePrompt(prompt, promptContainer) {
    if (prompt) {hidePrompt(prompt)} 
    if (promptContainer) {hidePrompt(promptContainer)} 
    stopAllIntervals();
    audioList.mainTheme.play();
    AudioManager.loadMuteStatus();
}

function setPromptFadingInterval(prompt, mobilePortraitIcon, mobileLandscapeIcon){

    let showPromptInterval = setInterval(() => {
        alpha = fadeOutPrompt();
        prompt.style.opacity = alpha; 
        if(window.screen.orientation.type.startsWith("portrait")){
            rotateMobileIcon(mobilePortraitIcon, mobileLandscapeIcon, alpha);
        }
    }, 150); 
    intervals.push(showPromptInterval);
}

function rotateMobileIcon(promptImagePortrait, promptImageLandscape, alpha){
   
    if(!switchedPromptImage && alpha <= 0.1){
        hidePrompt(promptImagePortrait);
        showPrompt(promptImageLandscape);
        switchedPromptImage = true;
        console.log("landscape")
    }else if (switchedPromptImage && alpha >= 0.9){
        showPrompt(promptImagePortrait);
        hidePrompt(promptImageLandscape);
        switchedPromptImage = false;
        console.log("portrait")
    }
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
     alpha -= 0.02; // Transparenz verringern
        if (alpha <= 0) {
            alpha = 0;
           fadingOut = false; // Richtung ändern, wenn vollständig transparent
        };
}

function increaseTransparence(){
     alpha += 0.02; // Transparenz erhöhen
        if (alpha >= 1) {
            alpha = 1;
            fadingOut = true; // Richtung ändern, wenn vollständig sichtbar
        };
}

function checkKeyResponse(prompt) {
    const promptContainer = document.getElementById("div_prompt");
    document.addEventListener("keydown", () => {
        removePrompt(prompt, promptContainer); // Entferne Prompt bei Tastendruck
    }, { once: true });
}

function checkTouchResponse(prompt) {
    const promptContainer = document.getElementById("div_prompt");
    document.addEventListener("touchstart", () => {
        removePrompt(prompt, promptContainer); // Entferne Prompt bei Touch
    }, { once: true });
}

function stopAllIntervals(){
    intervals.forEach(interval => clearInterval(interval));
    intervals = [];
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
    controlEnabled = true; 
    AudioManager.resumeAll();
}

//Sound handling
function toggleSoundSetting() {
    AudioManager.toggleMute();
    setSoundImage();
}

function setSoundImage(){
    const soundImage = document.getElementById("sound_btn_img");
    const soundImageGameplay = document.getElementById("sound_btn_img_gameplay");
    if (AudioManager.isMuted) {
        soundImage.src = "assets/img/icons/sound-off.png"; 
        if(soundImageGameplay){
            soundImageGameplay.src = "assets/img/icons/sound-off.png"; 
        }
    } else {
        soundImage.src = "assets/img/icons/sound-on-blk.png"; 
        if(soundImageGameplay){
            soundImageGameplay.src = "assets/img/icons/sound-on-blk.png"; 
        }
    }
}

//handling Menu / Gameplay buttons
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
    Object.values(audioList).forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
  if (world.character) {
    world.character.stopAllAnimations();
    clearInterval(world.character.gravityInterval);
  }
    // document.getElementById("overlay").style.display = "none";
    keyboard = new Keyboard();
    intervals = [];
    world = null;
    startGame();
}