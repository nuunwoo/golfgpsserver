const express = require('express');
const router = express.Router();
const controller = require('./message.controller');

/* GET users listing. */
router.post('/send', controller.send);
router.post('/receive', controller.receive);

module.exports = router;
