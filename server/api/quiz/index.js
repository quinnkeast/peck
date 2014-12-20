'use strict';

var express = require('express');
var controller = require('./quiz.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

//router.get('/', controller.index);
router.get('/', auth.isAuthenticated(), controller.findForUser);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/:id/test', controller.test);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);
router.post('/:id/score', auth.isAuthenticated(), controller.score);

module.exports = router;