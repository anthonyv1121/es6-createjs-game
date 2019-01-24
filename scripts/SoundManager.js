export class SoundManager {
  constructor(cjsSound, sounds) {
    this.CJSSound = cjsSound;
    this.sounds = sounds;
  }
  playSound(sound) {
    this.CJSSound.play(sound);
  }
  loadAllSounds() {
    this.CJSSound.alternateExtensions = ["ogg", "wav", "mp3"];
    for (let key in this.sounds) {
      this.CJSSound.registerSound(this.sounds[key], key);
    }
  }
}
