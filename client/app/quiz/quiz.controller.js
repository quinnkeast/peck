'use strict';

angular.module('peckApp')
	.controller('ActiveQuizCtrl', function ($scope, $http, $stateParams, $q, $state, Auth, Quiz) {
	  
		$scope.results;
		$scope.submitted = false;
	  	$scope.isLoading = false;
	   
		$scope.loadQuiz = function() {
			$scope.isLoading = true;
			var quiz = Quiz.get({ "id": $stateParams.quizID, "mode": "test" }).$promise.then(function(quiz) {
				$scope.quiz = quiz;
			});
		};
		
		$scope.loadQuiz();
	    
	    $scope.submitQuiz = function() {
		    
		    // Submitted!
		    $scope.submitted = true;
		    
		    // Assemble the submission for scoring
		    var submission = {
			    "quizID": $scope.quiz._id,
			    "userID": Auth.getCurrentUser()._id,
			    "answers": []
		    };
		    
		    // Get the question ID and selected answer ID for each question submitted
		    for (var i = 0; i < $scope.quiz.questions.length; i++) {
				submission.answers.push({
					"questionID": $scope.quiz.questions[i]._id,
					"selection": $scope.quiz.questions[i].selection
				});
			}
		    console.log($scope.quiz);
		    
		    // Make POST request to submit the quiz.
		    $http({
				method: 'POST',
				url: '/api/quizzes/' + $scope.quiz._id + '/score',
				data: submission,
				headers: {
					'Content-Type': 'application/json;'
				}
			}).success(function (submission) {
				$scope.results = submission.results;
				$scope.submissionDetails = submission.details;
				
				// For each result object
				angular.forEach($scope.results, function(result) {
					// For each quiz question
					angular.forEach($scope.quiz.questions, function(question) {
						if (result.questionID == question._id) {
							if (result.isCorrect === true) {
								question.isCorrect = true;
							}
							// For each answer in the question
							angular.forEach(question.answers, function(answer) {
								// If it's the selected answer and correct answer
								if (answer._id == result.correctAnswer) {
									answer.isCorrect = true;
								// If it's the selected answer and wrong answer
								} else if (question.selection == answer._id && answer._id != result.correctAnswer) {
									answer.isCorrect = false;
								}
							});
						}
					});	
				});
				
			});
	
	    };
	    
		$scope.restart = function() {
			$state.reload();
		};
        
	})
	.filter('percentage', ['$filter', function($filter) {
		return function(input, decimals) {
			return $filter('number')(input*100, decimals)+'%';
	    };
	}]);