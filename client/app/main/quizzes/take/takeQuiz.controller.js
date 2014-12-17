'use strict';

angular.module('peckApp')
  .controller('TakeQuizCtrl', function ($scope, $http, $stateParams, $q) {
    $scope.quiz;
    $scope.questions = [];
    
    $http.get('/api/quizzes/' + $stateParams.quizID).success(function(quiz) {
	    $scope.quiz = quiz;
    });
    
  });