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
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4],
  [5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4],
  [5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 4, 4],
  [5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 1, 1, 1],
];
const BLOCK_TYPE_ENUM = {
  0: "empty",
  1: "dirt",
  2: "grass",
  3: "leaves",
  4: "sand",
  5: "stone",
  6: "wood",
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
const resetBtn = document.querySelector(".reset");

// Event listeners for tool clicks
Object.values(tools).forEach((tool) =>
  tool.htmlEl.addEventListener("click", (_) => setActiveTool(tool))
);

/**
 * Add a block with given coordinates to the world matrix.
 *
 * Create new div, find the type of block from given x and y coordinates
 * Create new block object and fill it with those.
 *
 * @since  1.0.0
 *
 * @param {Number}   x           x coordinate.
 * @param {Number}   y           y coordinate.
 **/
function appendNewBlock(x, y) {
  const blockType = BLOCK_TYPE_ENUM[basicWorld[y][x]];
  const tempEl = document.createElement("div");
  tempEl.classList.add("block");
  tempEl.setAttribute("data-contents", BLOCK_TYPE_ENUM[basicWorld[y][x]]);
  gameMatrix[y][x] = new Block(blockType, x, y, tempEl);
}

/**
 * Drop sand blocks in the column above a block.
 *
 * Check the column above a block and drop the sand blocks directly above it.
 *
 * @since  1.0.0
 *
 * @param {Block}   block           the extracted block.
 **/
function checkFallingBlocks(block) {
  const aboveBlock = gameMatrix[block.y - 1][block.x];
  if (aboveBlock.type === BLOCK_TYPES.sand) {
    aboveBlock.dropBlock(gameMatrix);
    setTimeout(() => {
      checkFallingBlocks(aboveBlock);
    }, 1000);
  }
}

/**
 * function for event listener of a single block object.
 *
 * Change the type of the clicked block if the click was valid,
 * according to the current active tool and type of the object.
 *
 * @since  1.0.0
 *
 * @param {Block}   block           The clicked block.
 **/
function blockClick(block) {
  const activeTool = getActiveTool();
  if (activeTool) {
    if (activeTool.toolUsage.includes(block.type)) {
      if (activeTool.toolType === TOOL_TYPE_ENUM.inventory) {
        if (block.checkPhysics(gameMatrix)) {
          block.type = getInventory();
          if (block.type === BLOCK_TYPES.sand) {
            block.dropBlock(gameMatrix);
          }
          setInventory(BLOCK_TYPES.empty);
        }
      } else {
        setInventory(block.type);
        block.type = BLOCK_TYPES.empty;
        checkFallingBlocks(block);
      }
    } else {
      activeTool.indicateError();
    }
  }
}

/**
 * Generate a new world of blocks from an abstract representation.
 *
 * Iterate through the game matrix's indices and fill them with a new block
 * then append the html element of the block into game html.
 *
 * @since  1.0.0
 **/
function generateWorld() {
  worldEl.innerHTML = "";
  for (let y = 0; y < gameMatrix.length; y++) {
    for (let x = 0; x < gameMatrix[y].length; x++) {
      appendNewBlock(x, y);
      gameMatrix[y][x].htmlEl.addEventListener("click", (_) => {
        blockClick(gameMatrix[y][x]);
      });
      worldEl.append(gameMatrix[y][x].htmlEl);
    }
  }
}

/**
 * Hide the title screen when clicking the start button.
 *
 * Add the "hidden" class to the title screen element and set its display to none.
 *
 * @since  1.0.0
 *
 * @param {Event}   e           The click event.
 **/
function startBtnClick(e) {
  const titleScreenEl = document.querySelector("#title-screen");
  titleScreenEl.classList.add("hidden");
  setTimeout(() => {
    titleScreenEl.style.display = "none";
  }, 800);
  e.target.removeEventListener("click", startBtnClick);
}

/**
 * Setup the game.
 *
 * Start a new game, generate the world's elements and matrix,
 * setup the title screen.
 *
 * @since  1.0.0
 **/
function gameStart() {
  generateWorld(); // Function that fills matrix array with block Object
  document.querySelector("#start-btn").addEventListener("click", startBtnClick);
  document.querySelector("#title-screen").classList.remove("hidden");
  document.querySelector("#title-screen").style.display = "";
  setInventory(BLOCK_TYPES.empty);
}

// Event listener for reset
resetBtn.addEventListener("click", (e) => gameStart());

gameStart();
