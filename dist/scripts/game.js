import { Block, BLOCK_TYPES } from "./block.js";
import {
  Tool,
  setActiveTool,
  getActiveTool,
  getInventory,
  setInventory,
} from "./tools.js";

const basicWorld = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1],
  [4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 1, 1, 1],
];
const blockTypeEnum = {
  0: "empty",
  1: "dirt",
  2: "grass",
  3: "leaves",
  4: "stone",
  5: "wood",
};
const toolTypeEnum = {
  pickaxe: "pickaxe",
  axe: "axe",
  shovel: "shovel",
  inventory: "inventory",
};
const gameMatrix = Array.from(Array(20), () => Array(20));
const worldEl = document.querySelector(".game");
const tools = [...document.querySelectorAll("[data-tool]")].reduce(
  (res, el) => {
    const toolName = el.dataset.tool;
    res[toolName] = new Tool(toolName);
    return res;
  },
  {}
);

Object.values(tools).forEach((tool) =>
  tool.htmlEl.addEventListener("click", (_) => setActiveTool(tool))
);

function gameStart() {
  generateWorld(); // Function that fills matrix array with block Object
}

function generateWorld() {
  for (let y = 0; y < gameMatrix.length; y++) {
    for (let x = 0; x < gameMatrix[y].length; x++) {
      const blockType = blockTypeEnum[basicWorld[y][x]];
      const tempEl = document.createElement("div");
      tempEl.classList.add("block");
      tempEl.setAttribute("data-contents", blockTypeEnum[basicWorld[y][x]]);
      gameMatrix[y][x] = new Block(blockType, x, y, tempEl);
      tempEl.addEventListener("click", (e) => {
        const activeTool = getActiveTool();
        if (activeTool) {
          if (activeTool.toolUsage.includes(blockType)) {
            if (activeTool.toolType === toolTypeEnum.inventory) {
              tempEl.type = getInventory();
              setInventory(BLOCK_TYPES.empty);
            } else {
              gameMatrix[y][x].type = BLOCK_TYPES.empty;
              setInventory(blockType);
            }
          } else {
          }
        }
      });
      worldEl.append(tempEl);
    }
  }
}

gameStart();
console.log(gameMatrix);
