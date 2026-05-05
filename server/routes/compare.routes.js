const express = require('express');
const router = express.Router();
const { compareSchedules } = require('../controllers/compare.controller');

router.get('/:userId/:friendId', compareSchedules);

module.exports = router;
