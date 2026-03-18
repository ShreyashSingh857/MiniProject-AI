import React from 'react'

export default function PathOverlay({ exploredCells, pathSoFar, gridSize }) {
  // SVG overlay for Grid
  // Grid size = variable (15), Cell size = 40px
  const svgWidth = gridSize * 40;
  const svgHeight = gridSize * 40;

  return (
    <svg 
      className="path-overlay" 
      width={svgWidth} 
      height={svgHeight} 
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
    >
      {/* 1. Explored Cells - Semi-transparent light blue squares */}
      {exploredCells && exploredCells.map((cell, idx) => (
        <rect 
          key={`exp-${idx}`}
          x={cell.x * 40}
          y={cell.y * 40}
          width={40}
          height={40}
          fill="rgba(52, 152, 219, 0.3)"
        />
      ))}

      {/* 2. Path So Far - Orange line */}
      {pathSoFar && pathSoFar.length > 1 && (
        <polyline 
          points={pathSoFar.map(p => `${(p.x * 40) + 20},${(p.y * 40) + 20}`).join(' ')}
          fill="none"
          stroke="rgba(230, 126, 34, 0.8)"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}
