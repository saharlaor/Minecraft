const TOOL_USAGE = {
    pickaxe: ["stone"],
    axe: ["log", "leaves"],
    shovel: ["dirt", "grass"],
};

let activeTool = null;

export class Tool {
    constructor(toolType) {
        this.type = toolType;
    }

    get toolType() {
        return this.type;
    }

    get toolUsage() {
        return TOOL_USAGE[this.type];
    }
}

export function getActiveTool() {
    return activeTool;
}

export function setActiveTool(active) {
    activeTool = active;
}
