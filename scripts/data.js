export class LevelData {
  constructor() {
    this.levels = [
      {
        gapX: 0,
        gapY: 30,
        widthDiff: 0,
        total: 5,
        coinChance: 0.4,
        enemyChance: 0.3
      },
      {
        gapX: 10,
        gapY: 30,
        widthDiff: 30,
        total: 10,
        coinChance: 0.6,
        enemyChance: 0.4
      },
      {
        gapX: 20,
        gapY: 30,
        widthDiff: 30,
        total: 10,
        coinChance: 0.6,
        enemyChance: 0.45
      },
      {
        gapX: 40,
        gapY: 40,
        widthDiff: 100,
        total: 50,
        coinChance: 0.8,
        enemyChance: 0
      },
      {
        gapX: 20,
        gapY: 30,
        widthDiff: 30,
        total: 100,
        coinChance: 0.6,
        enemyChance: 0.55
      }
    ];
  }
}
