const BLOCK_TYPES = {
    dirt: "dirt",
    empty: "empty",
    grass: "grass",
    leaves: "leaves",
    stone: "stone",
    wood: "wood",
};

export const Block = class {
    constructor(blockType, x, y, htmlEl) {
        this.blockType = BLOCK_TYPES[blockType];
        this.x = x;
        this.y = y;
        this.htmlEl = htmlEl;
    }

    // Getters
    get type() {
        return this.blockType;
    }
    get coordinates() {
        return [y, x];
    }

    // Setters
    set type(newType) {
        this.blockType = newType;
        this.htmlEl.classList.forEach((className) => {
            if (className != "block") {
                this.htmlEl.classList.remove(className);
            }
        });
        this.htmlEl.classList.remove(newType);
    }
};
