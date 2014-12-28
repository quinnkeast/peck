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
		
		return Question;	
	});