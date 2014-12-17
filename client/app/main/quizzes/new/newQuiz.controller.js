'use strict';

angular.module('peckApp')
  .controller('NewQuizCtrl', function ($scope, $location, $http, $modalInstance) {
  
  		$scope.quiz = [];
  		
		$scope.submit = function () {
			// TODO - add checking on the form
			if (!$scope.quiz.title) {
				return;
			}
			
			$http({
				method: 'POST',
				url: '/api/quizzes',
				data: {
					"title": $scope.quiz.title
				},
				headers: {
					'Content-Type': 'application/json;'
				}
			}).success(function (data) {
				$modalInstance.close();
				$location.path('/main/quizzes/' + data._id + '/edit');
			});

		};
		
		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	});
