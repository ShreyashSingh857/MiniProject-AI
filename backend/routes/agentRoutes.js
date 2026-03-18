const express = require('express');
const router = express.Router();

const reflexAgent = require('../agents/reflexAgent');
const modelAgent = require('../agents/modelAgent');
const goalAgent = require('../agents/goalAgent');
const utilityAgent = require('../agents/utilityAgent');

router.post('/move', (req, res) => {
  const { agentType, grid, currentPos, goalPos, coins, memory } = req.body;

  if (!grid || !currentPos || !goalPos) {
    return res.status(400).json({ error: 'Missing required fields: grid, currentPos, goalPos' });
  }

  let result;

  try {
    switch (agentType) {
      case 'reflex':
        result = reflexAgent(grid, currentPos, goalPos, memory || {});
        break;
      case 'model':
        result = modelAgent(grid, currentPos, goalPos, memory || {});
        break;
      case 'goal':
        result = goalAgent(grid, currentPos, goalPos, memory || {});
        break;
      case 'utility':
        result = utilityAgent(grid, currentPos, goalPos, coins || [], memory || {});
        break;
      default:
        return res.status(400).json({ error: `Unknown agentType: ${agentType}` });
    }

    res.json(result);
  } catch (err) {
    console.error(`Agent error [${agentType}]:`, err.message);
    res.status(500).json({ error: 'Agent computation failed', details: err.message });
  }
});

module.exports = router;
