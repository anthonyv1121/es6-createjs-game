export class Score {
  constructor() {
    this.reset();
  }
  increaseScore(level) {
    this.currentScore += Math.pow(level + 1, 2); // add the level number to the score in an exponential scale
  }
  reset() {
    this.currentScore = this.set(0);
  }
  set(value) {
    return value;
  }
}
