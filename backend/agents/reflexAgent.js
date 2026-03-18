function reflexAgent(grid, currentPos, goalPos, memory) {
  // Reflex agent:
  // - Has NO memory (ignore memory param, return empty {})
  // - Does NOT know where the goal is
  // - Checks if any of the 4 neighbors (up, down, left, right) 
  //   is walkable (not a wall, not out of bounds)
  // - If the cell directly ahead (last direction) is walkable, continue
  // - Otherwise pick a random walkable neighbor
  // - Returns nextPos, updatedMemory: {}, exploredCells: [currentPos]
  
  const directions = [
    { x: 0, y: -1 }, // up
    { x: 0, y: 1 },  // down
    { x: -1, y: 0 }, // left
    { x: 1, y: 0 }   // right
  ];

  const cols = grid[0].length;
  const rows = grid.length;

  const getWalkableNeighbors = (x, y) => {
    return directions
      .map(d => ({ x: x + d.x, y: y + d.y, dx: d.x, dy: d.y }))
      .filter(pos => pos.x >= 0 && pos.x < cols && pos.y >= 0 && pos.y < rows && grid[pos.y][pos.x] !== 1);
  };

  const walkable = getWalkableNeighbors(currentPos.x, currentPos.y);

  if (walkable.length === 0) {
    // Nowhere to go
    return { nextPos: currentPos, updatedMemory: {}, exploredCells: [currentPos], pathSoFar: [] };
  }

  // To know "directly ahead", we'd need memory. But rule says "Has NO memory". So wait...
  // How do we know the "last direction"? We can't if we don't have memory.
  // We can just pick a random walkable neighbor each time if the exact instruction is "Return empty memory".
  // Let's pick a random walkable neighbor.
  const randomIndex = Math.floor(Math.random() * walkable.length);
  const chosen = walkable[randomIndex];

  const nextPos = { x: chosen.x, y: chosen.y };

  return {
    nextPos,
    updatedMemory: {},
    exploredCells: [currentPos],
    pathSoFar: [currentPos, nextPos]
  };
}

module.exports = reflexAgent;
