class AudioManager {
    constructor(src, vol, loop, length){
        this.src = src;
        this.length = length;
        this.audio = new Audio(src);
        this.volume = vol;
        this.audioLoop = loop;
        console.log('GameOverSound:', this.audio);
    }

    play() {
        if (this.audio) {
            this.audio.play().catch(error => {
                console.error('Fehler beim Abspielen der Audiodatei:', error);
            });
        } else {
            console.error('Audio-Objekt ist nicht initialisiert.');
        }
        this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0; // Setze die Wiedergabe auf den Anfang zurück
    }

    setVolume(volume) {
        this.audio.volume = Math.min(Math.max(volume, 0), 1); // Begrenze das Volume zwischen 0 und 1
    }

    getLength() {
        return this.audio.duration; // Gibt die Länge der Audiodatei in Sekunden zurück
    }

    isPlaying() {
        return !this.audio.paused;
    }
}