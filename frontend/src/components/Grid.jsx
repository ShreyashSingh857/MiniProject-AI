import React, { useRef } from 'react'

export default function Grid({ grid, agentPos, goalPos, startPos, coins, exploredCells, pathSoFar, onCellClick }) {
  const rows = grid.length;
  const cols = grid[0].length;

  const isDragging = useRef(false);
  const paintValue = useRef(1);

  const handleMouseDown = (x, y, currentValue) => {
    isDragging.current = true;
    paintValue.current = currentValue === 1 ? 0 : 1;
    onCellClick({ x, y });
  };

  const handleMouseEnter = (x, y, currentValue) => {
    if (!isDragging.current) return;
    if (currentValue !== paintValue.current) {
      onCellClick({ x, y, forceTo: paintValue.current });
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, var(--cell-size))`,
        gridTemplateRows: `repeat(${rows}, var(--cell-size))`
      }}
      onMouseLeave={() => { isDragging.current = false; }}
      onMouseUp={handleMouseUp}
    >
      {grid.map((row, y) =>
        row.map((cellValue, x) => {
          let className = 'cell';
          if (cellValue === 1) className += ' wall';
          else if (cellValue === 2) className += ' coin';

          const isStart = startPos.x === x && startPos.y === y;
          const isGoal  = goalPos.x  === x && goalPos.y  === y;

          let coinContent = null;
          if (cellValue === 2) {
            const coinData = coins.find(c => c.x === x && c.y === y);
            if (coinData) coinContent = coinData.value;
          }

          return (
            <div
              key={`${x}-${y}`}
              className={className}
              onMouseDown={() => handleMouseDown(x, y, cellValue)}
              onMouseEnter={() => handleMouseEnter(x, y, cellValue)}
              onMouseUp={handleMouseUp}
              onDragStart={e => e.preventDefault()}
            >
              {coinContent}
              {isStart && <div className="start" />}
              {isGoal  && <div className="goal">🏁</div>}
            </div>
          );
        })
      )}
    </div>
  );
}
