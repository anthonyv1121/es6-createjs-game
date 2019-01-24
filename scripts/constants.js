export const sounds = {
  jump: "soundfx/jump7.aiff",
  gameOver: "soundfx/game-over.aiff",
  coinGrab: "soundfx/coin-grab.wav",
  enemyHit: "soundfx/enemy-hit.mp3",
  heroFall: "soundfx/hero-fall.mp3",
  gameEnd: "soundfx/game-end.mp3",
  levelComplete: "soundfx/level-complete.mp3"
};

export const xy = obj => ({ x: obj.x, y: obj.y });

export const getBounds = obj => ({
  width: obj.getBounds().width,
  height: obj.getBounds().height
});

export const getObjSpec = obj => ({
  ...xy(obj),
  ...getBounds(obj)
});

export const DOM = (...elements) => {
  return elements.map(el => {
    if (el.charAt(0) === "#") {
      return document.querySelector(el);
    } else {
      return document.querySelectorAll(el);
    }
  });
};

export const showScreen = screen => screen.classList.add("active");

export const hideScreens = (...screens) => {
  screens.forEach(screen => {
    screen.classList.remove("active");
  });
};
export const moveDOMElemenet = (element, node) => {
  let { container, placement } = node;
  container.insertBefore(element, placement);
};
export const updateDOMElement = (element, newNode) => {
  let { parent, placement, text } = newNode;
  moveDOMElemenet(element, { container: parent, placement });
  element.innerText = text;
};

export const updateAlText = (element, text) => {
  [...element].forEach(el => {
    el.textContent = text;
  });
};

const worldState = {
  worldLevelComplete: false,
  coins: [],
  enemies: [],
  platforms: [],
  heroHit: false,
  heroFallen: false
};
const gameState = {
  level: 0
};

const worldReducer = (state = worldState, action) => {
  switch (action.type) {
    case "COIN_ADDED":
      return {
        ...state,
        coins: [...state.coins, action.payload]
      };
      break;

    case "COIN_GRABBED":
      return {
        ...state,
        coins: state.coins.filter(coin => coin.id !== action.payload.id)
      };
      break;

    case "WORLD_LEVEL_COMPLETE":
      const worldLevelComplete = action.payload;
      return {
        ...state,
        worldLevelComplete
      };
      break;

    case "HERO_HAS_BEEN_HIT":
      const heroHit = action.payload;
      return {
        ...state,
        heroHit
      };
      break;

    case "HERO_HAS_FALLEN":
      const heroFallen = action.payload;
      return {
        ...state,
        heroFallen
      };
      break;

    case "ENEMY_ADDED":
      return {
        ...state,
        enemies: [...state.enemies, action.payload]
      };
      break;

    case "PLATFORM_ADDED":
      return {
        ...state,
        platforms: [...state.platforms, action.payload]
      };
      break;

    case "NEXT_LEVEL_REQUESTED":
      return {
        ...worldState
      };
      break;

    default:
      return state;
  }
  return state;
};
const gameReducer = (state = gameState, action) => {
  switch (action.type) {
    case "NEXT_LEVEL_REQUESTED":
      console.log(state);
      const level = state.level + 1;
      return {
        ...state,
        level
      };
      break;

    default:
      return state;
  }
  return state;
};
export const reducers = {
  world: worldReducer,
  game: gameReducer
};
