import { World } from "./World.js";

export class Game {
  constructor(gameData, config) {
    console.log(`Welcome to the game. Version ${this.version()}`);

    // this.loadSound();
    this.gameData = gameData;
    let { canvas, stage, retinalize } = config(
      "game-canvas",
      createjs,
      60,
      this.loadGraphics.bind(this)
    );
    this.canvas = canvas;
    this.stage = stage;
    retinalize();

    window.debugStage = this.stage;
  }
  version() {
    return "1.0.0";
  }

  createGame() {
    this.stage.addChild(new lib.BackgroundGraphic());

    this.world = new World();
    this.stage.addChild(this.world);
    const hero = this.world.hero;
    this.stage.on("stagemousedown", () => {
      console.log(hero);
      hero.jump();
    });
  }

  loadGraphics() {
    var loader = new createjs.LoadQueue(false);
    loader.addEventListener("fileload", handleFileLoad);
    loader.addEventListener("complete", handleComplete.bind(this));
    loader.loadFile(
      {
        src: "images/rush_game_graphics_atlas_.json",
        type: "spritesheet",
        id: "rush_game_graphics_atlas_"
      },
      true
    );
    loader.loadManifest(lib.properties.manifest);

    function handleFileLoad(evt) {
      if (evt.item.type == "image") {
        images[evt.item.id] = evt.result;
      }
    }

    function handleComplete(evt) {
      var queue = evt.target;
      ss["rush_game_graphics_atlas_"] = queue.getResult(
        "rush_game_graphics_atlas_"
      );

      this.restartGame();
    }
  }

  loadSound() {
    // createjs.Sound.alternateExtensions = ["ogg", "wav"];
    // createjs.Sound.registerSound("soundfx/jump7.aiff", "Jump");
    // createjs.Sound.registerSound("soundfx/game-over.aiff", "Game Over");
  }

  restartGame() {
    this.createGame();
  }

  handleClick(numberedBox) {}
}
