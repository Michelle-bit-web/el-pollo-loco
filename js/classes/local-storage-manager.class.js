// function getFromLocalStorage(){
//     const storedMuteStatus = localStorage.getItem("isMuted");
//     if(storedMuteStatus !== null){
//         AudioManager.isMuted = (storedMuteStatus === "true");
//     } else{
//         return isMuted;
//     }
// }

// function saveToLocalStorage(){
//     localStorage.setItem("isMuted", AudioManager.isMuted);
// }

class StorageManager {
    static save(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static load(key) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }
}