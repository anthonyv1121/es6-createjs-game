export class Score {
  constructor() {
    this.currentScore = 0;
  }
  increaseScore(level) {
    this.currentScore += Math.pow(level + 1, 2); // add the level number to the score in an exponential scale
  }
}
