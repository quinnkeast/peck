'use strict';

angular.module('peckApp')
  .controller('ActiveQuizCtrl', function ($scope, $http, $stateParams, $q, $state, Auth) {
   
    $scope.quiz;
    $scope.results;
    $scope.submitted = false;
    
    $http.get('/api/quizzes/' + $stateParams.quizID + '/test')
    	.success(function(quiz) {
	    	$scope.quiz = quiz;
	    })
	    .error(function(data, status) {
	    	if(status === 404) {
		    	console.log('yep');
	    	}
	    });
    
    $scope.submitQuiz = function() {
	    
	    // Submitted!
	    $scope.submitted = true;
	    
	    // Assemble the submission for scoring
	    var submission = {
		    "quiz_id": $scope.quiz._id,
		    "user_id": Auth.getCurrentUser()._id,
		    "answers": []
	    };
	    
	    // Get the question ID and selected answer ID for each question submitted
	    for (var i = 0; i < $scope.quiz.questions.length; i++) {
			submission.answers.push({
				"question_id": $scope.quiz.questions[i]._id,
				"selection": $scope.quiz.questions[i].selection
			});
		}
	    
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
					if (result.question_id == question._id) {
						if (result.correct === true) {
							question.correct = true;
						}
						// For each answer in the question
						angular.forEach(question.answers, function(answer) {
							// If it's the selected answer and correct answer
							if (answer._id == result.answer) {
								answer.correct = true;
							// If it's the selected answer and wrong answer
							} else if (question.selection == answer._id && answer._id != result.answer) {
								answer.correct = false;
							}
						});
					}
				});	
			});
			
			// TODO - Take the results and display them. Probably change the class of 
			// wrong answers, etc. Also change scope score and such to reflect.
			// Long term - we'll have things like long-term performance on this quiz.
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