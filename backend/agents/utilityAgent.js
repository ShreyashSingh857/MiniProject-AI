function utilityAgent(grid, currentPos, goalPos, coins, memory) {
  // Logic:
  // - Uses a modified A* algorithm
  // - Each cell has a utility score calculated as:
  //     utility = coinValue (if coin present) - (distanceToGoal × 2)
  // - The agent tries to MAXIMIZE total utility:
  //     totalScore = sum of coins collected - (totalSteps × stepCost)
  //   where stepCost = 5 per step
  // - On FIRST call (memory.path is empty):
  //   Run utility-weighted A* that considers detours for coins
  //   if: coinValue > (extraSteps × stepCost) → take detour
  //   Store full path in memory.path, memory.step = 0
  //   Store memory.collectedCoins = []
  // - On subsequent calls:
  //   Increment memory.step
  //   Check if nextPos has a coin → add to memory.collectedCoins
  //   Return nextPos
  // - Returns nextPos, updatedMemory,
  //   exploredCells: (only first call),
  //   pathSoFar: memory.path slice up to current step

  let mem = memory || {};

  if (!mem.path || mem.path.length === 0) {
    const pathInfo = runUtilityAStar(grid, currentPos, goalPos, coins || []);
    mem.path = pathInfo.path;
    mem.step = 0;
    mem.collectedCoins = [];

    if (mem.path.length === 0) {
      return {
        nextPos: currentPos,
        updatedMemory: mem,
        exploredCells: pathInfo.explored,
        pathSoFar: []
      };
    }

    if (mem.path.length > 1) {
      mem.step = 1;
    }

    const nextPos = mem.path[mem.step] || currentPos;
    
    // Check if nextPos has a coin
    checkForCoin(nextPos, coins, mem);

    return {
      nextPos,
      updatedMemory: mem,
      exploredCells: pathInfo.explored,
      pathSoFar: mem.path.slice(0, mem.step + 1)
    };
  } else {
    if (mem.step < mem.path.length - 1) {
      mem.step++;
    }

    const nextPos = mem.path[mem.step] || currentPos;
    checkForCoin(nextPos, coins, mem);

    return {
      nextPos,
      updatedMemory: mem,
      exploredCells: [],
      pathSoFar: mem.path.slice(0, mem.step + 1)
    };
  }
}

function checkForCoin(pos, coins, mem) {
  if (!coins) return;
  const coinIndex = coins.findIndex(c => c.x === pos.x && c.y === pos.y);
  if (coinIndex !== -1) {
    const coin = coins[coinIndex];
    // Avoid double counting
    if (!mem.collectedCoins.some(c => c.x === coin.x && c.y === coin.y)) {
      mem.collectedCoins.push(coin);
    }
  }
}

function runUtilityAStar(grid, start, goal, coins) {
  // A simple heuristic for A* prioritizing minimizing steps but factoring in rewards if close.
  // Instead of a perfect globally maximizing search (which leads to TSP),
  // we do an Dijkstra/A* to goal where edge weights are modified by coin presence.
  
  const cols = grid[0].length;
  const rows = grid.length;
  const stepCost = 5;
  
  // Create a fast coin lookup
  const coinMap = {};
  coins.forEach(c => {
    coinMap[`${c.x},${c.y}`] = c.value;
  });

  // Priority queue element: { pos, gCost, path, collectedSet }
  // We'll minimize gCost. Normally gCost += stepCost. If there's a coin, we subtract it.
  let openSet = [{ pos: start, gCost: 0, path: [start], collected: new Set() }];
  let bestCost = new Map(); // posKey -> cost
  
  const explored = [];

  const manhattan = (p1, p2) => Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);

  while (openSet.length > 0) {
    // Sort by fCost = gCost + hCost
    openSet.sort((a, b) => {
      const fA = a.gCost + manhattan(a.pos, goal) * stepCost;
      const fB = b.gCost + manhattan(b.pos, goal) * stepCost;
      return fA - fB;
    });

    const current = openSet.shift();
    const currKey = `${current.pos.x},${current.pos.y}`;
    
    explored.push(current.pos);

    if (current.pos.x === goal.x && current.pos.y === goal.y) {
      return { path: current.path, explored };
    }

    const directions = [
      { x: 0, y: -1 }, 
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 }
    ];

    for (let d of directions) {
      const nx = current.pos.x + d.x;
      const ny = current.pos.y + d.y;

      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && grid[ny][nx] !== 1) {
        const nKey = `${nx},${ny}`;
        const newCollected = new Set(current.collected);
        
        let costIncrease = stepCost;
        if (coinMap[nKey] && !newCollected.has(nKey)) {
          costIncrease -= coinMap[nKey]; // Detour is cheaper or negative cost
          newCollected.add(nKey);
        }

        const newGCost = current.gCost + costIncrease;

        // If we found a cheaper way to this cell
        if (!bestCost.has(nKey) || newGCost < bestCost.get(nKey)) {
          bestCost.set(nKey, newGCost);
          const newPos = { x: nx, y: ny };
          openSet.push({
            pos: newPos,
            gCost: newGCost,
            path: [...current.path, newPos],
            collected: newCollected
          });
        }
      }
    }
  }

  return { path: [], explored };
}

module.exports = utilityAgent;
