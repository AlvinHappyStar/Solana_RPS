const express = require('express');
const router = express.Router();
const flipController = require('./controller');

router.get('/get_history', flipController.getHistory);
router.post('/set_history', flipController.setHistory);

module.exports = router;