'use strict';

angular.module('peckApp')
	.controller('ActiveQuizCtrl', function ($scope, $http, $stateParams, $q, $state, Auth, Quiz) {
	  
		// SEEK $scope.results;
		$scope.submitted = false;
		$scope.isLoading = false;
	   
		$scope.loadQuiz = function() {
			
			$scope.isLoading = true;
			
			var quiz = Quiz.getTest({ "id": $stateParams.quizID }).$promise.then(function(quiz) {
				$scope.quiz = quiz;
			});
			
		};
		
		$scope.loadQuiz();
	    
	    $scope.submitQuiz = function(quiz) {
		    
		    $scope.submitted = true;
		    $scope.isLoading = true;

		    var scoredQuiz = Quiz.getScore({ "id": quiz._id }, quiz).$promise.then(function(scoredQuiz) {
			    $scope.quiz = scoredQuiz;
		    });
	    };
	    
		$scope.restart = function() {
			$state.reload();
		};
        
	})
	.filter('percentage', ['$filter', function($filter) {
		return function(input, decimals) {
			return $filter('number')(input*100, decimals)+'%';
	    };
	}]);