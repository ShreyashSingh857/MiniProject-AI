function modelAgent(grid, currentPos, goalPos, memory) {
  // Logic:
  // - Memory stores visited cells: { visited: {"x,y": true} }
  // - On each step, mark currentPos as visited in memory
  // - From walkable neighbors, prefer cells NOT yet visited
  // - If all neighbors are visited, pick any walkable neighbor (backtrack)
  // - Does NOT plan ahead, does NOT know goal location explicitly
  // - Returns nextPos, updatedMemory with updated visited map,
  //   exploredCells: all visited cells so far

  const directions = [
    { x: 0, y: -1 }, 
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 }
  ];

  const cols = grid[0].length;
  const rows = grid.length;

  // Initialize memory
  let mem = memory || {};
  if (!mem.visited) {
    mem.visited = {};
  }

  // Mark current as visited
  const currentKey = `${currentPos.x},${currentPos.y}`;
  mem.visited[currentKey] = true;

  const getWalkableNeighbors = (x, y) => {
    return directions
      .map(d => ({ x: x + d.x, y: y + d.y }))
      .filter(pos => pos.x >= 0 && pos.x < cols && pos.y >= 0 && pos.y < rows && grid[pos.y][pos.x] !== 1);
  };

  const walkable = getWalkableNeighbors(currentPos.x, currentPos.y);

  if (walkable.length === 0) {
    return {
      nextPos: currentPos,
      updatedMemory: mem,
      exploredCells: Object.keys(mem.visited).map(k => { const [x,y] = k.split(','); return {x: +x, y: +y}; }),
      pathSoFar: []
    };
  }

  const unvisited = walkable.filter(pos => !mem.visited[`${pos.x},${pos.y}`]);
  
  let chosenPos;
  if (unvisited.length > 0) {
    // Pick random unvisited
    chosenPos = unvisited[Math.floor(Math.random() * unvisited.length)];
  } else {
    // All visited, pick random walkable (backtrack)
    chosenPos = walkable[Math.floor(Math.random() * walkable.length)];
  }

  const nextPos = { x: chosenPos.x, y: chosenPos.y };
  
  // Format explored for return
  const exploredCells = Object.keys(mem.visited).map(k => {
    const [x, y] = k.split(',');
    return { x: parseInt(x, 10), y: parseInt(y, 10) };
  });

  return {
    nextPos,
    updatedMemory: mem,
    exploredCells,
    pathSoFar: [currentPos, nextPos]
  };
}

module.exports = modelAgent;
