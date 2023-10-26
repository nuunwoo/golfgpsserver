const express = require('express');
const router = express.Router();
const controller = require('./score.controller');

router.get('/guestScore', controller.guestScore);

module.exports = router;
