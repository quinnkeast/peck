'use strict';

angular.module('peckApp')
  .controller('NewQuizCtrl', function ($scope, $location, $http, $modalInstance, Question, Quiz, Course, $q) {
  
  		$scope.quiz = new Quiz();
  		//$scope.newCourse = new Course();
  		
  		$scope.existingCourses = Course.query();
  		
		$scope.submit = function (quiz) {
			// TODO - add checking on the form
			if (!$scope.quiz.title) {
				return;
			}
			
			Quiz.save(quiz).$promise.then(function (data) {
				$modalInstance.close();
				$location.path('/main/quizzes/' + data._id + '/edit');
			}, function (err) {
				// Error handler
			});
			
		};
		
		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	});
