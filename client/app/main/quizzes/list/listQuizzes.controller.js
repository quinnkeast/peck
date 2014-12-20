'use strict';

angular.module('peckApp')
  .controller('ListQuizzesCtrl', function ($scope, $http, $modal, Auth, Quiz, quizzesObj) {
    
    $scope.quizzes = quizzesObj;
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
    
  });