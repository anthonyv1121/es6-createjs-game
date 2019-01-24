"use strict";

import { Game } from "./Game.js";
import { LevelData } from "./data.js";
import { sounds } from "./constants.js";

// start the game
const GameBoilerplate = (_canvas, cjs, fps, loader) => {
  let canvas = document.getElementById(_canvas),
    stage = new cjs.Stage(canvas);

  const neutralizeSize = () => {
    stage.width = canvas.width;
    stage.height = canvas.height;
  };
  const retinalize = () => {
    neutralizeSize(stage, canvas);
    let ratio = window.devicePixelRatio;

    console.log(ratio);

    if (ratio === undefined) {
      return;
    }

    canvas.setAttribute("width", Math.round(stage.width * ratio));
    canvas.setAttribute("height", Math.round(stage.height * ratio));

    stage.scaleX = stage.scaleY = ratio;

    canvas.style.width = stage.width + "px";
    canvas.style.height = stage.height + "px";
  };

  neutralizeSize();
  stage.enableMouseOver();
  cjs.Touch.enable(stage);
  cjs.Ticker.setFPS(fps);
  cjs.Ticker.on("tick", stage);
  loader();

  return {
    canvas,
    stage,
    cjs,
    retinalize,
    neutralizeSize
  };
};
// This class controls the game data.
class GameDataService {
  constructor(levelData, sounds) {
    return this.getData({ levels: levelData, sounds });
  }
  getData(data) {
    return {
      levels: this.getLevelData(data.levels),
      sounds: data.sounds
    };
  }
  getLevelData(levels) {
    return new levels().levels;
  }
}

const data = new GameDataService(LevelData, sounds);
const ES6Game = new Game(data, GameBoilerplate);
window.game = ES6Game;
