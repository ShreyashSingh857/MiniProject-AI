import React from 'react'

export default function Agent({ position, agentType }) {
  const agentEmoji = {
    reflex:  '🔴',
    model:   '🟡',
    goal:    '🟢',
    utility: '🔵'
  }

  const style = {
    top:  `${position.y * 40}px`,
    left: `${position.x * 40}px`,
  }

  return (
    <div className="agent" style={style}>
      {agentEmoji[agentType] || '🤖'}
    </div>
  )
}
