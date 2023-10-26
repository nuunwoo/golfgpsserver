const express = require('express');
const router = express.Router();
const controller = require('./admin.controller');

router.get('/', controller.info);
router.get('/userInfo', controller.userInfo);
router.post('/userAdd', controller.userAdd);
router.post('/userDelete', controller.userDelete);

module.exports = router;
