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
        if (world.controlEnabled &&keyMap[event.keyCode]) 
            {keyboard[keyMap[event.keyCode]] = false;
            } 
    });
}

function touchEvents(){
    Object.values(buttonMap).forEach(buttonId => {
    const button = document.getElementById(`${buttonId}`);
    button.addEventListener("touchstart", event => {
        event.preventDefault(); //to prevent other standard actions for this event-type by browser
        button.classList.add("active"); // Füge eine CSS-Klasse hinzu
        keyboard[buttonId]= true;
    });
    button.addEventListener("touchend", event => {
        event.preventDefault();
        button.classList.remove("active"); // Entferne die CSS-Klasse
        keyboard[buttonId] = false;
    });
});  
}

function soundEvent(){
     document.getElementById("sound_btn").addEventListener("click", toggleSoundSetting);
}

// Funktion zur Überprüfung auf Geräteausrichtung
function checkOrientation(promptOverlay) {
    // Eventlistener für Änderungen der Geräteausrichtung
    window.addEventListener("orientationchange", handleOrientationChange(promptOverlay));
}

function handleOrientationChange(promptOverlay) {
        if (window.screen.orientation.type.startsWith("landscape")) {
            promptOverlay.innerText = "Touch screen"; 
            // window.removeEventListener("orientationchange", handleOrientationChange); // Entferne den Listener
            checkUserResponse(promptOverlay);
        }
}

function renderControls(){
    let controls = document.getElementById("menu-overlay");
    controls.style.backgroundColor = "rgba(0, 0, 0, 0.797)";
    controls.style.color = "white";
    controls.innerHTML = controlsHtmlTemplate();
}

function renderMainMenu(){
    let controls = document.getElementById("menu-overlay");
    controls.style.backgroundColor = "unset";
    controls.style.color = "white";
    controls.innerHTML = mainMenuHtmlTemplate();
}