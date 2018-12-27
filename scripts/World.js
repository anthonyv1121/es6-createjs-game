import { Hero, Enemy, Platform } from "./GameObjects.js";

export class World extends createjs.Container {
  constructor(graphic) {
    super();

    this.on("tick", this.tick);

    // store all platforms
    this.platforms = [];

    this.generatePlatforms();
    this.addHero();
    this.addEnemy();
  }
  tick() {
    this.applyGravity(this.hero);

    // follow the hero's X axis - Technique called Camera
    this.x -= this.hero.velocity.x; // moves the world backwards to give illusion hero is running
  }

  addHero() {
    const hero = new Hero();
    this.addChild(hero);
    hero.x = hero.y = 100;
    this.hero = hero;
  }
  generatePlatforms() {
    let platform = new Platform();
    this.addChild(platform);
    this.platforms.push(platform);
    platform.x = 100;
    platform.y = 300;

    platform = new Platform();
    this.addChild(platform);
    this.platforms.push(platform);
    platform.x = 250;
    platform.y = 300;
  }
  addEnemy() {
    this.enemy = new Enemy();
    this.addChild(this.enemy);
    this.enemy.x = 250;
    this.enemy.y = 100;
  }
  applyGravity(object) {
    const gravity = 0.1;
    const terminalVelocity = 5; // max value of falling
    object.velocity.y += gravity;
    object.velocity.y = Math.min(object.velocity.y, terminalVelocity); // restrict falling velocity to terminalVelocity

    // if obj is near any platforms set velocity to 1 to avoid obj passing through the platform
    if (this.willObjectHitGround(object)) {
      object.velocity.y = 1;
    }
    // when obj hits platform and velocity is still positive value, make obj stand on the platform
    if (this.isObjectOnGround(object) && object.velocity.y > 0) {
      object.velocity.y = 0;
      object.run();
    }
    // console.log(`object.y: ${object.y} `);
  }
  isObjectOnGround(object) {
    const objW = object.getBounds().width,
      objH = object.getBounds().height;

    for (let platform of this.platforms) {
      const platformW = platform.getBounds().width,
        platformH = platform.getBounds().height;

      if (
        object.x >= platform.x &&
        object.x < platform.x + platformW &&
        object.y + objH >= platform.y &&
        object.y + objH <= platform.y + platformH
      ) {
        return true;
      }
    }
    return false;
  }
  // check if object will hit the platform in the next frame. checks before obj.y position hits platform.y position
  willObjectHitGround(object) {
    const objW = object.getBounds().width;
    const objH = object.getBounds().height;
    const objNextY = object.y + objH + object.velocity.y;

    for (let platform of this.platforms) {
      const platformW = platform.getBounds().width,
        platformH = platform.getBounds().height;

      if (
        object.x >= platform.x &&
        object.x < platform.x + platformW &&
        objNextY >= platform.y &&
        objNextY <= platform.y + platformH
      ) {
        return true;
      }
    }
    return false;
  }
}
