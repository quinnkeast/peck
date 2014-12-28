'use strict';

var express = require('express');
var controller = require('./test.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.getTest);
router.post('/:id', auth.isAuthenticated(), controller.scoreTest);

module.exports = router;