'use strict';

var _ = require('lodash');
var Quiz = require('./quiz.model');

// Get list of quizzes
exports.index = function(req, res) {
  Quiz.find(function (err, quizs) {
    if(err) { return handleError(res, err); }
    return res.json(200, quizs);
  });
};

// Get a single quiz
exports.findForUser = function(req, res) {
  Quiz.find({"authorID": req.user._id})
  .populate('questions')
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

// Get a quiz for an active test
exports.test = function(req, res) {
	Quiz.findById(req.params.id)
		.populate('questions')
		.exec(function (err, quiz) {
			if(err) { return handleError(res, err); }
			if(!quiz) { return res.send(404); }
						
			var response = {
				"_id": quiz._id,
				"questions": []
			};
			
			// For each question in the quiz, reformat the response to return each possible answer
			// without any indication of the real answer.			
			for (var i = 0; i < quiz.questions.length; i++) {
				
				// Concat the otherAnswers array with the real answer, and create
				// an array of all possible answers called allAnswers to be returned
				// With the response
				var otherAnswersObject = quiz.questions[i].current.otherAnswers;
				var answerObject = [ quiz.questions[i].current.answer ];
				var allAnswers = otherAnswersObject.concat(answerObject);
				
				// Create an object to represent the question. This is all we need to display
				// the question, its answers, and the associated IDs to help us score it later.
				var questionObject = {
					"_id": quiz.questions[i]._id,
					"question": quiz.questions[i].current.content,
					"answers": shuffle(allAnswers)
				};
				response.questions.push(questionObject);
			}
			
			return res.json(200, response);
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

// Scores a quiz submission, and stores the results.
exports.score = function(req, res) {
  
	if(req.body._id) { delete req.body._id; }
	
	// Get the quiz by ID and populate with its questions
	Quiz.findById(req.params.id)
		.populate('questions')
		.exec(function (err, quiz) {
		
			if (err) { return handleError(res, err); }
			if (!quiz) { return res.send(404); }
		
			var submission = {
				"details": {},
				"results": []
			};
			var numberCorrect = 0;
			var numberOfQuestions = req.body.answers.length;
			var wrongAnswers = [];
			
			// For each submitted answer in the POST request
			for (var i = 0; i < req.body.answers.length; i++) {
				
				// For each question in the quiz we're working with
				for (var j = 0; j < quiz.questions.length; j++) {
					
					// We've found a question with the same ID as the submitted question & answer
					if (quiz.questions[j]._id == req.body.answers[i].questionID) {
						
						var status;
						
						// Now we're checking if the submitted answer for the question is correct
						if (quiz.questions[j].current.answer._id == req.body.answers[i].selection) {
							
							status = true;
							
							// Increment the number of correct answers
							numberCorrect++;
							
						} else {
							
							status = false;
							
							// Push each wrongly-answered question ID into wrongAnswers
							wrongAnswers.push(quiz.questions[j]._id);
						
						}
						
						// Push the results into an array that we can respond with
						submission.results.push({
							"questionID": req.body.answers[i].questionID,
							"isCorrect": status,
							"correctAnswer": quiz.questions[j].current.answer._id
						});
						
						break;
					}
				}
			}
			
			// Assemble the submission's details to be stored in the quiz
			submission.details = {
				"userID": req.body.userID,
				"score": numberCorrect,
				"numberOfQuestions": numberOfQuestions,
				"percentage": numberCorrect / numberOfQuestions,
				"wrongAnswers": wrongAnswers
			};
			
			// Update the quiz to insert the new submission
			quiz.submissions.push(submission.details);
						
		    quiz.save(function (err) {
				if (err) { return handleError(res, err); }
				return res.json(200, submission);
		    });

		});  
};

function handleError(res, err) {
  return res.send(500, err);
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}