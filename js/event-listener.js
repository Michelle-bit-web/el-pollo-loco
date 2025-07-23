const keyMap = {
    37: "LEFT",
    38: "UP",
    39: "RIGHT",
    40: "DOWN",
    32: "SPACE",
    68: "THROW" // Key D
};

const buttonMap = {
    "mobile-left": "LEFT",
    "mobile-right": "RIGHT",
    "mobile-jump": "SPACE",
    "mobile-throw": "THROW"
};

function keyboardEvents(){
    window.addEventListener("keydown", event => {
        if (world.controlEnabled && keyMap[event.keyCode]) {
            keyboard[keyMap[event.keyCode]] = true;
        }
    });
    window.addEventListener("keyup", event => {
        if (world.controlEnabled &&keyMap[event.keyCode]) {
            keyboard[keyMap[event.keyCode]] = false;
        } 
    });
}

function touchEvents(){
    Object.values(buttonMap).forEach(buttonId => {
        setButtonEvent(buttonId);
    });  
}

function setButtonEvent(buttonId) {
    const button = document.getElementById(`${buttonId}`);
        button.addEventListener("touchstart", event => {
            event.preventDefault();
            button.classList.add("active");
            keyboard[buttonId]= true;
        });
        button.addEventListener("touchend", event => {
            event.preventDefault();
            button.classList.remove("active");
            keyboard[buttonId] = false;
        });
}

function soundEvent(){
    document.getElementById("sound_btn").addEventListener("click", toggleSoundSetting);
}

function renderControls(initializer) {
    const controls = getMenuOverlayElement();
    if (!controls) return;
    if (initializer === "inGame") showOverlay();
    styleMenuOverlay(controls);
    controls.innerHTML = controlsHtmlTemplate();
    pauseGame();
}

function getMenuOverlayElement() {
    const el = document.getElementById("menu-overlay");
    if (!el) {
        console.error("Element with ID 'menu-overlay' not found in the DOM.");
        return null;
    }
    return el;
}

function showOverlay() {
    const overlay = document.getElementById("overlay");
    if (overlay) overlay.style.display = "flex";
}

function styleMenuOverlay(el) {
    el.style.backgroundColor = "rgba(0, 0, 0, 0.797)";
    el.style.color = "white";
}

function renderMainMenu(){
    let controls = document.getElementById("menu-overlay");
    controls.style.backgroundColor = "unset";
    controls.style.color = "white";
    controls.innerHTML = mainMenuHtmlTemplate();
}