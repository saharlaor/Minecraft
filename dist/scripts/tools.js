const TOOL_USAGE = {
  pickaxe: ["stone"],
  axe: ["log", "leaves"],
  shovel: ["dirt", "grass"],
  inventory: ["empty"],
};

let activeTool = null;
const ACTIVE_TOOL_CLASS = "active";
// const toolEls = Array.from(document.querySelectorAll("[data-tool]").map(el => e.dataset.tool), type => {
//     type: type,
//     htmlEl: ,
// };

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
