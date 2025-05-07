class AudioManager {
    constructor(src, vol, loop, length){
        this.src = src;
        this.length = length;
        this.audio = new Audio(src);
        this.volume = vol;
        this.audioLoop = loop; //Boolean zur Wiederholung der Audiodatei
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
}