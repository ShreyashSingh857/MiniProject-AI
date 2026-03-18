const express = require('express');
const router = express.Router();

const reflexAgent = require('../agents/reflexAgent');
const modelAgent = require('../agents/modelAgent');
const goalAgent = require('../agents/goalAgent');
const utilityAgent = require('../agents/utilityAgent');

router.post('/move', (req, res) => {
  try {
    const { agentType, grid, currentPos, goalPos, coins, memory } = req.body;

    let result;

    switch (agentType) {
      case 'reflex':
        result = reflexAgent(grid, currentPos, goalPos, memory);
        break;
      case 'model':
        result = modelAgent(grid, currentPos, goalPos, memory);
        break;
      case 'goal':
        result = goalAgent(grid, currentPos, goalPos, memory);
        break;
      case 'utility':
        result = utilityAgent(grid, currentPos, goalPos, coins, memory);
        break;
      default:
        return res.status(400).json({ error: 'Invalid agent type' });
    }

    res.json(result);
  } catch (error) {
    console.error('Agent move error:', error);
    res.status(500).json({ error: 'Failed to compute next move' });
  }
});

module.exports = router;
