import React from 'react'

const CELL = 40;

export default function PathOverlay({ exploredCells, pathSoFar, gridSize }) {
  const totalSize = gridSize * CELL;

  return (
    <svg
      className="path-overlay"
      width={totalSize}
      height={totalSize}
      viewBox={`0 0 ${totalSize} ${totalSize}`}
    >
      {/* Explored cells — light blue fill */}
      {exploredCells.map((cell, i) => (
        <rect
          key={`exp-${i}`}
          x={cell.x * CELL}
          y={cell.y * CELL}
          width={CELL}
          height={CELL}
          fill="rgba(116, 185, 255, 0.2)"
          stroke="none"
        />
      ))}

      {/* Full path trail — orange polyline connecting every step taken */}
      {pathSoFar.length > 1 && (
        <polyline
          points={pathSoFar
            .map(p => `${p.x * CELL + CELL / 2},${p.y * CELL + CELL / 2}`)
            .join(' ')}
          fill="none"
          stroke="rgba(253, 203, 110, 0.8)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}
