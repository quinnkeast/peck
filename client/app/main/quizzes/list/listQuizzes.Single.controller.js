'use strict';

angular.module('peckApp')
	.controller('ListQuizzes.Single.Ctrl', function ($scope, $location, $http, Question, Quiz, Course, $q) {
		
		$scope.updateQuizName = function(id, data) {
			return Quiz.update( { "id": id, "title": data });
		};
	
	});
