import { Hero, Enemy, Platform, Coin } from "./GameObjects.js";
import { getBounds, getObjSpec } from "./constants.js";

export class World extends createjs.Container {
  constructor(specs, store) {
    super();
    this.level;
    this.specs = specs;
    this.store = store;

    this.store.subscribe((state, action) => {
      let { type, payload } = action;
      let index = state.world.platforms.indexOf(payload);
      if (type === "PLATFORM_ADDED" && payload instanceof Platform) {
        this.generateCoins(payload);
        this.generateEnemies(payload, index);
      }
    });
  }
  createWorld(level) {
    this.level = level;
    this.resetWorld();
    this.generatePlatforms();
    this.on("tick", this.tick);
  }
  resetWorld() {
    this.removeAllChildren();
    this.x = 0;
    this.addHero();
  }
  tick(e) {
    let { worldLevelComplete, heroFallen } = this.store.state.world;
    !worldLevelComplete && !heroFallen ? this.startWorldTick(e) : e.remove();
  }
  startWorldTick(e) {
    let { coins, enemies, platforms } = this.store.state.world;
    this.applyGravity(this.hero, platforms);

    // Check enemy hits hero
    let enemyHit = this.targetHitTestObjects(this.hero, enemies);
    if (enemyHit !== false) {
      this.hero.y += 20;
      console.log("enemy hit!", enemyHit);
      this.store.dispatch({ type: "HERO_HAS_BEEN_HIT", payload: true });
    }

    // check hero eats coin
    let coinHit = this.targetHitTestObjects(this.hero, coins);
    if (coinHit !== false) {
      console.log("coin hit!", coinHit);
      coinHit.parent.removeChild(coinHit);
      this.store.dispatch({ type: "COIN_GRABBED", payload: coinHit });
    }

    // check hero has fallen
    if (this.hero.y >= this.specs.height) {
      console.log("Hero has fallen!");
      this.store.dispatch({ type: "HERO_HAS_FALLEN", payload: true });
    }

    // check currentLevel is complete
    let lastPlatform = platforms[platforms.length - 1];
    if (
      this.objectsHitTest(
        this.hero,
        lastPlatform,
        getObjSpec(lastPlatform).width * 0.98
      )
    ) {
      this.store.dispatch({ type: "WORLD_LEVEL_COMPLETE", payload: true });
    }
    // follow the hero's X axis - Technique called Camera
    this.x -= this.hero.velocity.x; // moves the world backwards to give illusion hero is running
  }

  addHero() {
    const hero = new Hero(this.store);
    this.addChild(hero);
    hero.x = hero.y = 100;
    this.hero = hero;
  }
  generatePlatforms() {
    const { gapX, gapY, total, widthDiff } = this.level;
    let startX = 100;
    let startY = 200;

    for (let i = 0; i < total; i++) {
      let platform = new Platform();
      platform.x = startX;
      platform.y = startY;

      let width = getBounds(platform).width;
      platform.setClippingWidth(width - Math.random() * widthDiff);

      // this.platforms.push(platform);

      startX = platform.x + width + Math.random() * gapX;
      startY = platform.y + (Math.random() - 0.5) * gapY;

      this.addChild(platform);
      this.store.dispatch({ type: "PLATFORM_ADDED", payload: platform });
      console.log(platform.y);
    }
  }
  generateEnemies(platform, index) {
    // this.platforms.forEach((platform, index) => {
    if (index > 2 && Math.random() < this.level.enemyChance) {
      // start adding enemies after a few platforms have been added and at random 30% chance
      let enemy = new Enemy(this.store);
      enemy.x = platform.x + platform.getBounds().width / 2;
      enemy.y = platform.y - enemy.getBounds().height;

      this.addChild(enemy);
      this.store.dispatch({ type: "ENEMY_ADDED", payload: enemy });
    }
    // });
  }

  generateCoins(platform) {
    // this.platforms.forEach(platform => {
    if (Math.random() < this.level.coinChance) {
      // 80% chance
      let coin = new Coin();
      coin.x = platform.x + Math.random() * platform.getBounds().width;
      coin.y = platform.y - coin.getBounds().height;
      this.addChild(coin);
      this.store.dispatch({ type: "COIN_ADDED", payload: coin });
    }
    // });
  }

  applyGravity(object, platformsArray) {
    const gravity = 0.1;
    const terminalVelocity = 5; // max value of falling
    object.velocity.y += gravity;
    object.velocity.y = Math.min(object.velocity.y, terminalVelocity); // restrict falling velocity to terminalVelocity

    // if obj is near any platforms set velocity to 1 to avoid obj passing through the platform
    if (this.willObjectHitGround(object, platformsArray)) {
      object.velocity.y = 1;
    }
    let platform = this.isObjectOnGround(object, platformsArray);
    // when obj hits platform and velocity is still positive value, make obj stand on the platform
    if (platform !== false && object.velocity.y > 0) {
      object.velocity.y = 0;
      object.run();
    }
    // console.log(`object.y: ${object.y} `);
  }
  isObjectOnGround(object, platformsArray) {
    const objH = object.getBounds().height;

    for (let platform of platformsArray) {
      const platformW = platform.getBounds().width,
        platformH = platform.getBounds().height;

      if (
        object.x >= platform.x &&
        object.x < platform.x + platformW &&
        object.y + objH >= platform.y &&
        object.y + objH <= platform.y + platformH
      ) {
        return platform; // returns which platform is having collision with the target object
      }
    }
    return false;
  }
  // check if object will hit the platform in the next frame. checks before obj.y position hits platform.y position
  willObjectHitGround(object, platformsArray) {
    const objH = object.getBounds().height;
    const objNextY = object.y + objH + object.velocity.y;

    for (let platform of platformsArray) {
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
  //The distance between two objects' position should be less than half their width or height. If both x and y axis meet the collision, then it would mean that these two rectangles collide together. We multiply the distance of their position instead of dividing because multiplication is a little bit faster.
  objectsHitTest(object1, object2, offset) {
    const obj1Spec = getObjSpec(object1);
    const obj2Spec = getObjSpec(object2);

    if (typeof offset !== "number") {
      offset = 0;
    }

    return (
      obj1Spec.x >= obj2Spec.x + offset - obj1Spec.width &&
      obj1Spec.x <= obj2Spec.x + offset + obj2Spec.width &&
      obj1Spec.y >= obj2Spec.y - obj1Spec.width &&
      obj1Spec.y <= obj2Spec.y + obj2Spec.width
    );
    // return (
    //   Math.abs(obj1Spec.x - obj2Spec.x) * 2 < obj1Spec.width + obj2Spec.width &&
    //   Math.abs(obj1Spec.y - obj2Spec.y) * 2 < obj1Spec.height + obj2Spec.height
    // );
  }

  targetHitTestObjects(target, objects) {
    for (let obj of objects) {
      if (this.objectsHitTest(target, obj)) {
        return obj;
      }
    }
    return false;
  }
}
