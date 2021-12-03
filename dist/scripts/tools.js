const TOOL_USAGE = {
  pickaxe: ["stone"],
  axe: ["wood", "leaves"],
  shovel: ["dirt", "grass"],
  inventory: ["empty"],
};
const ACTIVE_TOOL_CLASS = "active";

let activeTool = null;
let currentInventory = {
  htmlEl: document.querySelector(`[data-tool=inventory]`),
  contents: "empty",
};

export class Tool {
  constructor(toolType) {
    this.type = toolType;
    this.htmlEl = document.querySelector(`[data-tool=${toolType}]`);
  }

  get toolType() {
    return this.type;
  }

  get toolUsage() {
    return TOOL_USAGE[this.type];
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
  return currentInventory.contents;
}

export function setInventory(blockType) {
  currentInventory.contents = blockType;
  currentInventory.htmlEl.dataset.contents = blockType;
}
