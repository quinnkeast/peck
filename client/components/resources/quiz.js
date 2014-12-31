'use strict';

angular.module('peckApp')
	.factory('Quiz', function($resource) {
		var Quiz = $resource('/api/quizzes/:id', {
			id: '@id'
		}, {
			update: {
				method: 'PUT'
			},
			getTest: {
				method: 'GET',
				url: '/api/test'
			},
			getScore: {
				method: 'POST',
				url: '/api/test/score'
			}
		});
		
		angular.extend(Quiz.prototype, {
			getResult: function(question) {
				//if (submitted === true) {
                	if (question.isCorrect === true) {
	                	return "question-correct";
                	} else if (question.isCorrect === false) {
	                	return "question-incorrect";
                	}
                //}
                //else return "not-submitted";
			}
		});
		
		return Quiz;
	});