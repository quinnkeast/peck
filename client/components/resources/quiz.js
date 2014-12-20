'use strict';

angular.module('peckApp')
	.factory('Quiz', function($resource) {
		return $resource('/api/quizzes/:id/:mode', { 
				id: '@_id',
				mode: '@mode'
			}, {
			update: {
				method: 'PUT' // this method issues a PUT request
			}
		});
	});