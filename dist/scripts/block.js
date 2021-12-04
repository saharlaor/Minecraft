export const BLOCK_TYPES = {
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
    return [this.y, this.x];
  }

  // Setters
  set type(newType) {
    this.blockType = newType;
    this.htmlEl.dataset.contents = newType;
  }

  // Methods
  checkPhysics(matrix) {
    const [y, x] = this.coordinates;
    const adjacentBlocks = matrix
      .slice(y - 1, y + 2)
      .reduce((arr, row) => [...arr, ...row.slice(x - 1, x + 2)], [])
      .filter(
        (block) =>
          (y === block.coordinates[0] &&
            Math.abs(x - block.coordinates[1]) === 1) ||
          (x === block.coordinates[1] &&
            Math.abs(y - block.coordinates[0]) === 1)
      );
    console.log(adjacentBlocks);
    return adjacentBlocks.some((block) => block.type !== BLOCK_TYPES.empty);
  }
};
