const express = require('express');
const router = express.Router();
const controller = require('./users.controller');

/* GET users listing. */
router.get('/login', controller.login);
router.get('/logout', controller.logout);
router.get('/autologin', controller.autologin);

module.exports = router;
