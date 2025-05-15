class AudioManager {
    static sounds = [];
    static isMuted = false;

    constructor(src, vol, loop = false){ 
        this.src = src;
        this.audio = new Audio(src);
        this.audio.volume = vol;
        this.audio.loop = loop; //Boolean zur Wiederholung der Audiodatei
        this.shouldPlay = false;
        AudioManager.sounds.push(this);
    }

    play() {
        return
         this.waitLoadingInterval = setInterval(() => {
            if(this.audio.readyState == 4 && !AudioManager.isMuted && this.shouldPlay){
                this.audio.currentTime = 0;
                this.audio.play();
                clearInterval(this.waitLoadingInterval)
            } else {
                console.log("sound not ready");
            }
         }, 200);
    }

    isPlaying() {
        return !this.audio.paused;
    }

    pause() {
        this.audio.pause();
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0; // Wiedergabe zurücksetzen
    }

    getLength() {
        return this.audio.duration; // Länge der Audiodatei in Sekunden
    }

    updateMuteStatus() {
        if (AudioManager.isMuted) {
            this.audio.pause();
        } else {
            if(this.shouldPlay)
            this.play();
        }
    }

    static pauseAll() {
        AudioManager.sounds.forEach(sound => sound.pause());
    }

    static resumeAll() {
        if (!AudioManager.isMuted) {
            AudioManager.sounds.forEach(sound => {
                if (sound.audio.currentTime > 1 && sound.audio.paused) {
                    sound.audio.play().catch(() => {});
                }
            });
        }
    }
    
    static toggleMute() {
        AudioManager.isMuted = !AudioManager.isMuted;
        AudioManager.sounds.forEach((sound) => sound.updateMuteStatus());
        AudioManager.saveMuteStatus();
    }

    static saveMuteStatus(){
        StorageManager.save('isMuted', AudioManager.isMuted);
    }

    static loadMuteStatus(){
        const storedMuteStatus = StorageManager.load('isMuted'); // Lade den gespeicherten Wert
    if (storedMuteStatus !== null) {
        AudioManager.isMuted = storedMuteStatus === true; // Setze den Wert basierend auf dem gespeicherten Status
    } else {
        AudioManager.isMuted = false; // Standardwert, wenn kein Speicherwert vorhanden ist
    }
    AudioManager.sounds.forEach((sound) => sound.updateMuteStatus()); // Aktualisiere den Status aller Sounds
}
}

//------------------------Vllt so:
function gameWonSound() {
    if (!isMuted) {
        audioList.gameWin.play();
    }
}
function gameOversound() {
    if (!isMuted) {
        audioList.gameOver.play();
    }
}
function playBackgroundMusic() {
    backgroundMusic.volume = 0.1;
    backgroundMusic.muted = backgroundMusicMuted;
    backgroundMusic.play();
}
function stopBackgroundMusic() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}
function updateSoundStatus() {
    backgroundMusicMuted = !backgroundMusicMuted;
    backgroundMusic.muted = backgroundMusicMuted;
    let musicToggleButton = document.getElementById('music-toggle-button');
    let soundIcon = document.getElementById('sound-icon');
    if (backgroundMusicMuted) {
        musicToggleButton.innerText = 'Sound Off';
        soundIcon.src = './img/12_icons/SOUND_OFF_icon.png';
    } else {
        musicToggleButton.innerText = 'Sound On';
        soundIcon.src = './img/12_icons/SOUND_ON_icon.png';
    }
    if (gameActive) {
        muteSounds();
    }
}
function toggleSoundAndImage() {
    isGameMuted = !isGameMuted;
    updateSoundStatus();
    muteSounds();
}

function muteSounds() {
    if (backgroundMusic) {
        backgroundMusic.muted = isGameMuted;
    }
    muteChickenSounds();
    muteCharacterSounds();
    muteEndbossSounds();
}
function muteChickenSounds() {
    if (world && world.level && world.level.enemies) {
        world.level.enemies.forEach((enemy) => {
            if (enemy instanceof Chicken) {
                enemy.death_sound.muted = isGameMuted;
            }
        });
    }
}
function muteEndbossSounds() {
    if (world && world.level && world.level.endboss) {
        world.level.endboss.forEach((endboss) => {
            endboss.alert_sound.muted = isGameMuted;
            endboss.hurt_sound.muted = isGameMuted;
            endboss.dead_sound.muted = isGameMuted;
        });
    }
}
function muteCoinSounds() {
    if (world && world.level && world.level.coins) {
        world.level.coins.forEach((coin) => {
            coin.collect_sound.muted = isGameMuted;
        });
    }
}
function muteBottleSounds() {
    if (world && world.level && world.level.bottles) {
        world.level.bottles.forEach((bottle) => {
            bottle.collect_sound.muted = isGameMuted;
        });
    }
}
function muteCharacterSounds() {
    if (world && world.character) {
        world.character.walking_sound.muted = isGameMuted;
        world.character.hurt_sound.muted = isGameMuted;
    }
}
