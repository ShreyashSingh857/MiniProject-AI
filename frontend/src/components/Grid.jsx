import React from 'react'

export default function Grid({ grid, agentPos, goalPos, startPos, coins, exploredCells, pathSoFar, onCellClick }) {
  const rows = grid.length;
  const cols = grid[0].length;

  return (
    <div 
      className="grid" 
      style={{
        gridTemplateColumns: `repeat(${cols}, var(--cell-size))`,
        gridTemplateRows: `repeat(${rows}, var(--cell-size))`
      }}
    >
      {grid.map((row, y) => (
        row.map((cellValue, x) => {
          let className = "cell";
          if (cellValue === 1) className += " wall";
          else if (cellValue === 2) className += " coin";
          
          let content = null;
          if (cellValue === 2) {
            const coinData = coins.find(c => c.x === x && c.y === y);
            if (coinData) {
              content = coinData.value;
            }
          }

          return (
            <div 
              key={`${x}-${y}`} 
              className={className}
              onClick={() => onCellClick({x, y})}
            >
              {content}
              
              {startPos.x === x && startPos.y === y && <div className="start"></div>}
              {goalPos.x === x && goalPos.y === y && <div className="goal">🏁</div>}
            </div>
          )
        })
      ))}
    </div>
  )
}
