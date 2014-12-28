'use strict';

angular.module('peckApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('listQuizzes', {
        url: '/main/quizzes',
        templateUrl: 'app/main/quizzes/list/listQuizzes.html',
        controller: 'ListQuizzesCtrl',
        authenticate: true
      })
      .state('editQuiz', {
        url: '/main/quizzes/:quizID/edit',
        templateUrl: 'app/main/quizzes/edit/editQuiz.html',
        controller: 'EditQuizCtrl',
        authenticate: true
      });
  });