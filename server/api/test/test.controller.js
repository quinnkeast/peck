//'use strict';

var _ = require('lodash');
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

	// If there's only one ID provided, let's push into our array. Otherwise,
	// we'll just use the provided array.
	if (Object.prototype.toString.call(req.query.id) === '[object Array]') {
		quizIDs = req.query.id;
	} else {
		quizIDs.push(req.query.id);
	}
	
	var numberOfQuizzes = quizIDs.length;
	
	// Asyncronous function to get each quiz
	function getQuizzes(i, length, callback) {
		if (i < length) {
			Quiz.findById(quizIDs[i])
				.populate('questions')
				.exec(function (err, quiz) {
					if (err) { return handleError(res, err); }
					if (!quiz) { return res.send(404, 'Quiz with the id ' + quizIDs[i] + ' not found'); }
					
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
				
				// Continue and get the next quiz
				getQuizzes(i + 1, length, callback);	
			});
		} else {
			callback();
		}
	}
	
	// Get each quiz asyncronously, and then
	getQuizzes(0, numberOfQuizzes, function() {
		// Shuffle the questions to return them in a random order
		shuffle(responseObject.questions);
		return res.json(200, responseObject);
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
	if (Object.prototype.toString.call(submission._id) === '[object Array]') {
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
		if (result.length != quizzes.length) { return res.send(404, 'Quiz not found'); }
		
		// Asyncronous function to check each question.
		function checkQuestions(i, length, callback) {
		    if (i < length) {
		        
		        // If a question doesn't have an ID, we can't look it up.
		        if (!submission.questions[i]._id) {
					return res.send(400, 'Bad request');
				}
				
				// Find the question for the submitted question's ID
				Question.findById(submission.questions[i]._id, function (err, question) {
					if (err) { return handleError(res, err); }
					if (!question) { return res.send(404, 'Question not found'); }
		            
		            // Mark question as correct or wrong.
					// For the future, we can probably switch between logic
					// based on what kind of question was submitted. Long answer,
					// M/C, choose all that apply, etc.		
		            if (question.current.answer._id == submission.questions[i].selectedAnswer) {
						// Question is correct. That's all we need!
						submission.questions[i].isCorrect = true;
						numberCorrect++;
					} else {
						// Question is incorrect.
						submission.questions[i].isCorrect = false;
						
						// We're gonna want to store the wrongly-answered question
						// and what you answered for it.
						wronglyAnswered.push({
							"questionID": question._id,
							"selectedAnswerID": submission.questions[i].selectedAnswer
						});				
						
						// Loop through the answers to indicate the correct and wrong answers.
						var numberOfAnswers = submission.questions[i].answers.length;
						for (var j = 0; j < numberOfAnswers; j += 1) {
							if (submission.questions[i].answers[j]._id == submission.questions[i].selectedAnswer) {
								submission.questions[i].answers[j].wrongAnswer = true;
							} else if (submission.questions[i].answers[j]._id == question.current.answer._id) {
								submission.questions[i].answers[j].correctAnswer = true;
							}
						}
					}
		            // Check next question
		            checkQuestions(i + 1, length, callback);
				});
		    } else {
		        callback();
		    }
		}
		
		// Check each question asyncronously, and then 
		checkQuestions(0, numberOfQuestions, function() {
		    // Callback. Once it finishes looping through the questions, 
		    // it'll run everything below.
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