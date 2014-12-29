'use strict';

var express = require('express');
var controller = require('./course.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.findForUser);

module.exports = router;