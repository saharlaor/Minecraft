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
        block.type = getInventory();
        setInventory(BLOCK_TYPES.empty);
      } else {
        setInventory(block.type);
        block.type = BLOCK_TYPES.empty;
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
 * Setup the game.
 *
 * Start a new game, generate the world's elements and matrix,
 * setup the title screen.
 *
 * @since  1.0.0
 **/
function gameStart() {
  generateWorld(); // Function that fills matrix array with block Object
  document.querySelector("#start-btn").addEventListener("click", (e) => {
    const titleScreenEl = document.querySelector("#title-screen");
    titleScreenEl.classList.add("hidden");
    setTimeout(() => {
      titleScreenEl.style.display = "none";
    }, 800);
  });
}

gameStart();
