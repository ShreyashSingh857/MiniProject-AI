import { useState, useEffect, useRef } from 'react'
import Grid from './components/Grid'
import ControlPanel from './components/ControlPanel'
import StatsPanel from './components/StatsPanel'
import PathOverlay from './components/PathOverlay'
import Agent from './components/Agent'
import { callAgentMove } from './services/agentApi'

import './App.css'

function App() {
  const GRID_SIZE = 15;
  const initialGrid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
  
  const [grid, setGrid] = useState(initialGrid);
  const startPosition = { x: 0, y: 0 };
  const getGoalPos = () => ({ x: GRID_SIZE - 1, y: GRID_SIZE - 1 });
  
  const [startPos, setStartPos] = useState(startPosition);
  const [goalPos, setGoalPos] = useState(getGoalPos());
  const [agentPos, setAgentPos] = useState(startPosition);
  
  const [coins, setCoins] = useState([]);
  const [agentType, setAgentType] = useState('reflex');
  
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [exploredCells, setExploredCells] = useState([]);
  const [pathSoFar, setPathSoFar] = useState([]);
  const [steps, setSteps] = useState(0);
  const [goalReached, setGoalReached] = useState(false);

  const [memory, setMemory] = useState({});
  const timerRef = useRef(null);

  // Stop interval when unmounting or goal reached
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (isRunning && !goalReached) {
      // Speed 1 = 1000ms, Speed 10 = 100ms
      const intervalMs = 1000 - ((speed - 1) * 100);
      timerRef.current = setInterval(performStep, intervalMs);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, speed, goalReached, agentPos, grid, coins, memory, agentType]);

  const performStep = async () => {
    if (goalReached) return;

    if (agentPos.x === goalPos.x && agentPos.y === goalPos.y) {
      setGoalReached(true);
      setIsRunning(false);
      return;
    }

    const payload = {
      agentType,
      grid,
      currentPos: agentPos,
      goalPos,
      coins,
      memory
    };

    const res = await callAgentMove(payload);
    if (res) {
      setAgentPos(res.nextPos);
      setMemory(res.updatedMemory);
      
      // Always update exploredCells — model-based agent grows it every step
      if (res.exploredCells) {
        setExploredCells(res.exploredCells);
      }

      // Always update pathSoFar — model-based agent appends every step
      if (res.pathSoFar) {
        setPathSoFar(res.pathSoFar);
      }
      
      setSteps(prev => prev + 1);

      if (res.nextPos.x === goalPos.x && res.nextPos.y === goalPos.y) {
        setGoalReached(true);
        setIsRunning(false);
      }
    }
  };

  const handleAgentChange = (type) => {
    setAgentType(type);
    setIsRunning(false);
    setAgentPos(startPos);
    setExploredCells([]);
    setPathSoFar([]);
    setSteps(0);
    setGoalReached(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setAgentPos(startPos);
    setExploredCells([]);
    setPathSoFar([]);
    setSteps(0);
    setGoalReached(false);
    setMemory({});
  };

  const handleCellClick = ({ x, y, forceTo }) => {
    if ((x === startPos.x && y === startPos.y) || (x === goalPos.x && y === goalPos.y)) return;

    setGrid(prev => {
      const newGrid = prev.map(row => [...row]);
      if (forceTo !== undefined) {
        if (newGrid[y][x] !== 2) {
          newGrid[y][x] = forceTo;
        }
      } else {
        if (newGrid[y][x] !== 2) {
          newGrid[y][x] = newGrid[y][x] === 1 ? 0 : 1;
        }
      }
      return newGrid;
    });

    if (forceTo === 1 || forceTo === undefined) {
      setCoins(prev => prev.filter(c => !(c.x === x && c.y === y)));
    }
  };

  const handleScatterCoins = () => {
    const newCoins = [];
    const gridCopy = grid.map(row => [...row]);

    for (let i = 0; i < 5; i++) {
      let cx, cy, attempts = 0;
      do {
        cx = Math.floor(Math.random() * GRID_SIZE);
        cy = Math.floor(Math.random() * GRID_SIZE);
        attempts++;
      } while (
        attempts < 100 &&
        (gridCopy[cy][cx] !== 0 ||
          (cx === startPos.x && cy === startPos.y) ||
          (cx === goalPos.x  && cy === goalPos.y))
      );

      if (gridCopy[cy][cx] === 0) {
        newCoins.push({ x: cx, y: cy, value: Math.floor(Math.random() * 41) + 10 });
        gridCopy[cy][cx] = 2;
      }
    }

    setCoins(prev => [...prev, ...newCoins]);
    setGrid(gridCopy);   // Single setGrid call — fixes the batching bug
  };

  const handleRandomWalls = () => {
    const newGrid = initialGrid.map(row => [...row]);
    // 20% walls
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if ((x === startPos.x && y === startPos.y) || (x === goalPos.x && y === goalPos.y)) continue;
        if (Math.random() < 0.2) {
          newGrid[y][x] = 1;
        }
      }
    }
    // Repopulate coins in grid array so they render (coins keep their state though)
    coins.forEach(c => {
      if (newGrid[c.y][c.x] !== 1) newGrid[c.y][c.x] = 2;
    });
    setGrid(newGrid);
  };

  // coins collected calculation
  const collectedCoins = memory?.collectedCoins || [];

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Different Types of Agents Behaviour</h1>
      </header>

      <div className="main-content">
        <ControlPanel 
          agentType={agentType}
          onAgentChange={handleAgentChange}
          onPlay={() => setIsRunning(true)}
          onPause={() => setIsRunning(false)}
          onReset={handleReset}
          onScatterCoins={handleScatterCoins}
          onRandomizeWalls={handleRandomWalls}
          speed={speed}
          onSpeedChange={(val) => setSpeed(val)}
          isRunning={isRunning}

        />

        <div className="grid-wrapper">
          <Grid 
            grid={grid}
            agentPos={agentPos}
            goalPos={goalPos}
            startPos={startPos}
            coins={coins}
            exploredCells={exploredCells}
            pathSoFar={pathSoFar}
            onCellClick={handleCellClick}
          />
          <PathOverlay exploredCells={exploredCells} pathSoFar={pathSoFar} gridSize={GRID_SIZE} />
          <Agent position={agentPos} agentType={agentType} />
          <div className="grid-hint">✏️ Click or drag cells to draw / erase walls</div>
        </div>

        <StatsPanel 
          steps={steps}
          exploredCount={exploredCells.length}
          coinsCollected={collectedCoins}
          agentType={agentType}
          goalReached={goalReached}
        />
      </div>
    </div>
  )
}

export default App
