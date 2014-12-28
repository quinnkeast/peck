'use strict';

angular.module('peckApp')
	.config(function ($stateProvider) {
		$stateProvider
			.state('activeQuiz', {
				url: '/quiz/?id',
				templateUrl: 'app/quiz/quiz.html',
				controller: 'ActiveQuizCtrl',
				authenticate: true,
	    	});
	});