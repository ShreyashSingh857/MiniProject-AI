import { useState, useEffect } from 'react';

export function useAgentMemory(agentType) {
  const [memory, setMemoryState] = useState({});

  // Load from localStorage on type change
  useEffect(() => {
    const key = `memory_${agentType}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setMemoryState(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse memory", e);
        setMemoryState({});
      }
    } else {
      setMemoryState({});
    }
  }, [agentType]);

  const saveMemory = (data) => {
    const key = `memory_${agentType}`;
    localStorage.setItem(key, JSON.stringify(data));
    setMemoryState(data);
  };

  const clearMemory = () => {
    const key = `memory_${agentType}`;
    localStorage.removeItem(key);
    setMemoryState({});
  };

  return { memory, saveMemory, clearMemory };
}
