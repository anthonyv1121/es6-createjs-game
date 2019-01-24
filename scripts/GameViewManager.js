import {
  DOM,
  showScreen,
  hideScreens,
  updateDOMElement,
  updateAlText
} from "./constants.js";

export const GameViewManager = () => {
  const [
      mainMenu,
      gameOverScene,
      heroDiedScene,
      scoreScene,
      levelScene,
      scoreText,
      startButton,
      exitButton,
      nextLevelButton,
      levelLabel
    ] = DOM(
      "#menu",
      "#gameover",
      "#heroDied",
      "#scoreScene",
      "#levelScene",
      ".score-text",
      "#start-game-button",
      "#exit-button",
      "#next-level-button",
      ".level-label"
    ),
    startGame = e => {
      e.target.dispatchEvent(
        new CustomEvent("start game request", {
          detail: e.target
        })
      );
      hideScreens(mainMenu, gameOverScene);
      showScreen(scoreScene);
    },
    showHeroDeadScreen = callback => {
      setTimeout(() => {
        showScreen(heroDiedScene);

        if (typeof callback === "function") {
          callback();
        }
        setTimeout(() => showGameEndScene(), 6000);
      }, 1000);
    },
    showGameEndScene = () => {
      updateDOMElement(startButton, {
        parent: gameOverScene,
        placement: exitButton,
        text: "Restart Game"
      });
      hideScreens(mainMenu, heroDiedScene, scoreScene);
      showScreen(gameOverScene);
    },
    showMainMenu = () => {
      updateDOMElement(startButton, {
        parent: mainMenu,
        placement: mainMenu.childNodes[mainMenu.lastChild],
        text: "Start Game"
      });
      showScreen(mainMenu);
      hideScreens(gameOverScene, heroDiedScene);
    },
    showLevelScreen = level => {
      showScreen(levelScene);
      updateAlText(levelLabel, level);
    },
    hideLevelScreen = () => {
      hideScreens(levelScene);
    },
    nextLevel = e => {
      e.target.dispatchEvent(
        new CustomEvent("start next level request", {
          detail: e.target
        })
      );
    },
    setGameScore = score => updateAlText(scoreText, score);

  startButton.onclick = e => startGame(e);

  exitButton.onclick = e => showMainMenu();

  nextLevelButton.onclick = e => nextLevel(e);

  console.log(scoreText);
  return {
    startButton,
    showHeroDeadScreen,
    showGameEndScene,
    showLevelScreen,
    setGameScore,
    nextLevelButton,
    hideLevelScreen
  };
};
