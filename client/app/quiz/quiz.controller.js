'use strict';

angular.module('peckApp')
	.controller('ActiveQuizCtrl', function ($scope, $http, $stateParams, $q, $state, $modal, Auth, Quiz, $timeout, $window) {
	  
		$scope.submitted = false;
		$scope.isLoading = false;
		$scope.showOverlay = false;
				
		$scope.loadQuiz = function() {
			$scope.isLoading = true;
			
			var quiz = Quiz.getTest({"id": $stateParams.id}).$promise.then(function(quiz) {
				$scope.quiz = quiz;
				$scope.isLoading = false;
			});
			
		};
		
		$scope.loadQuiz();
	    
	    $scope.submitQuiz = function(quiz) {
		    
		    $scope.submitted = true;
		    $scope.scored = false;
		    $scope.isLoading = true;
		    $scope.showOverlay = true;
		    var scoredQuiz = Quiz.getScore({"id": $stateParams.id}, quiz).$promise.then(function(scoredQuiz) {
			    $scope.isLoading = false;
				
				$timeout(function(){
					$window.scrollTo(0,0);
					$scope.scored = true;
					$scope.showOverlay = false;
					$scope.quiz = scoredQuiz;
				}, 1000);    
			    
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