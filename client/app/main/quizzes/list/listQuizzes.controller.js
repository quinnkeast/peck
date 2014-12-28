'use strict';

angular.module('peckApp')
  .controller('ListQuizzesCtrl', function ($scope, $http, $modal, $q, Auth, Quiz, $state, $stateParams, bulkQuizzesSelected) {
    
    $scope.isLoading = false;
    $scope.numberOfQuizzesSelected = 0;
    bulkQuizzesSelected.reset();
    
    $scope.loadQuizzes = function() {
	  	$scope.isLoading = true;
	  	
	  	var quizzes = Quiz.query().$promise.then(function(quizzes) {
		  	$scope.quizzes = quizzes;
		  	$scope.isLoading = false;
	  	});
    };
    
    $scope.loadQuizzes();
    
	$scope.createQuiz = function () {

	    var modalInstance = $modal.open({
			templateUrl: 'app/main/quizzes/new/newQuiz.html',
			controller: 'NewQuizCtrl',
	    });
	
	    modalInstance.result.then(function () {
			// Do something now that it's open
		}, function () {
			//$log.info('Modal dismissed at: ' + new Date());
		});
	};
	
	$scope.quizSelectedForBulkAction = function(quiz) {
		if (quiz.isSelectedForBulkAction) {
			bulkQuizzesSelected.addQuiz(quiz._id);
		} else {
			bulkQuizzesSelected.removeQuiz(quiz._id);
			quiz.isSelectedForBulkAction = false;
		}
		$scope.numberOfQuizzesSelected = bulkQuizzesSelected.currentLength();
	};

    $scope.startTest = function(quizID) {
	    $state.go("activeQuiz", {id: quizID});
    }
	    
	$scope.takeQuizzesInBulk = function() {
		var quizIDs = bulkQuizzesSelected.getQuizzes();
	    $state.go("activeQuiz", {id: quizIDs}); 
	};
	
	}).service('bulkQuizzesSelected', function() {
		var quizList = [];
		
		var reset = function() {
			quizList = [];
		};
		
		var addQuiz = function(newObj) {
			quizList.push(newObj);
		};
		
		var removeQuiz = function(existingObj) {
			var position = quizList.indexOf(existingObj);
			if ( ~position ) quizList.splice(position, 1);
		};
		
		var getQuizzes = function(){
			return quizList;
		};
		
		var currentLength = function() {
			return quizList.length;
		}
		
		// Private functions
		function getIndexOf(arr, val, prop) {
			var l = arr.length,
			k = 0;
			for (k = 0; k < l; k = k + 1) {
				if (arr[k][prop] === val) {
					  return k;
				}
			}
			return false;
		}
		
		return {
			reset: reset,
			addQuiz: addQuiz,
			getQuizzes: getQuizzes,
			removeQuiz: removeQuiz,
			currentLength: currentLength
		};
	});