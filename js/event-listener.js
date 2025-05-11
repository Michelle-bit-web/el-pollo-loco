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
        if (this.world.controlEnabled && keyMap[event.keyCode]) {
            keyboard[keyMap[event.keyCode]] = true;
        }
    });

    window.addEventListener("keyup", event => {
        if (this.world.controlEnabled &&keyMap[event.keyCode]) 
            {keyboard[keyMap[event.keyCode]] = false;
            }
    });

}

function touchEvents(){
    Object.values(buttonMap).forEach(buttonId => {
    const button = document.getElementById(`${buttonId}`);
    console.log(button);
    button.addEventListener("touchstart", event => {
        event.preventDefault(); //to prevent other standard actions for this event-type by browser
        keyboard[buttonId]= true;
    });
    button.addEventListener("touchend", event => {
         event.preventDefault();
        keyboard[buttonId] = false;
    });
});  
}

// // Umschalten des Mute-Status
// document.getElementById("sound_btn").addEventListener("click", () => {
//     AudioManager.toggleMute(); // Schaltet den globalen Mute-Status um
// });

function soundEvent(){
     document.getElementById("sound_btn").addEventListener("click", toggleSoundSetting);
}