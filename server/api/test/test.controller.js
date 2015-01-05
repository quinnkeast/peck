//'use strict';

var _ = require('lodash');
var async = require('async');
var Test = require('./test.model');
var Quiz = require('../quiz/quiz.model');
var Question = require('../question/question.model');

// Get a quiz for an active test
exports.getTest = function(req, res) {
	
	if (!req.query.id) {
		return res.json(400, 'Bad request');
	}
	
	var quizIDs = [],
		quizzes = [],
		responseObject = {
			"_id": [],
			"titles": [],
			"questions": []
		};

	// If there's only one ID provided, push into our array. Otherwise, we'll just use the provided array.
	if (_.isArray(req.query.id)) {
		quizIDs = req.query.id;
	} else {
		quizIDs.push(req.query.id);
	}
	
	// Fetch each quiz asyncronously	
	async.eachSeries(quizIDs, function(quiz, callback) {
		Quiz.findById(quiz)
			.populate('questions')
			.exec(function (err, quiz) {
				
				if (err) { return handleError(res, err); }
				if (!quiz) { return res.send(404, 'Quiz with the id ' + quiz + ' not found'); }
		
				responseObject._id.push(quiz._id);
				responseObject.titles.push(quiz.title);
				
				// For each question in the quiz, reformat the response to return each possible answer
				// without any indication of the real answer.			
				for (var j = 0; j < quiz.questions.length; j++) {
					
					// Concat the otherAnswers array with the real answer, and create
					// an array of all possible answers called allAnswers to be returned
					// With the response
					var otherAnswersObject = quiz.questions[j].current.otherAnswers;
					var answerObject = [ quiz.questions[j].current.answer ];
					var allAnswers = otherAnswersObject.concat(answerObject);
					
					// Create an object to represent the question. This is all we need to display
					// the question, its answers, and the associated IDs to help us score it later.
					var questionObject = {
						"_id": quiz.questions[j]._id,
						"quizID": quiz._id,
						"question": quiz.questions[j].current.content,
						"answers": shuffle(allAnswers)
					};
					responseObject.questions.push(questionObject);
				}
			callback();
		});
	},
	function(err) {
		if (!err) {
			// Done without issues.
			// Shuffle the questions to return them in a random order.
			shuffle(responseObject.questions);
			return res.json(200, responseObject);
		}
	});

};

// Scores a quiz submission, and stores the results.
exports.scoreTest = function(req, res) {
	
	var submission = req.body,
		quizzes = [],
		numberCorrect = 0,
		numberOfQuestions = submission.questions.length,
		wronglyAnswered = [],
		submissionDetails = {};
	
	// Are the submission IDs in an array? If not, we need to push the lone ID into an array.
	if (_.isArray(submission._id)) {
		quizzes = submission._id;
	} else {
		quizzes.push(submission._id);
	}

	// Make sure the submitted quiz(zes) exist(s).
	Quiz.find({ _id: { $in: quizzes }}, function (err, result) {
		
		if (err) { return handleError(res, err); }
		if (!result) { return res.send(404); }
		
		// If the number of results doesn't match the number of quiz IDs, one or more wasn't found.
		// If that's the case, we need to exit.
		// TODO - there's gotta be a better way.
		if (result.length !== quizzes.length) { return res.send(404, 'Quiz not found'); }
		
		async.eachSeries(submission.questions, function(submission, callback) {
			Question.findById(submission._id)
				.exec(function (err, question) {
					if (err) { return handleError(res, err); }
					if (!question) { return res.send(404, 'Question not found'); }
		            
		            // Mark question as correct or wrong.
					// For the future, we can probably switch between logic
					// based on what kind of question was submitted. Long answer,
					// M/C, choose all that apply, etc.		
		            if (question.current.answer._id == submission.selectedAnswer) {
						// Question is correct. That's all we need!
						submission.isCorrect = true;
						numberCorrect++;
					} else {
						// Question is incorrect.
						submission.isCorrect = false;
						
						// We're gonna want to store the wrongly-answered question
						// and what you answered for it.
						wronglyAnswered.push({
							"questionID": question._id,
							"selectedAnswerID": submission.selectedAnswer
						});				
						
						// Loop through the answers to indicate the correct and wrong answers.
						console.log(question);
						var numberOfAnswers = submission.answers.length;
						for (var j = 0; j < numberOfAnswers; j += 1) {
							if (submission.answers[j]._id == submission.selectedAnswer) {
								submission.answers[j].wrongAnswer = true;
							} else if (submission.answers[j]._id == question.current.answer._id) {
								submission.answers[j].correctAnswer = true;
							}
						}
					}
				callback();
			});
		},
		function(err) {
			if (!err) {
				    submissionDetails = {
					"userID": req.body.userID,
					"score": numberCorrect,
					"numberOfQuestions": numberOfQuestions,
					"percentage": numberCorrect / numberOfQuestions,
					"wronglyAnswered": wronglyAnswered
				};
				
				// Update the quiz to insert the new submission
				//quiz.submissions.push(submissionDetails);
				submission.results = submissionDetails;
				
				/* TODO - Removed the saving of results to the quiz for the time being.
				 * This needs to be updated so that it can store the individual quiz results,
				 * even though the questions are all over the place.
				 */ 
				// Save!			
			    //quiz.save(function (err) {
				//	if (err) { return handleError(res, err); }
					// All good! Now we're going to return the submitted quiz
					// as it was, with the results included.
					return res.json(200, submission);
			   //});
			}
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