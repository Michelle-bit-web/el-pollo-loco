class AudioManager {
    static sounds = [];
    static isMuted = false;

    constructor(src, vol, loop = false, length){ //length noch nötig?
        this.src = src;
        this.length = length;
        this.audio = new Audio(src);
        this.audio.volume = vol;
        this.audio.loop = loop; //Boolean zur Wiederholung der Audiodatei
        AudioManager.sounds.push(this);
        console.log('GameOverSound:', this.audio);
    }

    play() {
         if (!AudioManager.isMuted) {
            this.audio.play().catch((error) => {
                console.error('Fehler beim Abspielen der Audiodatei:', error);
            });
        } else {
            console.error('Audio-Objekt ist nicht initialisiert.');
        };
    }

    pause() {
        this.audio.pause();
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0; // Wiedergabe zurücksetzen
    }

    setVolume(volume) {
        this.audio.volume = Math.min(Math.max(volume, 0), 1); // Begrenzung zw. 0 und 1
    }

    getLength() {
        return this.audio.duration; // Länge der Audiodatei in Sekunden
    }

    isPlaying() {
        return !this.audio.paused;
    }

    updateMuteStatus() {
        if (AudioManager.isMuted) {
            this.audio.pause();
        } else {
            if(!this.audio.paused) return;
            this.audio.play().catch(() => {});
        }
    }

    static pauseAll() {
        AudioManager.sounds.forEach(sound => sound.pause());
    }

    static resumeAll() {
        if (!AudioManager.isMuted) {
            AudioManager.sounds.forEach(sound => {
                if (sound.audio.currentTime > 0 && sound.audio.paused) {
                    sound.audio.play().catch(() => {});
                }
            });
        }
    }
    
    static toggleMute() {
        AudioManager.isMuted = !AudioManager.isMuted;

        // Aktualisiere den Mute-Status für alle Sounds
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