const express = require('express');
const router = express.Router();

const main = require('./main/index');
const admin = require('./admin/index');
const user = require('./users/index');
const golf = require('./golfinfo/index');
const message = require('./message/index');
const score = require('./score/index');

router.use('/main', main);
router.use('/admin', admin);
router.use('/user', user);
router.use('/golf', golf);
router.use('/message', message);
router.use('/score', score);

module.exports = router;
