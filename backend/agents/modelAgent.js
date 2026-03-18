function modelAgent(grid, currentPos, goalPos, memory) {
  const directions = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 }
  ];

  const cols = grid[0].length;
  const rows = grid.length;

  // Initialize memory structure
  let mem = memory || {};
  if (!mem.visited) mem.visited = {};
  if (!mem.path) mem.path = [];

  // Mark current position as visited
  const currentKey = `${currentPos.x},${currentPos.y}`;
  mem.visited[currentKey] = true;

  // Append current position to the running path history
  // Only append if it's a new position (avoid duplicates on first call)
  const lastInPath = mem.path[mem.path.length - 1];
  if (!lastInPath || lastInPath.x !== currentPos.x || lastInPath.y !== currentPos.y) {
    mem.path.push({ x: currentPos.x, y: currentPos.y });
  }

  const getWalkableNeighbors = (x, y) => {
    return directions
      .map(d => ({ x: x + d.x, y: y + d.y }))
      .filter(pos =>
        pos.x >= 0 && pos.x < cols &&
        pos.y >= 0 && pos.y < rows &&
        grid[pos.y][pos.x] !== 1
      );
  };

  const manhattan = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

  const walkable = getWalkableNeighbors(currentPos.x, currentPos.y);

  if (walkable.length === 0) {
    return {
      nextPos: currentPos,
      updatedMemory: mem,
      exploredCells: Object.keys(mem.visited).map(k => {
        const [x, y] = k.split(',');
        return { x: +x, y: +y };
      }),
      pathSoFar: mem.path
    };
  }

  const unvisited = walkable.filter(pos => !mem.visited[`${pos.x},${pos.y}`]);

  let chosenPos;
  if (unvisited.length > 0) {
    // Prefer unvisited cells — explore the world greedily
    // Among unvisited, pick the one closest to the goal
    // This is the "model" in action: using known goal location to guide exploration
    unvisited.sort((a, b) => manhattan(a, goalPos) - manhattan(b, goalPos));
    chosenPos = unvisited[0];
  } else {
    // All neighbors visited — use model knowledge to backtrack toward goal
    // This is smarter than random: the agent uses its internal world model
    walkable.sort((a, b) => manhattan(a, goalPos) - manhattan(b, goalPos));
    chosenPos = walkable[0];
  }

  const nextPos = { x: chosenPos.x, y: chosenPos.y };

  const exploredCells = Object.keys(mem.visited).map(k => {
    const [x, y] = k.split(',');
    return { x: parseInt(x, 10), y: parseInt(y, 10) };
  });

  return {
    nextPos,
    updatedMemory: mem,
    exploredCells,
    pathSoFar: mem.path   // Return FULL path history, not just last 2 nodes
  };
}

module.exports = modelAgent;
