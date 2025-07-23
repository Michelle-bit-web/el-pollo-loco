class AudioManager {
    static sounds = [];
    static isMuted = false;

    constructor(src, vol, loop = false){ 
        this.src = src;
        this.audio = new Audio(src);
        this.audio.volume = vol;
        this.audio.loop = loop;
        this.shouldPlay = false;
        AudioManager.sounds.push(this);
    }

    play() {
        if(this.audio.readyState == 4 && !AudioManager.isMuted && this.shouldPlay){
            // this.audio.currentTime = 0;
            this.shouldPlay = true;
            this.audio.play(); 
        } else {
            return;
        }
    }

    isPlaying() {
        return !this.audio.paused;
    }

    pause() {
        this.audio.pause();
        this.shouldPlay = false;
    }

    stop() {
        this.audio.pause();
        this.shouldPlay = false;
        this.audio.currentTime = 0;
    }

    getLength() {
        return this.audio.duration;
    }

    updateMuteStatus() {
        if (AudioManager.isMuted) {
            this.audio.pause();
        } else {
            if(this.shouldPlay && this.audio.loop)
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
                    sound.audio.currentTime = 0;
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
        const storedMuteStatus = StorageManager.load('isMuted');
        if (storedMuteStatus !== null) {
            AudioManager.isMuted = storedMuteStatus === true;
        } else {
            AudioManager.isMuted = false;
        }
        AudioManager.sounds.forEach((sound) => sound.updateMuteStatus());
    }
}