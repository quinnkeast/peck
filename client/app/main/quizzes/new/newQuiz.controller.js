'use strict';

angular.module('peckApp')
  .controller('NewQuizCtrl', function ($scope, $location, $http, $modalInstance, Question, Quiz, Course, $q, existingCourses) {
		
		$scope.quiz = new Quiz();
		$scope.quiz.course = [];
		
		$scope.existingCourses = existingCourses;
		
  		$scope.courseSelectConfig = {
			create: true,
			labelField: 'name',
			valueField: 'name',
			searchField: 'name',
			maxItems: 1,
		};
		
		$scope.submit = function (quiz) {
			// TODO - add checking on the form
			if (!$scope.quiz.title) {
				return;
			}
			
			//quiz.course.toString();
			
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
