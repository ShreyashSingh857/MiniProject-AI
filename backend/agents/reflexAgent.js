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

  const isWalkable = (x, y) => {
    return x >= 0 && x < cols && y >= 0 && y < rows && grid[y][x] !== 1;
  };

  const walkable = directions
    .map(d => ({ x: currentPos.x + d.x, y: currentPos.y + d.y, dx: d.x, dy: d.y }))
    .filter(pos => isWalkable(pos.x, pos.y));

  if (walkable.length === 0) {
    // Nowhere to go
    return { nextPos: currentPos, updatedMemory: memory, exploredCells: [currentPos], pathSoFar: [] };
  }

  let chosen = null;

  // Try to move forward in the last direction if possible
  if (memory && memory.lastDirection) {
    const fwdX = currentPos.x + memory.lastDirection.dx;
    const fwdY = currentPos.y + memory.lastDirection.dy;
    
    if (isWalkable(fwdX, fwdY)) {
      chosen = { x: fwdX, y: fwdY, dx: memory.lastDirection.dx, dy: memory.lastDirection.dy };
    }
  }

  // If hitting a wall or starting out, pick a new direction
  if (!chosen) {
    let options = walkable;
    
    // If we were moving, prefer not to bounce straight back unless it's a dead end
    if (memory && memory.lastDirection) {
      const revDx = -memory.lastDirection.dx;
      const revDy = -memory.lastDirection.dy;
      const withoutReverse = walkable.filter(p => !(p.dx === revDx && p.dy === revDy));
      if (withoutReverse.length > 0) {
        options = withoutReverse;
      }
    }
    
    const randomIndex = Math.floor(Math.random() * options.length);
    chosen = options[randomIndex];
  }

  const nextPos = { x: chosen.x, y: chosen.y };
  
  const updatedMemory = { ...memory, lastDirection: { dx: chosen.dx, dy: chosen.dy } };

  return {
    nextPos,
    updatedMemory,
    exploredCells: [currentPos],
    pathSoFar: [currentPos, nextPos]
  };
}

module.exports = reflexAgent;
