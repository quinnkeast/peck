'use strict';

angular.module('peckApp')
	.factory('Course', function($resource) {
		return $resource('/api/courses/:id/:mode', { 
				id: '@_id',
				mode: '@mode'
			}, {
			update: {
				method: 'PUT' // this method issues a PUT request
			}
		});	
	});