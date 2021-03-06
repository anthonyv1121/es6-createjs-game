import { MoveableGameObject, GameObject } from "./base/GameObjectBase.js";

export class Hero extends MoveableGameObject {
  constructor(store) {
    super(new lib.HeroGraphic(), store);
    console.log("Hero", store);
    this.velocity.x = 1;
    // this.graphic.gotoAndPlay
  }
  run() {
    if (!this.onGround) {
      this.velocity.x = 2;
      this.graphic.gotoAndPlay("run");
      this.onGround = true;
    }
  }

  jump() {
    if (this.onGround) {
      this.velocity.y = -3;
      this.graphic.gotoAndPlay("jump");
      this.onGround = false;
    }
  }
  stop() {
    this.graphic.gotoAndStop(2);
  }
}

export class Enemy extends MoveableGameObject {
  constructor(store) {
    super(new lib.ObstacleGraphic(), store);
    console.log("Enemy", store);
    this.directionX = -1; // value either -1 or +1 : determines if it should move right or left
    this.speed = 0.5; // how far it moves
    this.offsetX = 0; // how far is it from original X position
    this.maxOffset = 10; // max offset it will make before it turns around into the other direction.

    this.on("tick", this.move);
  }
  move() {
    this.velocity.x = this.speed * this.directionX;
    this.offsetX += this.velocity.x;

    if (Math.abs(this.offsetX) > this.maxOffset) {
      this.directionX * -1; // If accumulated offset is larger than the max offset, we change the direction by multiplying minus one
    }
  }
}

export class Platform extends GameObject {
  constructor() {
    super(new lib.PlatformGraphic());
  }
  setClippingWidth(width) {
    this.graphic.instance.mask = new createjs.Shape(
      new createjs.Graphics()
        .beginFill("#000")
        .drawRect(0, 0, width, this.getBounds().height)
    );
    this.setBounds(this.x, this.y, width, this.getBounds().height);
  }
}

export class Coin extends GameObject {
  constructor() {
    super(new lib.CoinGraphic());
  }
}
