'use strict';

angular.module('peckApp')
	.factory('Quiz', function($resource) {
		var Quiz = $resource('/api/quizzes/:id/:mode', {
			id: '@_id',
			mode: '@mode'
		}, {
			update: {
				method: 'PUT' // This method issues a PUT request
			}
		});
		
		angular.extend(Quiz.prototype, {
			getResult: function() {
				// TODO - This is just an example from elsewhere
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