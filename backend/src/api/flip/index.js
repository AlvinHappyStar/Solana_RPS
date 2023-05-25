const express = require('express');
const router = express.Router();
const flipController = require('./controller');

router.post('/send_offer', flipController.sendOffer);
router.get('/get_history', flipController.getHistory);
router.get('/get_status', flipController.getStatus);

module.exports = router;