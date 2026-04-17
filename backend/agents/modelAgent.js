function modelAgent(grid, currentPos, goalPos, memory) {
  const directions = [
    { x: 0, y: -1 }, // up
    { x: 0, y: 1 },  // down
    { x: -1, y: 0 }, // left
    { x: 1, y: 0 }   // right
  ];

  const cols = grid[0].length;
  const rows = grid.length;

  // Initialize memory structure
  let mem = memory || {};
  if (!mem.visited) mem.visited = {};
  if (!mem.pathStack) mem.pathStack = [];
  if (!mem.exploredList) mem.exploredList = [];

  const isWalkable = (x, y) => {
    return x >= 0 && x < cols && y >= 0 && y < rows && grid[y][x] !== 1;
  };

  // Mark current position as visited
  const currentKey = `${currentPos.x},${currentPos.y}`;
  mem.visited[currentKey] = true;
  
  // Add to explored list for the UI
  const lastExplored = mem.exploredList[mem.exploredList.length - 1];
  if (!lastExplored || lastExplored.x !== currentPos.x || lastExplored.y !== currentPos.y) {
    mem.exploredList.push({ x: currentPos.x, y: currentPos.y });
  }

  // Manage stack: if current position isn't at the top (e.g. newly visited), push it
  const top = mem.pathStack.length > 0 ? mem.pathStack[mem.pathStack.length - 1] : null;
  if (!top || top.x !== currentPos.x || top.y !== currentPos.y) {
    mem.pathStack.push({ x: currentPos.x, y: currentPos.y });
  }

  // Get all walkable neighbors
  const walkable = directions
    .map(d => ({ x: currentPos.x + d.x, y: currentPos.y + d.y, dx: d.x, dy: d.y }))
    .filter(pos => isWalkable(pos.x, pos.y));

  // Find unvisited walkable neighbors
  const unvisited = walkable.filter(pos => !mem.visited[`${pos.x},${pos.y}`]);

  let chosen = null;

  if (unvisited.length > 0) {
    // 1. "Behave like reflex agent" - try to keep last direction if possible
    if (mem.lastDirection) {
      const fwd = unvisited.find(p => p.dx === mem.lastDirection.dx && p.dy === mem.lastDirection.dy);
      if (fwd) {
        chosen = fwd;
      }
    }
    
    // 2. If blocked or starting out but unvisited paths exist, pick a new valid direction
    if (!chosen) {
      const randomIndex = Math.floor(Math.random() * unvisited.length);
      chosen = unvisited[randomIndex];
    }
    
    // Update direction based on chosen move
    mem.lastDirection = { dx: chosen.dx, dy: chosen.dy };
  } else {
    // 3. STUCK - Backtrack!
    // No unvisited neighbors. Pop the current cell and go back to the previous one.
    if (mem.pathStack.length > 1) {
      mem.pathStack.pop(); // Remove current cell
      const prev = mem.pathStack[mem.pathStack.length - 1]; // Peek at previous cell
      chosen = { x: prev.x, y: prev.y };
      mem.lastDirection = null; // Clear so it will choose a new direction at the crossroad
    } else {
      // Stack is empty or 1 node, nowhere to go. Stay here.
      chosen = currentPos;
    }
  }

  const exploredCells = Object.keys(mem.visited).map(k => {
    const [x, y] = k.split(',');
    return { x: parseInt(x, 10), y: parseInt(y, 10) };
  });

  return {
    nextPos: { x: chosen.x, y: chosen.y },
    updatedMemory: mem,
    exploredCells: exploredCells,
    pathSoFar: mem.pathStack // The pathStack visually represents the current actual path remaining
  };
}

module.exports = modelAgent;
