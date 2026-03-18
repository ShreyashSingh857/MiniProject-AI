import React from 'react'

export default function ControlPanel({
  agentType, onAgentChange,
  onPlay, onPause, onReset,
  onScatterCoins, onRandomizeWalls,
  speed, onSpeedChange,
  isRunning, onClearMemory
}) {
  const agents = [
    { id: 'reflex',  label: '🔴 Simple Reflex',  desc: 'No memory, random walk' },
    { id: 'model',   label: '🟡 Model-Based',     desc: 'Remembers full path history' },
    { id: 'goal',    label: '🟢 Goal-Based',      desc: 'BFS shortest path' },
    { id: 'utility', label: '🔵 Utility-Based',   desc: 'A* with coin rewards' },
  ]

  return (
    <div className="control-panel">
      <h3>Agent Type</h3>
      <div className="agent-buttons">
        {agents.map(a => (
          <button
            key={a.id}
            className={`agent-btn ${agentType === a.id ? 'active' : ''}`}
            onClick={() => onAgentChange(a.id)}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div>
        <h3>Controls</h3>
        <div className="action-buttons">
          {!isRunning
            ? <button className="btn btn-play"  onClick={onPlay}>▶ Play</button>
            : <button className="btn btn-pause" onClick={onPause}>⏸ Pause</button>
          }
          <button className="btn btn-reset" onClick={onReset}>↺ Reset</button>
        </div>
      </div>

      <div className="speed-section">
        <h3>Speed</h3>
        <label>
          <span>Slow</span><span>Fast</span>
        </label>
        <input
          type="range"
          min={1}
          max={10}
          value={speed}
          onChange={e => onSpeedChange(Number(e.target.value))}
        />
      </div>

      <div>
        <h3>Environment</h3>
        <button className="btn btn-secondary" onClick={onScatterCoins} style={{marginBottom: 6}}>
          ⭐ Scatter Coins
        </button>
        <button className="btn btn-secondary" onClick={onRandomizeWalls} style={{marginBottom: 6}}>
          🧱 Random Walls
        </button>
        <button className="btn btn-secondary" onClick={onClearMemory}>
          🧠 Clear Memory
        </button>
      </div>
    </div>
  )
}
