'use strict';

angular.module('peckApp')
	.controller('EditQuizCtrl', function ($scope, $http, $stateParams, $q, Question, Quiz, Auth) {
		
		$scope.isLoading = false;
	  	
		$scope.loadQuiz = function() {
			$scope.isLoading = true;
			var quiz = Quiz.get({ "id": $stateParams.quizID }).$promise.then(function(quiz) {
			    $scope.quiz = quiz;
			    $scope.isLoading = false;
			    $scope.beginWritingQuestion = true;
			});
		};
		
		$scope.loadQuiz();
		  
	    $scope.blankQuestion = function() {
			var newQuestion = new Question();
			newQuestion.otherAnswers = [{},{},{}];
			$scope.newQuestion = newQuestion;
	    };
	    
	    // Set up the new blank question
	    $scope.blankQuestion();
	    
	    $scope.addAnotherAnswer = function() {
		    $scope.newQuestion.otherAnswers.push({});
	    };
	    
	    $scope.addQuestion = function() {
		    
		    // Can't submit what we don't have!
		    if($scope.newQuiz === '') {
			    return;
		    }
		    
		    $scope.beginWritingQuestion = false;
		    
		    Question.save({
			    "question": $scope.newQuestion.question,
				"answer": $scope.newQuestion.answer.text,
				"otherAnswers": $scope.newQuestion.otherAnswers,
				"quizID": $stateParams.quizID,
				"authorID": Auth.getCurrentUser()._id
		    }).$promise.then(function (data) {
			    
			    // Success handler
			    // Take the response data and push the newly-created question into the current quiz's array of questions.
				// This is for visual purposes. The quiz state doesn't need to be saved.
			    $scope.quiz.questions.push(data);
			    $scope.blankQuestion();
			    $scope.beginWritingQuestion = true;
			    
		    }, function (err) {
			    // Error handler
			    // TODO - Make error handler
			    console.log('Something went wrong while creating the question');
		    }); 
	
	    };
	    
	    $scope.deleteQuestion = function(question) {
			Question.delete({
				"id": question._id, 
				"quizID": $scope.quiz._id
			}, function() {

				// Success
				// Now, remove from the scope so it no longer shows up in the list
$scope.quiz.questions.splice($scope.quiz.questions.indexOf(question));

			}, function (err) {
				// Failure
				// TODO - add failure to delete
			});
	    };
	    
	});