import React from 'react'

export default function StatsPanel({
  steps, exploredCount, coinsCollected,
  totalScore, memorySize, agentType, goalReached
}) {
  const badgeClass = {
    reflex:  'badge-reflex',
    model:   'badge-model',
    goal:    'badge-goal',
    utility: 'badge-utility'
  }

  const agentLabel = {
    reflex:  'Simple Reflex',
    model:   'Model-Based',
    goal:    'Goal-Based',
    utility: 'Utility-Based'
  }

  return (
    <div className="stats-panel">
      <h3>Stats</h3>

      <span className={`agent-badge ${badgeClass[agentType]}`}>
        {agentLabel[agentType]}
      </span>

      <div className="stat-row">
        <span className="stat-label">Steps Taken</span>
        <span className="stat-value">{steps}</span>
      </div>

      <div className="stat-row">
        <span className="stat-label">Cells Explored</span>
        <span className="stat-value">{exploredCount}</span>
      </div>

      <div className="stat-row">
        <span className="stat-label">Memory (bytes)</span>
        <span className="stat-value">{memorySize > 2 ? memorySize : 0}</span>
      </div>

      <div>
        <div className="stat-label" style={{ marginBottom: 4 }}>Coins Collected</div>
        {coinsCollected.length === 0
          ? <span style={{ fontSize: '0.78rem', opacity: 0.5 }}>None yet</span>
          : <div className="coins-list">
              {coinsCollected.map((c, i) => (
                <span key={i} className="coin-tag">+{c.value}</span>
              ))}
            </div>
        }
      </div>

      <div className="stat-row">
        <span className="stat-label">Total Score</span>
        <span
          className="stat-value"
          style={{ color: totalScore >= 0 ? '#00b894' : '#e17055' }}
        >
          {totalScore}
        </span>
      </div>

      {goalReached && (
        <div className="goal-banner">🎉 Goal Reached!</div>
      )}
    </div>
  )
}
