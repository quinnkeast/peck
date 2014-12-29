'use strict';

var _ = require('lodash');
var Quiz = require('./quiz.model');
var Question = require('../question/question.model');

// Get list of quizzes
exports.index = function(req, res) {
  Quiz.find(function (err, quizzes) {
    if(err) { return handleError(res, err); }
    return res.json(200, quizzes);
  });
};

// Get quizzes for a specified user
exports.findForUser = function(req, res) {
  Quiz.find({"authorID": req.user._id})
  //.populate('course')
  .select('-submissions')
  .exec(function (err, quiz) {
    if(err) { return handleError(res, err); }
    if(!quiz) { return res.send(404); }
    return res.json(quiz);
  });
};

// Get a single quiz
exports.show = function(req, res) {
  Quiz.findById(req.params.id)
  .populate('questions')
  .exec(function (err, quiz) {
    if(err) { return handleError(res, err); }
    if(!quiz) { return res.send(404); }
    return res.json(quiz);
  });
};

// Creates a new quiz in the DB.
exports.create = function(req, res) {
	var quiz = req.body;
	quiz.authorID = req.user._id;
	Quiz.create(quiz, function(err, quiz) {
	    if(err) { return handleError(res, err); }
	    return res.json(201, quiz);
	});
};

// Updates an existing quiz in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Quiz.findById(req.params.id, function (err, quiz) {
    if (err) { return handleError(res, err); }
    if(!quiz) { return res.send(404); }
    var updated = _.merge(quiz, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, quiz);
    });
  });
};

// Deletes a quiz from the DB.
exports.destroy = function(req, res) {
  Quiz.findById(req.params.id, function (err, quiz) {
    if(err) { return handleError(res, err); }
    if(!quiz) { return res.send(404); }
    quiz.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}