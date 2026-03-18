import React from 'react'

export default function StatsPanel({ 
  steps, exploredCount, coinsCollected, totalScore, memorySize, agentType, goalReached 
}) {
  return (
    <div className="panel stats-panel">
      <h2>Simulation Stats</h2>
      
      {goalReached && (
        <div className="goal-banner">
          Goal Reached! 🎉
        </div>
      )}

      <div className="stats-item">
        <span>Agent Type:</span>
        <span className={`agent-badge ${agentType}`}>
          {agentType}
        </span>
      </div>

      <div className="stats-item">
        <span>Steps Taken:</span>
        <span className="stats-value">{steps}</span>
      </div>

      <div className="stats-item">
        <span>Cells Explored:</span>
        <span className="stats-value">{exploredCount}</span>
      </div>

      <div className="stats-item">
        <span>Memory Entries (localStorage size):</span>
        <span className="stats-value">{agentType === 'reflex' ? 0 : memorySize} bytes</span>
      </div>

      <div className="stats-item">
        <span>Coins Collected:</span>
        <span className="stats-value">{coinsCollected.length}</span>
      </div>

      {coinsCollected.length > 0 && (
        <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '-5px' }}>
          Values: {coinsCollected.map(c => c.value).join(', ')}
        </div>
      )}

      <div className="stats-item" style={{ marginTop: '15px', borderTop: '2px solid #eee', paddingTop: '10px' }}>
        <span style={{ fontWeight: 'bold' }}>Total Score:</span>
        <span className="stats-value" style={{ 
          fontSize: '1.2rem', 
          color: totalScore < 0 ? '#e74c3c' : '#2ecc71' 
        }}>
          {totalScore}
        </span>
      </div>
      
      <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '5px', textAlign: 'center' }}>
        Score = Coins sum - (steps × 5)
      </div>
    </div>
  )
}
