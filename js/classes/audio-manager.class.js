/**
 * Manages audio playback and global mute state for all game sounds.
 */
class AudioManager {
  /** @type {AudioManager[]} */
  static sounds = [];

  /** @type {boolean} */
  static isMuted = false;

  /**
   * Creates a new AudioManager instance for a specific audio source.
   * @param {string} src - The source URL of the audio file.
   * @param {number} vol - The initial volume (0.0 to 1.0).
   * @param {boolean} [loop=false] - Whether the audio should loop.
   */
  constructor(src, vol, loop = false) {
    /** @type {string} */
    this.src = src;

    /** @type {HTMLAudioElement} */
    this.audio = new Audio(src);
    this.audio.volume = vol;
    this.audio.loop = loop;

    /** @type {boolean} */
    this.shouldPlay = false;

    AudioManager.sounds.push(this);
  }

  /**
   * Attempts to play the audio if it is ready, not muted, and should play.
   */
  play() {
    if (this.audio.readyState === 4 && !AudioManager.isMuted && this.shouldPlay) {
      this.shouldPlay = true;
      this.audio.play();
    }
  }

  /**
   * Checks if the audio is currently playing.
   * @returns {boolean} True if the audio is playing, false otherwise.
   */
  isPlaying() {
    return !this.audio.paused;
  }

  /**
   * Pauses the audio and marks it as not scheduled for playback.
   */
  pause() {
    this.audio.pause();
    this.shouldPlay = false;
  }

  /**
   * Stops the audio playback and resets the playback position to the start.
   */
  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.shouldPlay = false;
  }

  /**
   * Gets the total duration of the audio in seconds.
   * @returns {number} The duration of the audio.
   */
  getLength() {
    return this.audio.duration;
  }

  /**
   * Updates the mute state for this audio based on the global mute flag.
   */
  updateMuteStatus() {
    if (AudioManager.isMuted) {
      this.audio.pause();
    } else if (this.shouldPlay && this.audio.loop) {
      this.play();
    }
  }

  /**
   * Pauses all registered sounds globally.
   */
  static pauseAll() {
    AudioManager.sounds.forEach((sound) => sound.pause());
  }

  /**
   * Resumes all paused sounds that were playing before, if not muted.
   */
  static resumeAll() {
    if (!AudioManager.isMuted) {
      AudioManager.sounds.forEach((sound) => {
        if (sound.audio.currentTime > 1 && sound.audio.paused) {
          sound.audio.currentTime = 0;
          sound.audio.play().catch(() => {});
        }
      });
    }
  }

  /**
   * Toggles the global mute state and updates all registered sounds.
   */
  static toggleMute() {
    AudioManager.isMuted = !AudioManager.isMuted;
    AudioManager.sounds.forEach((sound) => sound.updateMuteStatus());
    AudioManager.saveMuteStatus();
  }

  /**
   * Saves the global mute state to persistent storage.
   */
  static saveMuteStatus() {
    StorageManager.save("isMuted", AudioManager.isMuted);
  }

  /**
   * Loads the global mute state from persistent storage and applies it.
   */
  static loadMuteStatus() {
    const storedMuteStatus = StorageManager.load("isMuted");
    AudioManager.isMuted = storedMuteStatus === true;
    AudioManager.sounds.forEach((sound) => sound.updateMuteStatus());
  }
}