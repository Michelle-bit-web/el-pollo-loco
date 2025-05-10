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
    const action = getButtonId()
    const button = document.getElementById(action);

    button.addEventListener("touchstart", event => {
        event.preventDefault();
        keyboard[action] = true;
    });
    button.addEventListener("touchend", () => {
        keyboard[action] = false;
    });
}

function getButtonId(){
   return Object.keys(buttonMap).forEach(buttonId => buttonMap[buttonId])
}