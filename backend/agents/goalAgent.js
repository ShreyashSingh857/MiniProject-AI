function goalAgent(grid, currentPos, goalPos, memory) {
  // Logic:
  // - On FIRST call (memory.path is empty or undefined):
  //   Run BFS from currentPos to goalPos on the grid
  //   Store the full path in memory.path as array of {x,y}
  //   Store memory.step = 0
  // - On subsequent calls:
  //   Increment memory.step
  //   Return memory.path[memory.step] as nextPos
  // - Ignores coins completely
  // - BFS must handle walls (grid value 1 = blocked)
  // - Returns nextPos, updatedMemory, 
  //   exploredCells: full BFS explored cells (only on first call),
  //   pathSoFar: memory.path slice up to current step

  let mem = memory || {};
  
  if (!mem.path || mem.path.length === 0) {
    // FIRST CALL: Run BFS
    const pathInfo = runBFS(grid, currentPos, goalPos);
    mem.path = pathInfo.path;
    mem.step = 0;
    
    // If no path found (unreachable)
    if (mem.path.length === 0) {
      return {
        nextPos: currentPos,
        updatedMemory: mem,
        exploredCells: pathInfo.explored,
        pathSoFar: []
      };
    }

    // Agent doesn't move on step 0, it just calculates path or takes first step...
    // Let's say mem.path contains [currentPos, nextStep, ...., goalPos]
    // so step 0 gives currentPos or step 1 gives next pos
    if (mem.path.length > 1) {
      mem.step = 1;
    }

    return {
      nextPos: mem.path[mem.step] || currentPos,
      updatedMemory: mem,
      exploredCells: pathInfo.explored,
      pathSoFar: mem.path.slice(0, mem.step + 1)
    };
  } else {
    // SUBSEQUENT CALLS
    if (mem.step < mem.path.length - 1) {
      mem.step++;
    }
    return {
      nextPos: mem.path[mem.step] || currentPos,
      updatedMemory: mem,
      exploredCells: [], // "exploredCells: full BFS explored cells (only on first call)"
      pathSoFar: mem.path.slice(0, mem.step + 1)
    };
  }
}

function runBFS(grid, start, goal) {
  const cols = grid[0].length;
  const rows = grid.length;
  
  const queue = [{ pos: start, path: [start] }];
  const visited = new Set();
  visited.add(`${start.x},${start.y}`);
  
  const explored = [start];

  const directions = [
    { x: 0, y: -1 }, 
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 }
  ];

  while (queue.length > 0) {
    const { pos, path } = queue.shift();
    
    if (pos.x === goal.x && pos.y === goal.y) {
      return { path, explored };
    }

    for (let d of directions) {
      const nx = pos.x + d.x;
      const ny = pos.y + d.y;

      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && grid[ny][nx] !== 1) {
        const key = `${nx},${ny}`;
        if (!visited.has(key)) {
          visited.add(key);
          const newPos = { x: nx, y: ny };
          explored.push(newPos);
          queue.push({ pos: newPos, path: [...path, newPos] });
        }
      }
    }
  }

  // Goal not reachable
  return { path: [], explored };
}

module.exports = goalAgent;
