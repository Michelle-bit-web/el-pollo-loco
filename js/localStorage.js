function getFromLocalStorage(){
    const muteStatus = localStorage.getItem("isMuted");
    if(muteStatus !== null){
        isMuted = (muteStatus === "true");
    } else{
        return isMuted;
    }
}

function saveToLocalStorage(){
    localStorage.setItem("isMuted", isMuted);
}