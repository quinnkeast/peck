'use strict';

angular.module('peckApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('activeQuiz', {
        url: '/quiz/:quizID',
        templateUrl: 'app/quiz/quiz.html',
        controller: 'ActiveQuizCtrl',
        authenticate: true
      });
  });