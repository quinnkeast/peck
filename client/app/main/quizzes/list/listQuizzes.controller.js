'use strict';

angular.module('peckApp')
  .controller('ListQuizzesCtrl', function ($scope, $http, $modal) {
    $scope.quizzes = [];
    
    $http.get('/api/quizzes').success(function(quizzes) {
	    $scope.quizzes = quizzes;
    });
    
    $scope.addQuiz = function() {
	    if($scope.newQuiz === '') {
		    return;
	    }
	    $http.post('/api/quizzes', { title: $scope.newQuiz });
	    $scope.newQuiz = '';
    };
    
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