/**
 * Orchestrate Minecraft game creation and manipulation.
 *
 * Create a new Mincraft game from an abstract representation of the initial
 * game world. Save all the blocks in the game as Block objects inside an object
 * matrix (2D array). Set all block click event listeners and validate the click.
 *
 * @link   https://github.com/saharlaor/Minecraft
 * @file   This file is the main script for the mincraft game.
 * @author SaharLaOr.
 * @since  1.0.0
 **/

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
const BLOCK_TYPE_ENUM = {
  0: "empty",
  1: "dirt",
  2: "grass",
  3: "leaves",
  4: "stone",
  5: "wood",
};
const TOOL_TYPE_ENUM = {
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
  document.querySelector("#start-btn").addEventListener("click", (e) => {
    document.querySelector("#title-screen").classList.add("hidden");
  });
}

function generateWorld() {
  for (let y = 0; y < gameMatrix.length; y++) {
    for (let x = 0; x < gameMatrix[y].length; x++) {
      const blockType = BLOCK_TYPE_ENUM[basicWorld[y][x]];
      const tempEl = document.createElement("div");
      tempEl.classList.add("block");
      tempEl.setAttribute("data-contents", BLOCK_TYPE_ENUM[basicWorld[y][x]]);
      gameMatrix[y][x] = new Block(blockType, x, y, tempEl);
      tempEl.addEventListener("click", (e) => {
        const activeTool = getActiveTool();
        if (activeTool) {
          if (activeTool.toolUsage.includes(gameMatrix[y][x].type)) {
            if (activeTool.toolType === TOOL_TYPE_ENUM.inventory) {
              gameMatrix[y][x].type = getInventory();
              setInventory(BLOCK_TYPES.empty);
            } else {
              setInventory(gameMatrix[y][x].type);
              gameMatrix[y][x].type = BLOCK_TYPES.empty;
            }
          } else {
            activeTool.indicateError();
          }
        }
      });
      worldEl.append(tempEl);
    }
  }
}

gameStart();
console.log(gameMatrix);
