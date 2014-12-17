'use strict';

angular.module('peckApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('editQuiz', {
        url: '/main/quizzes/:quizID/edit',
        templateUrl: 'app/main/quizzes/edit/editQuiz.html',
        controller: 'EditQuizCtrl',
        authenticate: true
      })
      .state('takeQuiz', {
	      url: '/main/quizzes/:quizID',
	      templateUrl: 'app/main/quizzes/take/takeQuiz.html',
	      controller: 'TakeQuizCtrl',
	      authenticate: true
      });
  });