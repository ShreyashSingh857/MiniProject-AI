import React from 'react'

export default function ControlPanel({ 
  agentType, onAgentChange, onPlay, onPause, onReset, 
  onScatterCoins, onRandomizeWalls, speed, onSpeedChange, 
  isRunning, onClearMemory
}) {
  return (
    <div className="panel control-panel">
      <h2>Controls</h2>
      
      <div className="control-group">
        <label>Agent Type:</label>
        <button 
          className={agentType === 'reflex' ? 'active' : ''} 
          onClick={() => onAgentChange('reflex')}
        >Reflex</button>
        <button 
          className={agentType === 'model' ? 'active' : ''} 
          onClick={() => onAgentChange('model')}
        >Model-Based</button>
        <button 
          className={agentType === 'goal' ? 'active' : ''} 
          onClick={() => onAgentChange('goal')}
        >Goal-Based</button>
        <button 
          className={agentType === 'utility' ? 'active' : ''} 
          onClick={() => onAgentChange('utility')}
        >Utility-Based</button>
      </div>

      <div className="control-group" style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px' }}>
        <button className="primary" onClick={onPlay} disabled={isRunning}>Play</button>
        <button onClick={onPause} disabled={!isRunning}>Pause</button>
        <button onClick={onReset}>Reset</button>
      </div>

      <div className="control-group" style={{ marginTop: '10px' }}>
        <button onClick={onScatterCoins}>Scatter Coins</button>
        <button onClick={onRandomizeWalls}>Random Walls</button>
      </div>

      <div className="speed-control" style={{ marginTop: '10px' }}>
        <label>Speed: {speed}</label>
        <input 
          type="range" 
          min="1" 
          max="10" 
          value={speed} 
          onChange={e => onSpeedChange(Number(e.target.value))} 
        />
      </div>

      <div className="control-group" style={{ marginTop: 'auto', paddingTop: '10px' }}>
        <button className="danger" onClick={onClearMemory}>Clear Memory</button>
      </div>
    </div>
  )
}
