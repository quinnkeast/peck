'use strict';

var _ = require('lodash');
var Question = require('./question.model');
var Quiz = require('../quiz/quiz.model');

// Get list of questions
exports.index = function(req, res) {
  Question.find(function (err, questions) {
    if(err) { return handleError(res, err); }
    return res.json(200, questions);
  });
};

// Get a single question
exports.show = function(req, res) {
  Question.findById(req.params.id, function (err, question) {
    if(err) { return handleError(res, err); }
    if(!question) { return res.send(404); }
    return res.json(question);
  });
};

// Creates a new question in the DB.
exports.create = function(req, res) {
	
	// Need a question and correct answer in the request
	if (!req.body.question || !req.body.answer) {
		return res.send(400);
	}
	
	// Create new Question object
	var newQuestion = new Question();
	newQuestion.current.otherAnswers = [];
	
	// If we have other answers with the request
	if (req.body.otherAnswers) {
		// Push each "wrong answer" into the otherAnswers array
		for (var i=0; i < req.body.otherAnswers.length; i++) {
			// If the otherAnswer has actual text:
			if (req.body.otherAnswers[i].text) {
				var answerObj = {
					text: req.body.otherAnswers[i].text
				};
				newQuestion.current.otherAnswers.push(answerObj);
			}
		}
	}
	
	// Add the actual question
	newQuestion.current.content = req.body.question;
	newQuestion.current.answer.text = req.body.answer;
	
	// Save the question in the DB.
	newQuestion.save(function(err, question) {
		if (err) { return handleError(res, err); }
		
		// No error. Find the existing parent quiz based on the quizID.
		Quiz.findById(req.body.quizID, function (err, quiz) {
			if (err) { return handleError(res, err); }
			if (!quiz) { return res.send(404); }

			// Add the question's ID to the quiz's array of questions.
			quiz.questions.push(question._id);
			
			// Update date
			var now = new Date();
			quiz.updated = now.toJSON();
			
			// Update the quiz in the DB.
			quiz.save(function (err) {
				if (err) { return handleError(res, err); }
				return res.json(201, question);
			});
		});
	});
};

// Updates an existing question in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Question.findById(req.params.id, function (err, question) {
    if (err) { return handleError(res, err); }
    if(!question) { return res.send(404); }
    var updated = _.merge(question, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, question);
    });
  });
};

// Deletes a question from the DB.
exports.destroy = function(req, res) {
  Question.findById(req.params.id, function (err, question) {
    if(err) { return handleError(res, err); }
    if(!question) { return res.send(404); }
    question.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}