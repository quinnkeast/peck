'use strict';

angular.module('peckApp')
	.factory('Question', function($resource) {
		return $resource('/api/questions/:id/:mode', { 
				id: '@_id',
				mode: '@mode'
			}, {
			update: {
				method: 'PUT' // this method issues a PUT request
			}
		});	
	});