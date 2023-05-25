const express = require('express');
const Flip = require('./flip');

const router = express.Router();
router.use('/flip', Flip);
module.exports = router;
