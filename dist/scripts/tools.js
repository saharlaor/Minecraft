import { BLOCK_TYPES } from "./block.js";

const TOOL_USAGE = {
  pickaxe: ["stone"],
  axe: ["wood", "leaves"],
  shovel: ["dirt", "grass", "sand"],
  inventory: ["empty"],
};
const ACTIVE_TOOL_CLASS = "active";

let activeTool = null;
let currentInventory = {
  htmlEl: document.querySelector(`[data-tool=inventory]`),
  contents: ["empty"],
};

export class Tool {
  constructor(toolType) {
    this.type = toolType;
    this.htmlEl = document.querySelector(`[data-tool=${toolType}]`);
  }

  // Getters
  get toolType() {
    return this.type;
  }

  get toolUsage() {
    return TOOL_USAGE[this.type];
  }

  // Methods
  indicateError() {
    this.htmlEl.classList.add("error");
    setTimeout(() => {
      this.htmlEl.classList.remove("error");
    }, 200);
  }

  activate() {
    this.htmlEl.classList.toggle(ACTIVE_TOOL_CLASS);
  }
}

export function getActiveTool() {
  return activeTool;
}

export function setActiveTool(active) {
  document
    .querySelectorAll("[data-tool]")
    .forEach((el) => el.classList.remove(ACTIVE_TOOL_CLASS));
  if (activeTool === active) {
    activeTool = null;
  } else {
    activeTool = active;
    activeTool.activate();
  }
}

export function getInventory() {
  return currentInventory.contents[0];
}

export function setInventory(blockType) {
  if (blockType === BLOCK_TYPES.empty) {
    currentInventory.contents.shift();
    if (!currentInventory.contents.length)
      currentInventory.contents.unshift(BLOCK_TYPES.empty);
  } else {
    currentInventory.contents.unshift(blockType);
  }
  currentInventory.htmlEl.dataset.contents = currentInventory.contents[0];
}
