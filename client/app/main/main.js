'use strict';

angular.module('peckApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('listQuizzes', {
        url: '/main',
        templateUrl: 'app/main/quizzes/list/listQuizzes.html',
        controller: 'ListQuizzesCtrl',
        authenticate: true
      });
  });