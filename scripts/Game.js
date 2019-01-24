import { World } from "./World.js";
import { Score } from "./Score.js";
import { GameViewManager } from "./GameViewManager.js";
import { SoundManager } from "./SoundManager.js";
import { reducers } from "./constants.js";
import { Store } from "./Store.js";

export class Game {
  constructor(gameData, config) {
    this.gameData = gameData;
    let { canvas, stage, cjs, retinalize } = config(
      "game-canvas",
      createjs,
      60,
      this.loadGraphics.bind(this)
    );
    this.canvas = canvas;
    this.stage = stage;
    this.cjs = cjs;
    this.score = new Score();
    this.gameLoaded = false;
    this.gvm = GameViewManager();
    this.soundManager = new SoundManager(this.cjs.Sound, this.gameData.sounds);
    this.loadSounds();

    this.gvm.startButton.addEventListener(
      "start game request",
      this.restartGame.bind(this)
    );

    this.gvm.nextLevelButton.addEventListener("start next level request", () =>
      this.store.dispatch({ type: "NEXT_LEVEL_REQUESTED" })
    );
    // retinalize();

    window.debugStage = this.stage;
  }
  version() {
    return "1.0.0";
  }
  createGame() {
    this.stage.addChild(new lib.BackgroundGraphic());
    this.levels = this.gameData.levels;
    this.store.subscribe(this.subscribeToStore.bind(this));

    this.world = new World(
      { height: this.stage.height, width: this.stage.width },
      this.store
    );
    this.initWorld();
    this.stage.addChild(this.world);

    this.stage.on("stagemousedown", () => this.world.hero.jump());
  }
  initWorld() {
    this.world.createWorld(this.levels[this.store.state.game.level]);
    this.gvm.hideLevelScreen();
  }
  subscribeToStore(state, action) {
    console.log("ACTION:", action, state);
    if (action.type === "HERO_HAS_FALLEN") {
      this.soundManager.playSound("heroFall");
      this.gvm.showHeroDeadScreen(() => this.soundManager.playSound("gameEnd"));
    }
    if (action.type === "WORLD_LEVEL_COMPLETE") {
      setTimeout(() => this.soundManager.playSound("levelComplete"), 1000);
      this.gvm.showLevelScreen(state.game.level + 1);
    }
    if (action.type === "NEXT_LEVEL_REQUESTED") {
      this.initWorld();
    }
    if (action.type === "COIN_GRABBED") {
      this.score.increaseScore(state.game.level);
      this.gvm.setGameScore(this.score.currentScore);
      this.soundManager.playSound("coinGrab");
    }
    if (action.type === "HERO_HAS_BEEN_HIT") {
      this.soundManager.playSound("enemyHit");
    }
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

      this.gameLoaded = true;
    }
  }

  loadSounds() {
    this.soundManager.loadAllSounds();
  }

  restartGame() {
    this.stage.removeAllChildren();
    this.gvm.setGameScore(0);
    this.store = new Store(reducers);
    this.createGame();
  }
}
