'use strict';

angular.module('peckApp')
	.factory('Quiz', function($resource) {
		var Quiz = $resource('/api/quizzes/:id', {
			id: '@id'
		}, {
			getTest: {
				method: 'GET',
				url: '/api/quizzes/:id/test'
			},
			getScore: {
				method: 'POST',
				url: '/api/quizzes/:id/score' // This method issues a PUT request
			}
		});
		
		angular.extend(Quiz.prototype, {
			getResult: function() {
				console.log(this);
				if (this.status == 'complete') {
                    if (this.passed === null) return "Finished";
                    else if (this.passed === true) return "Pass";
                    else if (this.passed === false) return "Fail";
                }
                else return "Running";
			}
		});
		
		return Quiz;
	});
	
	
/*	'answer-correct': submitted === true && question.selection == answer._id && answer.isCorrect === true, 
	'answer-incorrect': submitted === true && question.selection == answer._id && !answer.isCorrect, 
	'answer-should-be': submitted === true && question.selection != answer._id && answer.isCorrect */