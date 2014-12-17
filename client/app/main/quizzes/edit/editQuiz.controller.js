'use strict';

angular.module('peckApp')
  .controller('EditQuizCtrl', function ($scope, $http, $stateParams, $q) {
   
    $scope.quiz;
    
    $scope.newQuestion = {
	    "question": "",
	    "answer": {
		    "text": ""
	    },
	    "other_answers": [{
		    "id": 1,
	    }, {
		    "id": 2,
	    }, {
		    "id": 3,
	    }]
    };
    
    $http.get('/api/quizzes/' + $stateParams.quizID).success(function(quiz) {
	    $scope.quiz = quiz;
    });
    
    $scope.addInputAfter = function() {
	    $scope.newQuestion.other_answers.push({
		    "id": $scope.newQuestion.other_answers.length + 1
		});
    }
    
    $scope.addQuestion = function() {
	    
	    // Can't submit what we don't have!
	    if($scope.newQuiz === '') {
		    return;
	    }
	    
	    // Make POST request to add a new question.
	    $http({
			method: 'POST',
			url: '/api/questions',
			data: {
				"question": $scope.newQuestion.question,
				"answer": $scope.newQuestion.answer.text,
				"other_answers": $scope.newQuestion.other_answers,
				"quiz_id": $stateParams.quizID
				// TODO - add course ID
				// TODO - add author ID
			},
			headers: {
				'Content-Type': 'application/json;'
			}
		}).success(function (data) {
			// Take the response data and push the newly-created question into the current quiz's array of questions.
			// This is for visual purposes. The quiz state doesn't need to be saved.
		    $scope.quiz.questions.push(data);
			$scope.newQuestion = {
			    "question": "",
			    "answer": "",
			    "other_answers": [{
				    "id": 1,
			    }, {
				    "id": 2,
			    }, {
				    "id": 3,
			    }]
		    };
		});

    };
    
    $scope.deleteQuiz = function(quiz) {
	    $http.delete('/api/quiz/' + quiz._id);
    };
    
  });