import React from 'react'

export default function Agent({ position, agentType }) {
  // We need to position in absolutely relative to grid-wrapper
  // CSS: size is --cell-size (40px)
  
  const left = position.x * 40; // 40px hardcoded standard from App.css fallback if not var
  const top = position.y * 40;

  // different emoji per type
  let emoji = "🤖";
  if (agentType === 'reflex') emoji = "🔴";
  else if (agentType === 'model') emoji = "📙";
  else if (agentType === 'goal') emoji = "🟢";
  else if (agentType === 'utility') emoji = "🔵";

  return (
    <div 
      className={`agent ${agentType}`}
      style={{
        transform: `translate(${left}px, ${top}px)`,
        top: 0,
        left: 0
      }}
    >
      {emoji}
    </div>
  )
}
