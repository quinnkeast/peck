'use strict';

angular.module('peckApp')
	.factory('Question', function($resource) {
		var Question = $resource('/api/questions/:id/:mode', { 
				id: '@_id',
				mode: '@mode'
			}, {
			update: {
				method: 'PUT' // this method issues a PUT request
			}
		});
		
		angular.extend(Question.prototype, {
			getResult: function() {
				if (this.status == 'complete') {
					if (this.passed === null) return "Finished";
					else if (this.passed === true) return "Pass";
					else if (this.passed === false) return "Fail";
				}
				else return "Running";
			}
		});
		
		return Question;	
	});