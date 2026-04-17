import React from 'react'

export default function StatsPanel({
  steps, exploredCount, coinsCollected,
  agentType, goalReached
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

  const agentAlgorithm = {
    goal:    'Breadth-First Search (BFS)',
    utility: 'A* Search (A-Star)'
  }

  return (
    <div className="stats-panel">
      <h3>Stats</h3>

      <span className={`agent-badge ${badgeClass[agentType]}`}>
        {agentLabel[agentType]}
      </span>

      {agentAlgorithm[agentType] && (
        <div className="stat-row" style={{ marginTop: 12 }}>
          <span className="stat-label">Algorithm</span>
          <span className="stat-value" style={{ fontSize: '0.85rem' }}>{agentAlgorithm[agentType]}</span>
        </div>
      )}

      <div className="stat-row">
        <span className="stat-label">Steps Taken</span>
        <span className="stat-value">{steps}</span>
      </div>

      <div className="stat-row">
        <span className="stat-label">Cells Explored</span>
        <span className="stat-value">{exploredCount}</span>
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


      {goalReached && (
        <div className="goal-banner">🎉 Goal Reached!</div>
      )}
    </div>
  )
}
